///ts:ref=node.d.ts
/// <reference path="./lib.d/node/node.d.ts"/> ///ts:ref:generated
module CCIDE {



    var connect = require('connect');
    var serveStatic : any = require('serve-static');
    var path = require('path');


    //serve static files:
    connect().use(serveStatic(path.resolve(__dirname + "/public"))).listen(CCIDE.Server.CLI.CLISettings.getInstance().getPort());


    //initialize server stuff:
    //...

}