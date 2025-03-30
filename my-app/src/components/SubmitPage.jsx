import React from "react";
import { useNavigate } from "react-router-dom";

const SubmitPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Submission Successful!</h1>
      <p>Your body cam footage has been uploaded successfully.</p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SubmitPage;
