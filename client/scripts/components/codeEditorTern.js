import CodeMirror from "codemirror";
import "../../../node_modules/codemirror/addon/tern/tern";
import "../../../node_modules/codemirror/addon/tern/tern.css";
import ternEcmaScript from "../../../node_modules/tern/defs/ecmascript.json";
import taskUtils from "../logic/taskUtils";

import codeEditor from "./codeEditor";
import tern from "tern";
window.tern = tern;

function initialize(apiDefs) {
    // console.log(ternEcmaScript);
    // console.log(apiDefs);
    const CameraAPI = _.omit(apiDefs, ["__decorate", "__updateParams"]);

    const server = new CodeMirror.TernServer({defs: [ternEcmaScript, {CameraAPI, utils: taskUtils}]});
    codeEditor.editor.setOption("extraKeys", {
        "Ctrl-Space": function(cm) { server.complete(cm); },
        "Ctrl-I": function(cm) { server.showType(cm); },
        "Ctrl-O": function(cm) { server.showDocs(cm); },
        "Alt-.": function(cm) { server.jumpToDef(cm); },
        "Alt-,": function(cm) { server.jumpBack(cm); },
        "Ctrl-Q": function(cm) { server.rename(cm); },
        "Ctrl-.": function(cm) { server.selectName(cm); }
    });
    codeEditor.editor.on("cursorActivity", function(cm) { server.updateArgHints(cm); });
}
export default initialize;