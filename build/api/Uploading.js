"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

var aws = require('aws-sdk');

var S3_BUCKET = process.env.bucket;
aws.config.update({
  region: 'ap-southeast-1',
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
}); // Now lets export this function so we can call it from somewhere else
// exports.sign_s3 = (req,res) => {
// }

var uploadRoutes = function uploadRoutes(app) {
  app.post('/api/upload', function (req, res) {
    var s3 = new aws.S3();
    var fileArray = req.body.fileArray;
    var returnData = [];
    var databaseData = [];
    fileArray.map(function (item, index) {
      var s3Params = {
        Bucket: S3_BUCKET,
        Key: "".concat(item.username, "/").concat(item.code, "/").concat(item.fileName),
        Expires: 500,
        ContentType: item.fileType,
        ACL: 'public-read'
      };
      s3.getSignedUrl('putObject', s3Params, function (err, data) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            error: err
          });
        }

        returnData.push({
          signedData: data,
          fileType: item.fileType,
          url: "https://".concat(S3_BUCKET, ".s3.amazonaws.com/").concat(item.fileName)
        });
        databaseData.push("https://".concat(S3_BUCKET, ".s3.amazonaws.com/").concat(item.fileName));

        if (index === fileArray.length - 1) {
          res.json({
            success: true,
            data: returnData
          });
          var text = "UPDATE users SET upload_info = (\n\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\t\tWHEN upload_info IS NULL THEN '[]'::JSONB\n\t\t\t\t\t\t\t\tELSE upload_info\n\t\t\t\t\t\tEND\n\t\t\t\t) || '{\"code\": \"".concat(item.code, "\",\"urls\": ").concat(JSON.stringify(databaseData), "}'::JSONB WHERE username = '").concat(item.username, "';");

          _db["default"].query(text).then(function (dbResponse) {
            console.log(dbResponse.command); // console.log(dbResponse.rows[0]);
            // res.status(201).send({ ok: true });
          })["catch"](function (e) {
            // res.status(200).send({ ok: false });
            console.error(e.stack);
          });
        }
      });
    });
  });
};

var _default = uploadRoutes;
exports["default"] = _default;