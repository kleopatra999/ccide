

module CCIDE.Client {
    console.log("CCIDE Client ready");

    var lastTabsActive = [];

    var cmInstance : any = null;

    var base64UrlEncode = function (text) {
        return window.btoa(text).replace(/\+/ig, "_").replace(/\//ig, "-").replace(/=/ig, "");
    };


    var saveFunction = function () {
        console.error(cmInstance.getValue());

        var data = {
            path: cmInstance.path,
            content: cmInstance.getValue()
        };

        $.ajax({
            url: "/api/fileservice/save/" + base64UrlEncode(cmInstance.path),
            type: "POST",
            data: data
        })
    };

    window.document.addEventListener("keydown", function(e) {
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))      {
            e.preventDefault();
            saveFunction();
        }
    }, false);

    var showImage = function (fileName) {
        var url = "/api/fileservice/file/" + base64UrlEncode(fileName);
            $(".editor").html('<img src="' + url + '" >');

        $(".editor-container .nav .active").removeClass("active");
        $(".editor-container .nav").append(
            $('<li role="presentation" class="active"><a href="#">'+fileName+'</a></li>')
        );
    };

    var editFile = function(fileName, filePath) {

        var alreadyopenend = $(".editor-container .nav").find("li.nav-path-" + base64UrlEncode(filePath));

        if (alreadyopenend.length > 0) {
            $(".editor-container .nav li").removeClass("active");
            alreadyopenend.eq(0).addClass("active");
            var editor = alreadyopenend.find(".file-link").eq(0).data("editor-instance");
            $(editor.getWrapperElement()).show();
            lastTabsActive.push(editor);
            return;
        }

        $.ajax({
            url: "/api/fileservice/file/" + base64UrlEncode(filePath),
            success: function(data) {
                var container = $(".editor");


                container.find(".CodeMirror").hide();



                var editor = $("<textarea></textarea>");
                editor.val(data);

                container.append(editor);

                cmInstance = CodeMirror.fromTextArea(<HTMLTextAreaElement>editor.get(0), {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: "text/typescript",
                    saveFunction: saveFunction
                });
                cmInstance.path = filePath;
                cmInstance.setOption("theme", "default");   //mbo is very cool


                $(".editor-container .nav .active").removeClass("active");
                var navElem = $('<li role="presentation" class="active nav-path-'+base64UrlEncode(filePath)+'"></li>');
                var fileLink = $('<a class="file-link" href="#'+encodeURIComponent(fileName)+'" onclick="return false;">'+fileName+'<span class="close glyphicon glyphicon-remove"></span></span></a>');

                fileLink.data("editorinstance", cmInstance);

                navElem.append(fileLink);

                lastTabsActive.push(cmInstance);

                cmInstance.tabNavigation = navElem;

                $(".editor-container .nav").append(
                    navElem
                );
            }
        });
    };

    $(".editor-container").on("click", ".nav:not(.active) .file-link", function (event) {

        $(".editor-container .nav li").removeClass("active");
        $(event.target).parent().addClass("active");

        //hide others:
        $(".editor .CodeMirror").hide();

        lastTabsActive.push($(event.target).data("editorinstance"));

        //show
        $($(event.target).data("editorinstance").getWrapperElement()).show();
        $(event.target).data("editorinstance").focus();
    });

    $(".editor-container").on("click", ".nav:not(.active) .close", function (event) {
        event.stopPropagation();
        var editorInstance : CodeMirror.EditorFromTextArea = $(event.target).parent().data("editorinstance");

        lastTabsActive = _.without(lastTabsActive, editorInstance);

        var textarea = editorInstance.getTextArea();
        editorInstance.toTextArea();
        $(textarea).remove();

        $(event.target).parent().parent().remove();

        if (lastTabsActive.length > 0) {
            var editor = lastTabsActive[lastTabsActive.length - 1];
            editor.tabNavigation.addClass("active");
            $(editor.getWrapperElement()).show();
        }


    });

        $.ajax({
        url: "/api/fileservice/filetree",
        dataType: "json",
        success: function (data) {
            $(".filetree")
                .jstree({

                    "core": {
                        "data": data,
                        "themes": {
                            "name": "default",
                            "dots": false,
                            "icons": true
                        }
                    },
                    "plugins" : [ "wholerow", "dnd", "contextmenu" ]

                }).on("dblclick.jstree", "li", function (event) {
                    var node = $(event.target).closest("li");
                    if (node.data("file")) {

                        if (/.*\.(png|jpg|jpeg|gif|svg)$/ig.test(node.data("path"))) {
                            //try displaying as img
                            showImage(node.data("path"));
                        } else {
                            //try displaying as text
                            editFile(node.data("name"), node.data("path"));

                        }
                        event.stopPropagation();
                    }

                });
        }
    });

}