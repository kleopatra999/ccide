///ts:ref=node.d.ts
/// <reference path="../../lib.d/node/node.d.ts"/> ///ts:ref:generated



module CCIDE.Server.CLI {
    var optimist = require("optimist");
    var prompt = require("prompt");
    var _ : any = require('lodash-node');

    export class CLISettings {
        private static _instance: CLISettings = null;


        private _args: any;

        public constructor() {

            this._args = optimist.usage("CCIDE - Collaborative Cloud IDE Startup options")
                .boolean(["h"])

                .alias('p', 'port')
                .describe('p', 'Defines the http port this instance will listen on (defaults to 80)')
                .default('p', '80')

                .alias('h', 'help')
                .describe('h', 'Shows all the options available')

                .argv
            ;


            if (this._args.h) {
                console.log(optimist.showHelp());
                process.exit(0);
            }

            _.bindAll(this);
        }

        public getPort() {
            return this._args.p;
        }

        public static getInstance() : CLISettings{
            if (CLISettings._instance === null) {
                CLISettings._instance = new CLISettings();
            }
            return CLISettings._instance;
        }

    }
}
