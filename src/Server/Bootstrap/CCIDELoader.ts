///ts:ref=node.d.ts
/// <reference path="../../lib.d/node/node.d.ts"/> ///ts:ref:generated



module CCIDE.Server.Bootstrap {
    var _ : any = require('lodash-node');
    var path = require('path');
    var serveStatic : any = require('serve-static');
    var io : any = require('socket.io');
    var session : any = require('express-session');
    var compression = require("compression");
    var cookieParser : any = require('cookie-parser');
    var uuid : any = require('node-uuid');
    var sessionstore = require('sessionstore');
    var myStore = sessionstore.createSessionStore();

    export class CCIDELoader {

        private static _instance : CCIDELoader = null;

        private _cliSettings: CCIDE.Server.CLI.CLISettings = null;

        private _server;

        private _app;

        private _socketService;

        public constructor() {

            this._cliSettings = new CCIDE.Server.CLI.CLISettings();

            _.bindAll(this);
        }


        public initialize(app) {
            app.use(compression({filter: shouldCompress}));

            function shouldCompress(req, res) {
                if (req.headers['x-no-compression']) {
                    // don't compress responses with this request header
                    return false
                }
                return true;


                //TODO: We should exclude some things like already compressed stuff :)

                // fallback to standard filter function
                //return compression.filter(req, res)
            }


            app.use(serveStatic(path.resolve(__dirname + "/public")));
            app.use(cookieParser("cute kitten", {}));

            app.use(session({
                genid: function(req) {
                    return uuid.v4();  // use UUIDs for session IDs
                },
                name: "ccide",
                secret: 'cute kitten',
                store: myStore,
                saveUninitialized: true,
                resave: true
            }));

            app.use(function (req, res, next) {
                var n = req.session.views || 0;
                req.session.views = ++n;
                console.log(req.session.views);
                next();
            });

            this._app = app;
            this._registerServices();

            this._server = app.listen(this.getCLISettings().getPort());

            this._socketService = new CCIDE.Server.Services.WebsocketService.WebsocketService(this._server, myStore);

            console.log("listening on " + this.getCLISettings().getPort());

            if (this.getCLISettings().isReadOnlyModeEnabled()) {
                console.log("Readonly mode enabled");
            }
        }

        private _registerServices() {

            //TODO: autoregister services and don't hardcode them

            var fts = new CCIDE.Server.Services.FileService.FileTreeService(this._app);
            var fs = new CCIDE.Server.Services.FileService.FileService(this._app);
            var fes = new CCIDE.Server.Services.FileService.FileEditService(this._app);
            var gss = new CCIDE.Server.Services.GitService.GitStatusService(this._app);


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
