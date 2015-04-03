
///ts:ref=shelljs.d.ts
/// <reference path="../../../lib.d/shelljs/shelljs.d.ts"/> ///ts:ref:generated

module CCIDE.Server.Services.GitService {

    var _:any = require('lodash-node');


    var shelljs = require('shelljs');

    var fs = require('fs');
    var path = require("path");
    var zlib = require("zlib");
    var nodegit = require("nodegit");

    export class GitStatusService {


        public constructor(app) {
            _.bindAll(this);

            app.use("/api/gitservice/status", this.onStatusRequest);

        }


        public base64UrlDecode (text) {
            text = (text + '===').slice(0, text.length + (text.length % 4));
            text = text.replace(/-/g, '+').replace(/_/g, '/');

            return new Buffer(text, "base64").toString("ascii");
        }


        public onStatusRequest (req, res, next){

            var answer = {};

            nodegit.Repository.open(path.resolve(".git"))
                .then(function(repo) {
                    repo.getStatus().then(function(statuses) {
                        function statusToText(status) {
                            var words = [];
                            if (status.isNew()) { words.push("new"); }
                            if (status.isModified()) { words.push("modified"); }
                            if (status.isTypechange()) { words.push("typechange"); }
                            if (status.isRenamed()) { words.push("renamed"); }
                            if (status.isIgnored()) { words.push("ignored"); }
                            if (status.isDeleted()) { words.push("deleted"); }

                            if (_.contains(status.status(), "INDEX_NEW")) {
                                words.push("index_new");
                            }
                            return words.join(" ");
                        }

                        statuses.forEach(function(file) {
                            answer["/" + file.path()] = statusToText(file);
                        });

                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify(answer));

                    });
                });




        }

    }
}