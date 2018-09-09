import rivets from "rivets";

const logTabEl = document.querySelector(".log.tab-content")
const logModel = {
    logs: [],
    addLog: function (text) {
        this.logs.push(text);
    },
    clearLogs: function () {
        this.logs = []
    }
};

rivets.bind(logTabEl,logModel);

export default logModel;