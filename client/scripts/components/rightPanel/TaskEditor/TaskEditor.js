import React, {useContext} from "react";
import CodeMirrorTern from "./CodeMirrorTern";
import {options} from "./codeMirror.options";
import {EditorCodeContext} from "../../../logic/contexts/EditorCodeContext";


const TaskEditor = () => {
  const {setEditorCode, setCodeMirror} = useContext(EditorCodeContext);
  function onEditorCreated(codeMirror) {
    console.log(`setCodeMirrorHandle: `, codeMirror);
    setCodeMirror(codeMirror);
  }
  return <CodeMirrorTern defaultValue={options.value} options={options} onChange={setEditorCode} onEditorCreated={onEditorCreated}/>;
};

export default TaskEditor;