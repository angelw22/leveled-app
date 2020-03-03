import pgClient from '../db';
var aws = require('aws-sdk'); 

const S3_BUCKET = process.env.bucket

aws.config.update({
	region: 'ap-southeast-1',
	accessKeyId: process.env.AWSAccessKeyId,
	secretAccessKey: process.env.AWSSecretKey
})

// Now lets export this function so we can call it from somewhere else
// exports.sign_s3 = (req,res) => {
// }

const uploadRoutes = app => {
  app.post('/api/upload', (req, res) => {
		const s3 = new aws.S3();
		let fileArray = req.body.fileArray
		let returnData = []
		let databaseData = []

		fileArray.map((item, index) => {
			let s3Params = {
				Bucket: S3_BUCKET,
				Key: `${item.username}/${item.code}/${item.fileName}`,
				Expires: 500,
				ContentType: item.fileType,
				ACL: 'public-read'
			}

			s3.getSignedUrl('putObject', s3Params, (err, data) => {
				if(err){
					console.log(err);
					res.json({success: false, error: err})
				}
				returnData.push({
					signedData: data, 
					fileType: item.fileType, 
					url: `https://${S3_BUCKET}.s3.amazonaws.com/${item.fileName}`
				})

				databaseData.push(`https://${S3_BUCKET}.s3.amazonaws.com/${item.fileName}`)

				if (index === fileArray.length - 1) {
					res.json({success:true, data: returnData});
					
					let text = `UPDATE users SET upload_info = (
						CASE
								WHEN upload_info IS NULL THEN '[]'::JSONB
								ELSE upload_info
						END
				) || '{"code": "${item.code}","urls": ${JSON.stringify(databaseData)}}'::JSONB WHERE username = '${item.username}';`

					pgClient.query(text)
					.then(dbResponse => {
						console.log(dbResponse.command)
						// console.log(dbResponse.rows[0]);
						// res.status(201).send({ ok: true });
					})
					.catch(e => {
						// res.status(200).send({ ok: false });
						console.error(e.stack);
					});
				}
			});
		})
  });
}

export default uploadRoutes;
