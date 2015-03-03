

module CCIDE.Server.Services.FileService {

    var _ : any = require('lodash-node');

    var fs = require('fs');

    export class FileTreeService {

        public constructor(app) {
            _.bindAll(this);

            app.use("/api/fileservice/filetree", this.onRequest);

        }

        public onRequest (req, res, next) {
            var path = CCIDE.Server.Bootstrap.CCIDELoader.getInstance().getCLISettings().getWorkspaceDirectory();

            fs.readdir(path, function(error, files) {
                var body = JSON.stringify(files);

                res.writeHead(200, {
                    'Content-Type': 'application/json' });

                res.write(body, 'utf8');
                res.end();
            });

        }

    }

}