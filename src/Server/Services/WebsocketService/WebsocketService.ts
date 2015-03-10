

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

            this.chat(client, "/e entered the room.");
        }

        public sendMessage(identifier, message) {
            _.forEach(this._connections, function(elem) {
                elem.sendMessage(identifier, message);
            });

        }

        public getConnectedNames(): string[] {
            var answer = [];

            _.forEach(this._connections, function(con) {
                answer.push(con.getName());
            });
            return answer;
        }

        public onChat(client, message) {
            if (message.message.trim().toLocaleLowerCase() === "/list") {
                //show all connected clients
                client.sendMessage("chat", {from: "System", message: "Persons in this room: " + this.getConnectedNames().join(", ")});
                return;
            }
            this.sendMessage("chat", message);
        }

        public onMessage(client, message) {
            console.log("message received", message);
        }

        public onDisconnect(client) {
            this._connections = _.without(this._connections, client);
            this.chat(client, "/e disconnected.");
        }


    }
}