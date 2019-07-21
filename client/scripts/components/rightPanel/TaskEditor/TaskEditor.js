import React, {useContext} from "react";
import CodeMirrorTern from "./CodeMirrorTern";
import {options} from "./codeMirror.options";
import {EditorCodeContext} from "./EditorCodeContext";


const TaskEditor = () => {
  const {setEditorCode} = useContext(EditorCodeContext);
  setEditorCode(options.value);
  return <CodeMirrorTern defaultValue={options.value} options={options} onChange={setEditorCode}/>;
};
export default TaskEditor;
/*
* let editorModel = {
    editor: taskEditor,
    setEditorCode: function (task) {
        this.updateTaskCode(); // Update current task code
        this.editor.setValue(task.code);
        this.currentTaskEdited = task;
    },
    currentTaskEdited: null, // null -> scratchpadŁ
    updateTaskCode: function () {
        if (this.currentTaskEdited && this.currentTaskEdited.code) {
            this.currentTaskEdited.code = this.editor.getValue();
        }
    }
};*/