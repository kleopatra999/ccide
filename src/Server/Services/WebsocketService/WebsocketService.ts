

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

        public chat(client, message) {
            this.sendMessage("chat", {from: client.getName(), message: message});
        }


        public _onConnection(socketConnection) {
            var client = new WebsocketConnection(socketConnection, this);
            this._connections.push(client);

            this.chat(client, "Entered the room");
        }

        public sendMessage(identifier, message) {
            _.forEach(this._connections, function(elem) {
                elem.sendMessage(identifier, message);
            });

        }

        public onChat(client, message) {
            this.sendMessage("chat", message);
        }

        public onMessage(client, message) {
            console.log("message received", message);
        }

        public onDisconnect(client) {
            console.log("disconnected");
            this._connections = _.without(this._connections, client);
            this.chat(client, "Disconnected");
        }


    }
}