import React, {useState} from "react";

export const LogsContext = React.createContext([]);

let globalLogs = [];
export const LogsProvider = React.memo(
  function LogsProvider({children}) {
    const [logs, setLogs] = useState(globalLogs);

    function clearLogs() {
      globalLogs = [];
      setLogs(globalLogs);
    }

    function addLog(log) {
      globalLogs = [...globalLogs, log];
      setLogs(globalLogs);
    }

    return <LogsContext.Provider value={{logs, addLog, clearLogs}}>
      {children}
    </LogsContext.Provider>;
  });
