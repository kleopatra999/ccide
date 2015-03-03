///ts:ref=node.d.ts
/// <reference path="../../lib.d/node/node.d.ts"/> ///ts:ref:generated



module CCIDE.Server.CLI {
    var optimist = require("optimist");
    var prompt = require("prompt");
    var _ : any = require('lodash-node');
    var path = require('path');

    export class CLISettings {
        private static _instance: CLISettings = null;


        private _args: any;

        public constructor() {

            this._args = optimist.usage("CCIDE - Collaborative Cloud IDE Startup options")
                .boolean(["h"])

                .alias('p', 'port')
                .describe('p', 'Defines the http port this instance will listen on (defaults to 80)')
                .default('p', '80')

                .alias('w', 'workspace')
                .describe('p', 'Sets the workspace to the given directory (relative or absolute path). If not set the current directory is used.')
                .default('p', false)


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

        public getWorkspaceDirectory() {
            if (this._args.w === false) {
                return process.cwd();
            }
            return path.resolve(this._args.w);
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
