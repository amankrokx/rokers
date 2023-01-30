import React from "react";
import { useEffect } from "react";
import bring from "../bring";
import "./index.css"

export default function Controls() {

    function changeVolume(e) {
        const val = e.target.value
        console.log(val)
        bring({
            path: "command/volume-" + val,
            options: {
                method: "GET"
            }
        })
    }

    return <div className="controls">
        <div className="playArrow" onClick={() => {
            bring({
                path: "command/prev",
                options: {
                    method: "GET"
                }
            })
        }}>
            <span className="material-icons">skip_previous</span>
        </div>
        <input
            type="range"
            className="seek" 
            min="0"
            max="255"
            defaultValue="255"
            onTouchEnd={changeVolume}
            onMouseUp={changeVolume}
        />
        <div className="playArrow" onClick={() => {
            bring({
                path: "command/next",
                options: {
                    method: "GET"
                }
            })
        }}>
            <span className="material-icons">skip_next</span>
        </div>
    </div>
}