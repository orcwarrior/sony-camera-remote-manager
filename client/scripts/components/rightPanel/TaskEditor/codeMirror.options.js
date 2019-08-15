import {defaultTaskCode} from "../../../logic/TaskManager";

export const options =  {
    lineNumbers: true,
    theme: "darcula",
    mode: "javascript",
    tabSize: 2,
    keyMap: "sublime",
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 1,
    gutters: ["exec-cur-line"],

    value: defaultTaskCode("TEST-TASK")
};