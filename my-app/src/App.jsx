import { useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import copVisionLogo from './images/copvision_logo_resized.png'
import Bell_headshot from "./images/Bell_headshot.jpeg";
import Julian_headshot from "./images/Julian_headshot.jpg";
import Jack_headshot from "./images/Jack_headshot.png";
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
          <img src={copVisionLogo} className="logo" alt="Couldn't Load Logo"/>
          <h1>Welcome to Cop Vision</h1>
          <h2>Your AI assistant for filing efficient police reports!</h2>
        </div>
      </section>
  
      <section id="upload">
        <div className="card">
          <FileUpload fileInputRef={fileInputRef} onFileChange={handleFileChange} />
          <button className="uploadVid-button" onClick={handleUploadClick}>
            Upload Body Cam Footage
          </button>


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
  
      <section id="contact-us">
  <div className="contact-us">
    <h2>Contact Us</h2>
    <div className="team-members">
      <div className="team-member">
        <img src={Bell_headshot} alt="Bella Goltser" className="team-photo" />
        <h4>Bella Goltser</h4>
        <p>Backend Engineer</p>
      </div>
      <div className="team-member">
        <img src={Julian_headshot} alt="Julian Chavez" className="team-photo" />
        <h4>Julian Chavez</h4>
        <p>Project Manager</p>
      </div>
      <div className="team-member">
        <img src={Jack_headshot} alt="Jack Winkler" className="team-photo" />
        <h4>Jack Winkler</h4>
        <p style={{marginBottom:"80px"}}>Scrum Master </p>
      </div>
    </div>
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
