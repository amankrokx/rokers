import React, { useEffect, useState } from "react"
// import './App.css'

function App() {
  const [myVar, setMyVar] = useState(0)
  
  console.log("Rendered")
  function myFunction() {
    // alert("Hello!")
    console.log(myVar)
    setMyVar(myVar + 1)
  }
  return (
   <>
    <h1>Rokers</h1>
    <button onClick={myFunction}>Clicked</button>
    <span>{myVar}</span>
   </>
  )
}

export default App
