import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SubmitPage.css'

const SubmitPage = () => {
  const navigate = useNavigate();

  const [isPopupVisible, setPopupVisible] = useState(false);

  // Function to toggle the popup visibility
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div style={{ textAlign: "center", padding: 50}}>
      <h1 style={{ marginBottom: '200px', marginTop: '50px'}}>Your Knowledge Chart Results</h1>
      <div className="circle"
      onClick={togglePopup} 
      style={{ cursor: 'pointer' }}
      >Report Summary</div>

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>Report Summary</h2>
            <p>AI report overview, pulled from python script</p>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}

      <button className="home-button" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SubmitPage;
