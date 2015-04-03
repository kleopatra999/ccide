///ts:ref=Q.d.ts
/// <reference path="../../../lib.d/q/Q.d.ts"/> ///ts:ref:generated

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

            var basePath = CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory();


            var that = this;
            var deferred = Q.defer();
            var promises = [];


            fs.readdir(basePath + dirPath, function (error, files:any) {


                var answer = [];

                _.forEach(files, function (i, key) {
                    var fileDeferred = Q.defer();
                    fs.lstat(path.resolve(basePath + dirPath + "/" + i), function (err, stat) {
                        if (err) {
                            console.error(err);
                            fileDeferred.resolve(true);
                            return;
                        }

                        var isImage = stat.isFile() && /(.*)\.(png|jpg|jpeg|gif|svg)/ig.test(i);

                        var current = {
                            text: i,

                            children: [],
                            icon: stat.isFile() ? "glyphicon glyphicon-file" : "glyphicon glyphicon-folder-open",
                            li_attr: {"data-name": i, "data-path": dirPath + "/" + i, "data-file": stat.isFile(), "data-directory": stat.isDirectory(), "data-size": stat.size }
                        };
                        if (isImage) {
                            current.icon = "glyphicon glyphicon-picture";
                        }
                        answer.push(current);
                        if (stat.isDirectory() && i !== ".git" && i !== "node_modules" && i !== ".tscache" && i !== ".idea") {
                            that._getRecursive(dirPath + "/" + i).then(function(subFiles) {
                                current.children = subFiles;
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

            this._getRecursive("").then(function(answer) {
                var body = JSON.stringify(answer);

                res.writeHead(200, {
                    'Content-Type': 'application/json' });

                res.write(body, 'utf8');
                res.end();
            });

        }

    }

}