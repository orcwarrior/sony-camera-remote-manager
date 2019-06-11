import CameraAPI from "../CameraAPI";
import React from "react";


function CameraParam({status, name, meta, updateCb}) {
    function describeParam() {
        // if (this.camera._forceUpdate) this.camera._forceUpdate = false;
        const value = status.current;
        const {disabled, icon, prefix, class: cssClass} = meta || {};
        if (disabled) return null;

        const iconConcrete = (meta && meta.icons) ? meta.icons[value] : null;
        // console.log("Describe param: ", name, meta);

        if (iconConcrete) return <div className={cssClass}>{prefix}
            <i className="material-icons">{iconConcrete}</i></div>;
        else if (icon) return <div><i className="material-icons">{icon}</i>
            <div className={`value ${cssClass}`}>{prefix}{value}</div>
        </div>;
        else return <div className={`value ${cssClass}`}>{prefix}{value}</div>;
    }

    async function clickHandler(event) {
        console.log(`Click.status: `, status, name, updateCb);
        const newVal = await CameraAPI.call[name].next();
        if (updateCb) updateCb(newVal);
    };

    async function rightClickHandler(event, model) {
        event.preventDefault();
        event.stopPropagation();
        const newVal = await CameraAPI.call[name].prev();
        if (updateCb) updateCb(newVal);
        return false;
    };

    // console.log("{status, name, meta, camera}: ", {status, name, meta, camera});
    return <li onClick={clickHandler} onContextMenu={rightClickHandler}>{describeParam()}</li>
}


export {CameraParam}