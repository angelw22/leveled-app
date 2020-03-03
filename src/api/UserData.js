import pgClient from '../db';

const userDataRoutes = app => {
	app.post('/api/userdata', (req, res) => {
		let text = `SELECT upload_info FROM users WHERE username = '${req.body.username}';`
		pgClient.query(text)
		.then(dbResponse => {
			// console.log(dbResponse.rows[0]);
			res.status(201).send({ ok: true, data: dbResponse.rows[0] });
		})
		.catch(e => {
			res.status(200).send({ ok: false });
			console.error(e.stack);
		});

	});
}

export default userDataRoutes;