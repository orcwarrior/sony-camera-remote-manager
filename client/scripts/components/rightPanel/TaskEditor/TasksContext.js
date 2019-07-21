import React, {useState} from "react";

export const TasksContext = React.createContext([]);

export function TasksProvider({children}) {
  const [tasks, setTasks] = useState([]);

  function setCurrentTask({idx, name}) {
    setTasks(tasks.map())
  }
  function createTask({name, code}, destIdx = null) {
    if (destIdx !== null)
      setTasks([...tasks.slice(0,destIdx), {name,  code}, ...tasks.slice(destIdx)]);
    else
    setTasks([...tasks, {name, code}])
  }
  function removeTask({name, idx}) {
    if (idx)
      setTasks([...tasks.slice(0,idx), ...tasks.slice(idx+1)]);
    else if (name)
      setTasks(tasks.filter(t => t.name !== name))
  }

  return <TasksContext.Provider value={{tasks, createTask, removeTask, setCurrentTask}}>
    {children}
  </TasksContext.Provider>;
}