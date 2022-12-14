import React from "react";
import "./index.css"
import photo from "../../assets/ashiqui.jpg"

export default function NowPlaying() {

    return (
        <div
            className="nowPlaying"
            style={{
                display: "flex",
                position: "fixed",
                flexDirection: "row",
                padding: "16px",
                alignContent: "center",
                height: "112px",
                borderRadius: 16,
                bottom: 24,
                backgroundColor: "var(--container)",
            }}
        >
            <div className="searchResult">
                <div className="coverPhoto">
                    <img className="actual" src={photo} alt="AlbumArt" />
                    <img className="reflection" src={photo} alt="AlbumArt" />
                </div>
                <div className="info">
                    <div className="title">Song name</div>
                    <div className="aa">
                        <div className="artist">amankrokx</div>|<div className="album">Bohra and tb</div>
                    </div>
                </div>
                <div className="playArrow playButton RadialProgress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                    style={{
                        width: 64,
                        height: 64,
                    }}>
                    <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                        play_arrow
                    </span>
                </div>
            </div>
        </div>
    )
}