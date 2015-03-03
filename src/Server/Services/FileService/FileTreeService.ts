

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

        private _getRecursive(dirPath) : Q.Promise<any> {

            var that = this;
            var deferred = Q.defer();
            var promises = [];


            fs.readdir(dirPath, function (error, files:any) {


                var answer = {};

                _.forEach(files, function (i, key) {
                    var fileDeferred = Q.defer();
                    fs.lstat(path.resolve(dirPath + "/" + i), function (err, stat) {
                        if (err) {
                            console.error(err);
                            fileDeferred.resolve(true);
                            return;
                        }
                        answer[i] = {
                            stat: stat,
                            file: stat.isFile(),
                            link: stat.isSymbolicLink(),
                            directory: stat.isDirectory()
                        };
                        if (stat.isDirectory()) {
                            that._getRecursive(dirPath + "/" + i).then(function(subFiles) {
                                answer[i].subFiles = subFiles;
                                fileDeferred.resolve(stat);
                            });
                        } else {
                            fileDeferred.resolve(stat);
                        }

                    });

                    promises.push(fileDeferred.promise);
                });

                return Q.allSettled(promises).then(function () {
                    deferred.resolve(answer);
                });
            });

            return deferred.promise;
        }

        public onRequest (req, res, next){
            var dirPath = CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory();

            this._getRecursive(dirPath).then(function(answer) {
                var body = JSON.stringify(answer);

                res.writeHead(200, {
                    'Content-Type': 'application/json' });

                res.write(body, 'utf8');
                res.end();
            });

        }

    }

}