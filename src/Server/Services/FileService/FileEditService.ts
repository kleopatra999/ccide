

module CCIDE.Server.Services.FileService {

    var _:any = require('lodash-node');


    var fs = require('fs');
    var Q = require("q");
    var path = require("path");

    var bodyParser:any = require("body-parser");

    export class FileEditService {
        public constructor(app) {
            _.bindAll(this);

            app.use("/api/fileservice/edit", bodyParser.urlencoded({ extended: false }));
            app.use("/api/fileservice/edit", bodyParser.json());
            app.use("/api/fileservice/edit", this.onRequest);


        }


        public onRequest (req, res, next){

            res.writeHead(200, {
                'Content-Type': 'application/json' });

            res.write(req.body, 'utf8');
            res.end();

        }

    }
}