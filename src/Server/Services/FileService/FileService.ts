

module CCIDE.Server.Services.FileService {

    var _:any = require('lodash-node');


    var fs = require('fs');
    var Q = require("q");
    var path = require("path");

    var bodyParser : any = require("body-parser");

    export class FileService {


        public constructor(app) {
            _.bindAll(this);

            app.use("/api/fileservice/file", this.onLoadFileRequest);

            app.use("/api/fileservice/save", bodyParser.urlencoded({ extended: false }));
            app.use("/api/fileservice/save", bodyParser.json());

            app.use("/api/fileservice/save", this.onSaveFileRequest);


        }


        public base64UrlDecode (text) {
            text = (text + '===').slice(0, text.length + (text.length % 4));
            text = text.replace(/-/g, '+').replace(/_/g, '/');

            return new Buffer(text, "base64").toString("ascii");
        }

        public isPathInWorkingDirectory(filePath) {
            var workingDirectory = CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory();
            filePath = path.normalize(filePath);

            return filePath.indexOf(workingDirectory) === 0;

        }

        public onSaveFileRequest (req, res, next){

            var settings = CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings();

            if (! settings.isReadOnlyModeEnabled()) {
                if (! this.isPathInWorkingDirectory(filePath)) {
                    res.writeHead(403, {
                        'Content-Type': 'text/html'
                    });
                    res.end("Read only mode enabled, writes are forbidden!");
                    return;
                }
            }

            var workingDirectory = settings.getWorkspaceDirectory();
            var filePath = path.resolve(workingDirectory + req.body.path);

            if (! this.isPathInWorkingDirectory(filePath)) {
                res.writeHead(500, {
                    'Content-Type': 'text/html'
                });
                res.end("Invalid path");
                return;
            }

            var content = req.body.content;

            var stat = fs.statSync(filePath);

            fs.writeFile(filePath, content);

        }



        public onLoadFileRequest (req, res, next){

            var filePath = path.resolve(CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory() + this.base64UrlDecode(req.url.substr(1)));

            if (! this.isPathInWorkingDirectory(filePath)) {
                res.writeHead(500, {
                    'Content-Type': 'text/html',
                });
                res.end("Invalid path");
                return;
            }

            fs.exists(filePath, function (exists) {
                if (!exists) {
                    res.writeHead(404, {
                        'Content-Type': 'text/html',
                    });
                    res.end("File not found");

                    return;
                }

                var stat = fs.stat(filePath, function(err, stat) {
                    if (err || ! stat.isFile()) {
                        res.writeHead(404, {
                            'Content-Type': 'text/html',
                        });
                        res.end("Is not a file");
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/binary',
                        'Content-Length': stat.size
                    });

                    var readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);

                });

            });

        }

    }
}