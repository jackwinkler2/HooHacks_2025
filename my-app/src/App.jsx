import { useState, useRef } from 'react'
import copVisionLogo from './images/copvision_logo.png'
import Navbar from "./components/Navbar"
import FileUpload from "./components/FileUpload"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SubmitPage from "./components/SubmitPage"; // Import new page
import './App.css'

function App() {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store uploaded files
/*  const navigate = useNavigate(); // Hook for navigation */

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    if (files.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...files]); // Append new files
    }
  };

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
          <FileUpload fileInputRef={fileInputRef} onFileChange={handleFileChange} />
          <button onClick={handleUploadClick}>
            Upload Body Cam Footage
          </button>

          {/* Display uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h3>Uploaded Files:</h3>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section id="info">
        <div className="input_information">
          <h2> File Information:</h2>
        </div>
      </section>
 
          <button onClick={() => navigate("/submit")}  className="submit_button">
            Process Information
          </button>

      <section id="contact us">
        <div className="contact-us">
          <h3>Contact us</h3>
        </div>
      </section>
    </>
  )
}

export default App;
