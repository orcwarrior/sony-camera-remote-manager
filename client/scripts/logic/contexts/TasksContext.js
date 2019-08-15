import React, {useState} from "react";

export const TasksContext = React.createContext([]);

let globalTasks = [];

export function TasksProvider({children}) {
  const [tasks, setTasks] = useState(globalTasks);

  function setCurrentTask({idx, name}) {
    alert("to implement");
    globalTasks = globalTasks.map(task => ({...task, active: false}));
    globalTasks[idx].active = true;
  }
  function createTask({name, code, active}, destIdx = null) {
    if (!name) name = `TASK-${globalTasks.length+1}`;
    globalTasks = globalTasks.map(task => ({...task, active: false}));

    if (destIdx !== null)
      globalTasks = [...globalTasks.slice(0,destIdx), {name,  code, active}, ...globalTasks.slice(destIdx)];
    else
      globalTasks = [...globalTasks, {name, code, active}];
      setTasks(globalTasks);
  }
  function removeTask({name, idx}) {
    if (idx)
      globalTasks = [...tasks.slice(0,idx), ...tasks.slice(idx+1)]
    else if (name)
      globalTasks = globalTasks.filter(t => t.name !== name)
      setTasks(globalTasks)
  }

  return <TasksContext.Provider value={{tasks, createTask, removeTask, setCurrentTask}}>
    {children}
  </TasksContext.Provider>;
}