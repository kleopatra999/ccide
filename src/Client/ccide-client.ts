

module CCIDE.Client {
    console.log("CCIDE Client ready");


    var buildTree = function(treeData) {
        var answer = "<ul>";
        _.forEach(treeData, function(elem: any, key) {
            answer +="<li>";
            answer += key;
            if(elem.directory && elem.subFiles) {
                answer += buildTree(elem.subFiles);
            }
            answer+="</li>";
        });
        answer+="</ul>";
        return answer;
    };

    $.ajax({
        url: "/api/fileservice/filetree",
        dataType: "json",
        success: function (data) {
            var code = buildTree(data);
            $(".filetree").html(code);
        }
    });

}