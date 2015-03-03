///ts:ref=node.d.ts
/// <reference path="../../lib.d/node/node.d.ts"/> ///ts:ref:generated



module CCIDE.Server.Bootstrap {
    var _ : any = require('lodash-node');
    var path = require('path');



    export class CCIDELoader {

        private static _instance : CCIDELoader = null;

        private _cliSettings: CCIDE.Server.CLI.CLISettings = null;

        public constructor() {

            this._cliSettings = new CCIDE.Server.CLI.CLISettings();

            _.bindAll(this);
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
