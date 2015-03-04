

module CCIDE.Client {
    console.log("CCIDE Client ready");


    var base64UrlEncode = function (text) {
        return window.btoa(text).replace(/\+/ig, "_").replace(/\//ig, "-").replace(/=/ig, "");
    };

    var buildTree = function(treeData, path) {
        var answer = "<ul>";
        _.forEach(treeData, function(elem: any, key) {
            answer +='<li>';
            answer += key;
            if (elem.file) {
                answer += " (" + Math.round(elem.stats.size / 10.24) / 100 + " KB, <span class=\"edit\" data-path=\""+path + "/" + key + "\">edit</span>)";
            }
            if(elem.directory && elem.subFiles) {
                answer += buildTree(elem.subFiles, path + "/" + key);
            }
            answer+="</li>";
        });
        answer+="</ul>";
        return answer;
    };

    $(".filetree").on("click", ".edit", function () {

        $.ajax({
            url: "/api/fileservice/file/" + base64UrlEncode($(this).data("path")),
            success: function(data) {
                var container = $(".editor-container");
                container.empty();

                var editor = $("<textarea></textarea>");
                editor.val(data);

                container.append(editor);

                CodeMirror.fromTextArea(<HTMLTextAreaElement>editor.get(0), {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: "text/typescript"
                });
            }
        });

        return true;
    });

    $.ajax({
        url: "/api/fileservice/filetree",
        dataType: "json",
        success: function (data) {
            var code = buildTree(data, "");
            $(".filetree").html(code);
        }
    });

}