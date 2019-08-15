import React, {useContext} from "react";
import {EditorCodeContext, EditorCodeProvider} from "../logic/contexts/EditorCodeContext";
import {TasksContext, TasksProvider} from "../logic/contexts/TasksContext";
import {LogsContext, LogsProvider} from "../logic/contexts/LogsContext";
import {CameraProvider} from "./hoc/CameraContext";
import TaskManagerInitializer from "../logic/TaskManager";


const TaskManagerWrapper = ({children}) => {
  const LogsCtx = useContext(LogsContext);
  const TasksCtx = useContext(TasksContext);
  const EditorCodeCtx = useContext(EditorCodeContext);

  // DK: Initialize only once?
  TaskManagerInitializer({LogsCtx, TasksCtx, EditorCodeCtx});
  return children;
};

const AppProviders = ({children}) => {
  console.log(`AppProvidersWrapper.children: `, children);
  return <EditorCodeProvider><TasksProvider><LogsProvider><CameraProvider>

    <TaskManagerWrapper>{children}</TaskManagerWrapper>

  </CameraProvider></LogsProvider></TasksProvider></EditorCodeProvider>;
};

export default AppProviders;