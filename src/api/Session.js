const bcrypt = require('bcrypt');
import pgClient from '../db';
import { getUser } from '../utils';

const sessionRoutes = app => {
  app.get('/api/session', async (req, res) => {
    let user = await getUser(req.session.id);
    if (user) {
      res.status(200).send({ ok: true, data: JSON.parse(user).username });
    } else {
      res.status(200).send({ ok: false });
    }
  });

  app.post('/api/session', (req, res) => {
    pgClient.query(`SELECT password FROM users WHERE username = '${req.body.username}'`)
    .then(dbResponse => {
      if (dbResponse.rows[0] === undefined) {
        res.status(200).send({ ok: false });
      } else {
        bcrypt.compare(req.body.password, dbResponse.rows[0].password, (err, authResponse) => {
          if (err) {
            throw new Error(err);
          };

          if (authResponse === true) {
            // update session
            req.session.username = req.body.username;
            req.session.isLoggedIn = true;
            res.status(200).send({ ok: true, data: `Welcome, ${ req.session.username }` });
          } else {
            res.status(200).send({ ok: false });
          }
        });
      }
    })
    .catch(e => console.error(e.stack));
  })

  app.delete('/api/session', async (req, res) => {
    sessionEventPub.publish('destroying sessionID', req.sessionID);
    socketEventSub.on('message', destroySession);
    function destroySession(channel, message) {
      if (channel === 'socketID destroyed' && message && req) {
        req.session.destroy(err => {
          if (err) {
            res.status(200).send({ ok: false });
          } else {
            res.status(200).send({ ok: true });
          }
          socketEventSub.off('message', destroySession);
        });
      }
    }
  })
}

export default sessionRoutes;
