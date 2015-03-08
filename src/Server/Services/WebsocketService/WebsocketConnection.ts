

module CCIDE.Server.Services.WebsocketService {

    var _:any = require('lodash-node');
    var io : any = require('socket.io');

    var fs = require('fs');
    var Q = require("q");
    var path = require("path");

    var bodyParser:any = require("body-parser");

    export class WebsocketConnection {

        private _socket;

        private _websocketService;

        public constructor(socket, websocketService) {
            _.bindAll(this);

            this._socket = socket;
            this._websocketService = websocketService;

            socket.on('message', this._onMessage);
            socket.on('disconnect', this._onDisconnect);

            socket.on('my other event', this._onMessage);
            this.sendMessage("news", "This is a simple test message");

        }

        public once(identifier, callback) {
            this._socket.once(identifier, callback);
        }

        public on(identifier, callback) {
            this._socket.on(identifier, callback);
        }

        public removeListener(identifier, callback) {
            this._socket.removeListener(identifier, callback);
        }

        public removeAllListeners(identifier) {
            this._socket.removeAllListeners(identifier);
        }

        public sendMessage(identifier, message) {
            console.log("emitting message " + identifier, message);
            this._socket.emit(identifier, message);
        }

        public _onMessage(message) {
            this._websocketService.onMessage(this, message);
        }

        public _onDisconnect() {
            this._websocketService.onDisconnect(this);
        }


    }
}