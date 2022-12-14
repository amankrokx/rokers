import React, { useEffect, useState } from "react"
import Albums from "./components/Albums"
import FeaturedArtist from "./components/FeaturedArtist"
import Navigation from "./components/Navigation"
import NowPlaying from "./components/NowPlaying"
import RecentlyPlayed from "./components/RecentlyPlayed"
// import './App.css'

function App() {

  return (
      <div className="root" style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        padding: '24px',
        alignContent: 'center',
        width: '100vw',
        minWidth: '346px',
        maxWidth: '440px',
      }}>
        <Navigation />
        <br></br>
        <FeaturedArtist />
        <br></br>
        <Albums />
        <br></br>
        <RecentlyPlayed />
        <br></br>
        <NowPlaying />
        <div>fdsgdfg</div>
      </div>
  )
}

export default App
