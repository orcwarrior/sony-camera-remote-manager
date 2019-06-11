import CodeMirror from "codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/javascript/javascript";

import "../../../node_modules/codemirror/addon/dialog/dialog.css";

import "../../../node_modules/codemirror/addon/hint/show-hint";
import "../../../node_modules/codemirror/addon/hint/show-hint.css";

import "../../../node_modules/codemirror/addon/edit/matchbrackets";
import "../../../node_modules/codemirror/addon/edit/closebrackets";
import "../../../node_modules/codemirror/addon/edit/trailingspace";

import "../../../node_modules/codemirror/addon/fold/foldgutter.css";
import "../../../node_modules/codemirror/addon/fold/foldcode";
import "../../../node_modules/codemirror/addon/fold/brace-fold";
import "../../../node_modules/codemirror/addon/fold/indent-fold";

import "../../../node_modules/codemirror/keymap/sublime";

import "../../../node_modules/codemirror/theme/darcula.css";

/**

const taskEditorTab = document.querySelector(".task.tab-content");

const defaultValue =
    `// No task loaded, treat this code as Scratchpad ;-)
await CameraAPI.captureAndSave();
`;
const taskEditor = CodeMirror(taskEditorTab.querySelector("#code-editor"), {
    lineNumbers: true,
    theme: "darcula",
    mode: "javascript",
    tabSize: 2,
    keyMap: "sublime",
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 1,
    gutters: ["exec-cur-line"],

    value: defaultValue
});
let editorModel = {
    editor: taskEditor,
    setCurrentTask: function (task) {
        this.updateTaskCode(); // Update current task code
        this.editor.setValue(task.code);
        this.currentTaskEdited = task;
    },
    currentTaskEdited: null, // null -> scratchpad
    updateTaskCode: function () {
        if (this.currentTaskEdited && this.currentTaskEdited.code) {
            this.currentTaskEdited.code = this.editor.getValue();
        }
    }
};


export default editorModel;

 **/