import React from "react";

const FileUpload = ({ fileInputRef, onFileChange }) => {
  return (
    <input
      type="file"
      ref={fileInputRef} // This allows the parent component to control it
      accept=".mp4"
      style={{ display: "none" }} // Hides the file input
      onChange={onFileChange} // Calls function when a file is selected
    />
  );
};

export default FileUpload;
