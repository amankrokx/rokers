import React, { useEffect } from "react";
import bring from "../bring";
import weekend from "../../assets/weekend.avif";
import ashiqui2 from "../../assets/ashiqui.jpg";
import idiots from "../../assets/idiots.jpg";
import "./index.css";

export default function Albums() {
    const [albums, setAlbums] = React.useState([])

    useEffect(() => {
        // fetch albums
        bring({path: "albums"})
        .then((data) => data.json())
        .then((albums) => {
            setAlbums(albums)
            console.log(albums)
        })
    }, [])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                margin: "16px 0 0 0",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <span
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "var(--pt)",
                    }}
                >
                    Albums
                </span>
                <span className="seeAll">See all</span>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    flexWrap: "wrap",
                    paddingTop: 16,
                }}
            >
                {albums &&
                    albums.length > 0 &&
                    albums.map((album, index) => (
                        <article key={album.albumID} className="albums" style={{ backgroundImage: `url(${album.albumImage})` }}>
                            <div className="albumControlWrapper">
                                <div className="albumNameAndArtist">
                                    <span>{album.albumName}</span>
                                    {/* <span>{album.artist}</span> */}
                                </div>
                                <div className="playArrow">
                                    <span className="material-icons-outlined">play_arrow</span>
                                </div>
                            </div>
                            <img className="albumReflection" src={album.albumImage} />
                        </article>
                    ))}
            </div>
        </div>
    )
}