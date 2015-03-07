

module CCIDE.Client {
    console.log("CCIDE Client ready");



    var cmInstance : any = null;

    var base64UrlEncode = function (text) {
        return window.btoa(text).replace(/\+/ig, "_").replace(/\//ig, "-").replace(/=/ig, "");
    };

    var buildTree = function(treeData, path) {
        var answer = "<ul>";
        _.forEach(treeData, function(elem: any, key) {
            answer +='<li data-path="' + path + '/' + key + '" class="' + (elem.file ? "file" : "directory") + '">';
            answer += key;
            if (elem.file) {
                answer += " (" + Math.round(elem.stats.size / 10.24) / 100 + " KB)";
            }
            if(elem.directory && elem.subFiles) {
                answer += buildTree(elem.subFiles, path + "/" + key);
            }
            answer+="</li>";
        });
        answer+="</ul>";
        return answer;
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

    var editFile = function(fileName) {

        $.ajax({
            url: "/api/fileservice/file/" + base64UrlEncode(fileName),
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
                cmInstance.path = fileName;
                cmInstance.setOption("theme", "default");   //mbo is very cool


                $(".editor-container .nav .active").removeClass("active");
                var navElem = $('<li role="presentation" class="active"></li>');
                var fileLink = $('<a class="file-link" href="#'+encodeURIComponent(fileName)+'">'+fileName+'</a>');

                fileLink.data("editorinstance", cmInstance);

                navElem.append(fileLink);
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

        //show
        $($(event.target).data("editorinstance").getWrapperElement()).show();
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
                            editFile(node.data("path"));

                        }
                        event.stopPropagation();
                    }

                });
        }
    });

}