///ts:ref=node.d.ts
/// <reference path="../../lib.d/node/node.d.ts"/> ///ts:ref:generated



module CCIDE.Server.Bootstrap {
    var _ : any = require('lodash-node');
    var path = require('path');
    var serveStatic : any = require('serve-static');

    export class CCIDELoader {

        private static _instance : CCIDELoader = null;

        private _cliSettings: CCIDE.Server.CLI.CLISettings = null;

        public constructor() {

            this._cliSettings = new CCIDE.Server.CLI.CLISettings();

            _.bindAll(this);
        }


        public initialize(app) {

            app.use(serveStatic(path.resolve(__dirname + "/public")));

            this._registerServices(app);

            app.listen(this.getCLISettings().getPort());

            console.log("listening on " + this.getCLISettings().getPort());

            if (this.getCLISettings().isReadOnlyModeEnabled()) {
                console.log("Readonly mode enabled");
            }
        }

        private _registerServices(app) {

            //TODO: autoregister services and don't hardcode them

            var fts = new CCIDE.Server.Services.FileService.FileTreeService(app);
            var fs = new CCIDE.Server.Services.FileService.FileService(app);


        }

        public getCLISettings() : CCIDE.Server.CLI.CLISettings {
            return this._cliSettings;
        }

        public static getInstance() : CCIDELoader {
            if (CCIDELoader._instance === null) {
                CCIDELoader._instance = new CCIDELoader();
            }
            return CCIDELoader._instance;
        }

    }
}
