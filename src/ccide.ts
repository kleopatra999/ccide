///ts:ref=node.d.ts
/// <reference path="./lib.d/node/node.d.ts"/> ///ts:ref:generated
module CCIDE {



    var connect = require('connect');
    var serveStatic : any = require('serve-static');
    var path = require('path');


    var loader = CCIDE.Server.Bootstrap.CCIDELoader.getInstance();

    //serve static files:
    connect().use(serveStatic(path.resolve(__dirname + "/public"))).listen(loader.getCLISettings().getPort());


    //initialize server stuff:
    //...

}