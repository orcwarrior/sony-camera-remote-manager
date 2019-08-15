import {TasksContext} from "../../logic/contexts/TasksContext";
import React, {useContext, useState} from "react";


const TasksStrip = ({width}) => {
  const {tasks = [], removeTask, setCurrentTask} = useContext(TasksContext);
  const [drawerOpened, setDrawerOpened] = useState(false);

  function renderNoTasksMsg() {
    return <div className="no-tasks">Seems like you don't have any task sequence to run at the camera by now.</div>
  }
  function renderTasksStripHandle() {
    return <div className="tasks-handle-wrapper" ><div className="tasks-handle"><i className="material-icons">expand_less</i></div></div>
  }
  const openDrawer = () => setDrawerOpened(true);
  const closeDrawer = () => setDrawerOpened(false);
  const getTaskStripClasses = () => `tasks-strip ${drawerOpened ? "drawed" : ""}`;

  return <div className={getTaskStripClasses()} style={{width}}
              onMouseOver={openDrawer} onMouseOut={closeDrawer}>
    {renderTasksStripHandle()}
    <div className="task-container">
      {tasks.map(task => <div className={`task ${task.active ? "active" : ""}`}>{task.name}</div> )}
      {!tasks.length && renderNoTasksMsg()}
    </div>
  </div>
};

export default TasksStrip;