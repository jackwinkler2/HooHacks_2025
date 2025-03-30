import { useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import copVisionLogo from './images/copvision_logo.png'
import Navbar from "./components/Navbar"
import FileUpload from "./components/FileUpload"
import SubmitPage from "./components/SubmitPage"
import TextInformation from "./components/TextInformation"
import './App.css'

function HomePage() {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleFormUpdate = (complete) => {
    setIsFormComplete(complete);
  };

  const handleSubmit = () => {
    if (isFormComplete && uploadedFiles.length > 0) {
      navigate("/submit");
    }
  };

  return (
    <div className="main-content">
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

      <TextInformation onFormUpdate={handleFormUpdate} />
  
      <section className="submit-section">
        <button 
          onClick={handleSubmit} 
          className={`submit-button ${isFormComplete && uploadedFiles.length > 0 ? 'active' : 'disabled'}`}
          disabled={!isFormComplete || uploadedFiles.length === 0}
        >
          Process Information
        </button>
      </section>

      <section id="contact us">
        <div className="contact-us">
          <h3>Contact us</h3>
        </div>
      </section>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit" element={<SubmitPage />} />
      </Routes>
    </Router>
  );
}

export default App;
