import React, {useState} from "react";
import {defaultTaskCode} from "../TaskManager";

export const EditorCodeContext = React.createContext({});

let codeMirrorStored = {};
export function EditorCodeProvider({children}) {
  const [editorCode, setEditorCode] = useState(defaultTaskCode("TEST-TASK"));

  const setCodeMirror = (cm) => {
    Object.assign(codeMirrorStored, cm); // DK: I hate it :(
  };
  return <EditorCodeContext.Provider value={{editorCode, setEditorCode, codeMirror: codeMirrorStored, setCodeMirror}}>
    {children}
  </EditorCodeContext.Provider>;
}