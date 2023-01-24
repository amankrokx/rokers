import React, { useEffect, useState } from "react"
import Albums from "./components/Albums"
import FeaturedArtist from "./components/FeaturedArtist"
import Navigation from "./components/Navigation"
import NowPlaying from "./components/NowPlaying"
import RecentlyPlayed from "./components/RecentlyPlayed"
import SnackbarUtils from "./components/SnackbarUtils"
// import './App.css'

function App() {

  useEffect(() => {
    SnackbarUtils.info("Welcome to Rokers!")
  }, [])

  return (
      <div className="root" style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        padding: '8px 16px',
        alignContent: 'center',
        minWidth: '346px',
        maxWidth: '440px',
      }}>
        <Navigation />
        <br></br>
        <FeaturedArtist />
        <Albums />
        <br></br>
        <RecentlyPlayed />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <NowPlaying />
      </div>
  )
}

export default App
