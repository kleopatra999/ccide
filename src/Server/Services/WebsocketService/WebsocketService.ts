

module CCIDE.Server.Services.WebsocketService {

    var _:any = require('lodash-node');
    var io : any = require('socket.io');

    var fs = require('fs');
    var Q = require("q");
    var path = require("path");

    var bodyParser:any = require("body-parser");

    export class WebsocketService {

        private _server;

        private _connections = [];

        public constructor(server) {
            _.bindAll(this);

            this._server = server;
            var socket = io.listen(this._server);
            socket.on('connection', this._onConnection);

        }


        public _onConnection(client) {
            this._connections.push(new WebsocketConnection(client, this));
        }

        public onMessage(client, message) {
            console.log("message received", message);
        }

        public onDisconnect(client) {
            console.log("disconnected");
        }


    }
}