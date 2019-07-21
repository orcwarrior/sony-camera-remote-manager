const CodeMirror = global.CodeMirror = window.CodeMirror = require("codemirror");

import "codemirror/addon/tern/tern";
import "codemirror/addon/tern/tern.css";

import tern from "tern";
global.tern = tern;
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/trailingspace";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/keymap/sublime";
import "codemirror/theme/darcula.css";


import CodeMirrorReact from "react-codemirror";
import CameraAPI from "../../../CameraAPI";
import taskUtils from "../../../logic/taskUtils";
import ternEcmaScript from "tern/defs/ecmascript";


export default class CodeMirrorTern extends CodeMirrorReact {
    // propTypes = {
    //     ...super.propTypes,
    //     setupTern: PropTypes.func
    // };

    constructor(...args) {
        super(...args);
    }
    setupTern(editor) {
        const server = new CodeMirror.TernServer({defs: [ternEcmaScript, {CameraAPI, utils: taskUtils}]});
        editor.setOption("extraKeys", {
            "Ctrl-Space": function(cm) { server.complete(cm); },
            "Ctrl-I": function(cm) { server.showType(cm); },
            "Ctrl-O": function(cm) { server.showDocs(cm); },
            "Alt-.": function(cm) { server.jumpToDef(cm); },
            "Alt-,": function(cm) { server.jumpBack(cm); },
            "Ctrl-Q": function(cm) { server.rename(cm); },
            "Ctrl-.": function(cm) { server.selectName(cm); }
        });
        editor.on("cursorActivity", function(cm) { server.updateArgHints(cm); });
      editor.on('change', (instance, change) => {
        if (change.text.length === 1 && change.text[0] === '.') {
          server.complete(editor)
        }
      })
    }
    componentDidMount() {
        super.componentDidMount();
        this.setupTern(this.codeMirror);
        const {onEditorCreated} = this.props;
        if (onEditorCreated) onEditorCreated(this.codeMirror);
    }
}