import React, {useState} from "react";

export const EditorCodeContext = React.createContext("");

export function EditorCodeProvider({children}) {
    const [editorCode, setEditorCode] = useState("");

    return <EditorCodeContext.Provider value={{editorCode, setEditorCode}}>
        {children}
    </EditorCodeContext.Provider>;
}