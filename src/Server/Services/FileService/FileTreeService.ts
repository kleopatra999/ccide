

module CCIDE.Server.Services.FileService {

    var _ : any = require('lodash-node');


    var fs = require('fs');
    var Q = require("q");
    var path = require("path");

    export class FileTreeService {

        public constructor(app) {
            _.bindAll(this);

            app.use("/api/fileservice/filetree", this.onRequest);

        }

        public onRequest (req, res, next) {
            var dirPath = CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory();

            fs.readdir(dirPath, function(error, files: any) {
                var promises = [];

                var answer = {};

                _.forEach(files, function(i, key) {
                    var deferred = Q.defer();
                    fs.lstat(path.resolve(dirPath + "/" + i), function(err, stat) {
                        answer[i] = {
                            stat: stat,
                            file: stat.isFile(),
                            link: stat.isSymbolicLink(),
                            directory: stat.isDirectory()
                        };
                        deferred.resolve(stat);
                    });

                    promises.push(deferred.promise);
                });

                Q.allSettled(promises).then(function() {
                    var body = JSON.stringify(answer);

                    res.writeHead(200, {
                        'Content-Type': 'application/json' });

                    res.write(body, 'utf8');
                    res.end();
                });
            });

        }

    }

}