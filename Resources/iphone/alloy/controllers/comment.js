function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function deleteComment(_comment) {
        _comment.destroy({
            data: {
                photo_id: currentPhoto.id,
                id: _comment.id
            },
            success: function() {
                loadComments(null);
            },
            error: function(_e) {
                Ti.API.error("error: " + _e.message);
                alert("Error deleteing comment");
                loadComments(null);
            }
        });
    }
    function handleDeleteRow(_event) {
        var collection = Alloy.Collections.instance("Comment");
        var model = collection.get(_event.row.comment_id);
        if (!model) {
            alert("Could not find selected comment");
            return;
        }
        deleteComment(model);
    }
    function loadComments() {
        var params = {
            photo_id: currentPhoto.id,
            order: "-created_at",
            per_page: 100
        };
        var rows = [];
        comments.fetch({
            data: params,
            success: function() {
                comments.each(function(comment) {
                    var commentRow = Alloy.createController("commentRow", comment);
                    rows.push(commentRow.getView());
                });
                $.commentTable.data = rows;
            },
            error: function(error) {
                alert("Error loading comments " + e.message);
                Ti.API.error(JSON.stringify(error));
            }
        });
    }
    function handleNewCommentButtonClicked() {
        var inputController = Alloy.createController("commentInput", {
            photo: currentPhoto,
            parentController: $,
            callback: function(_event) {
                inputController.getView().close();
                inputCallback(_event);
            }
        });
        inputController.getView().open();
    }
    function inputCallback(_event) {
        _event.success ? addComment(_event.content) : alert("No Comment Added");
    }
    function doOpen() {
    }
    function addComment(_content) {
        var comment = Alloy.createModel("Comment");
        var params = {
            photo_id: currentPhoto.id,
            content: _content,
            allow_duplicate: 1
        };
        comment.save(params, {
            success: function(_model) {
                Ti.API.debug("success: " + _model.toJSON());
                var row = Alloy.createController("commentRow", _model);
                if (0 === $.commentTable.getData().length) {
                    $.commentTable.setData([]);
                    $.commentTable.appendRow(row.getView(), true);
                } else $.commentTable.insertRowBefore(0, row.getView(), true);
            },
            error: function(e) {
                Ti.API.error("error: " + e.message);
                alert("Error saving new comment " + e.message);
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "comment";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.commentWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "commentWindow",
        title: "Comments"
    });
    $.__views.commentWindow && $.addTopLevelView($.__views.commentWindow);
    doOpen ? $.__views.commentWindow.addEventListener("open", doOpen) : __defers["$.__views.commentWindow!open!doOpen"] = true;
    $.__views.newCommentButton = Ti.UI.createButton({
        title: "Comment",
        id: "newCommentButton"
    });
    $.__views.commentWindow.rightNavButton = $.__views.newCommentButton;
    $.__views.commentTable = Ti.UI.createTableView({
        id: "commentTable"
    });
    $.__views.commentWindow.add($.__views.commentTable);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var parameters = arguments[0] || {};
    var currentPhoto = parameters.photo || {};
    parameters.parentController || {};
    Alloy.Collections.instance("Comment");
    true && $.newComentButton.addEventListener("click", handleNewCommentButtonClicked);
    true && $.commentTable.addEventListener("delete", handleDeleteRow);
    false;
    $.commentTable.editable = true;
    $.initialize = function() {
        loadComments();
    };
    __defers["$.__views.commentWindow!open!doOpen"] && $.__views.commentWindow.addEventListener("open", doOpen);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;