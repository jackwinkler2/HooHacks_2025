import { useState } from 'react'
import copVisionLogo from './images/copvision_logo.png'
import Navbar from "./components/Navbar"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <section id="home">
        <div>
          <img src={copVisionLogo} className="logo" alt="Couldn't Load Logo" style={{padding: 30}}/>
          <h1>Welcome to Cop Vision</h1>
          <h2>Your AI assistant for filing objective police reports</h2>
        </div>
      </section>

      <section id="upload">
        <div className="card">
          <button onClick={() => setCount(count + 1)}>
            Upload Body Cam Footage
          </button>
        </div>
      </section>

      <section id="info">
        <div className="input_information">
          <h2> File Information:</h2>
        </div>
      </section>

      <section id="contact us">
        <div className="contact-us">
          <h3>Contact us</h3>
        </div>
      </section>
    </>
  )
}

export default App;
