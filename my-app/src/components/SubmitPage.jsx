import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import './SubmitPage.css';

const SubmitPage = () => {
  const navigate = useNavigate();

  const radius = 3; // Distance from the center
  const positions = [
    [radius, radius, 0],  // Sphere at this position will show the transcript
    [-radius, -radius, 0],
    [0, radius, 0],
    [0, -radius, 0],
    [radius, 0, 0],
    [-radius, 0, 0],
  ];

  // State to track which sphere is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // Track if the central sphere is hovered

  // State to track popups for different spheres
  const [showPopup, setShowPopup] = useState(false);
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);

  const handleSphereClick = (index) => {
    // Check if the clicked sphere is the one at [radius, radius, 0]
    if (positions[index][0] === radius && positions[index][1] === radius) {
      // Show the transcript pop-up
      setShowTranscriptPopup(true);
    } else {
      // Toggle the central sphere's general popup
      setShowPopup(!showPopup);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Your Knowledge Chart Results</h1>

      <Canvas style={{ width: "100vw", height: "70vh" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <OrbitControls />

        {/* Central Sphere */}
        <group position={[0, 0, 0]}>
          <mesh
            onClick={() => handleSphereClick(0)} // Clicking on the central sphere
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={isHovered ? "rgb(130, 129, 129)" : "rgb(6, 6, 6)"}
            />
          </mesh>
          <Text
            position={[0, 0, 1]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Report Summary
          </Text>
        </group>

        {/* Outer Spheres + Hover Effect */}
        {positions.map((pos, index) => (
          <React.Fragment key={index}>
            <mesh
              position={pos}
              onPointerOver={() => setHoveredIndex(index)}
              onPointerOut={() => setHoveredIndex(null)}
              onClick={() => handleSphereClick(index)} // Clicking on an outer sphere
            >
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial
                color={hoveredIndex === index ? "rgb(151, 167, 249)" : "rgb(23, 73, 221)"}
              />
            </mesh>

            {/* Line from Center to Outer Sphere */}
            <Line points={[[0, 0, 0], pos]} color="white" lineWidth={2} />
          </React.Fragment>
        ))}
      </Canvas>

      {/* Central Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Report Summary</h2>
            <p>AI report overview, pulled from python script</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Transcript Popup for the sphere at position [radius, radius, 0] */}
      {showTranscriptPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Transcript</h2>
            <p>Click below to view the full transcript:</p>
            <a href="/path/to/transcript.txt" target="_blank" rel="noopener noreferrer">
              View Transcript
            </a>
            <button onClick={() => setShowTranscriptPopup(false)}>Close</button>
          </div>
        </div>
      )}

      <button className="home-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default SubmitPage;
