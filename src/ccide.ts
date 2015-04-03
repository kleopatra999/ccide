///ts:ref=node.d.ts
/// <reference path="./lib.d/node/node.d.ts"/> ///ts:ref:generated
///ts:ref=shelljs.d.ts
/// <reference path="./lib.d/shelljs/shelljs.d.ts"/> ///ts:ref:generated
require("shelljs/global");

module CCIDE {



    var connect = require('connect');



    var loader = CCIDE.Server.Bootstrap.CCIDELoader.getInstance();

    var app = connect();

    loader.initialize(app);


    //initialize server stuff:
    //...

}