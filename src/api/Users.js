const bcrypt = require('bcrypt');
import pgClient from '../db';

const userRoutes = app => {
  app.post('/api/users', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        throw new Error(err);
      }

      let text = `INSERT INTO users(username, password) VALUES($1, $2) RETURNING *`;
    
      pgClient.query(text, [req.body.username, hash])
        .then(dbResponse => {
          console.log(dbResponse.rows[0]);

          res.status(201).send({ ok: true });
        })
        .catch(e => {
          res.status(200).send({ ok: false });
          console.error(e.stack);
        });
    });
  });
}

export default userRoutes;
