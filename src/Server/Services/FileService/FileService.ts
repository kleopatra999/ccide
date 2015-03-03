

module CCIDE.Server.Services.FileService {

    var _:any = require('lodash-node');


    var fs = require('fs');
    var Q = require("q");
    var path = require("path");

    export class FileService {


        public constructor(app) {
            _.bindAll(this);

            app.use("/api/fileservice/file", this.onRequest);

        }


        public base64UrlDecode (text) {
            text = (text + '===').slice(0, text.length + (text.length % 4));
            text = text.replace(/-/g, '+').replace(/_/g, '/');

            return new Buffer(text, "base64").toString("ascii");
        }

        public onRequest (req, res, next){

            var filePath = path.resolve(CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory() + this.base64UrlDecode(req.url.substr(1)));
            console.log(req.url, filePath);

            var stat = fs.statSync(filePath);

            res.writeHead(200, {
                'Content-Type': 'application/binary',
                'Content-Length': stat.size
            });

            var readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        }

    }
}