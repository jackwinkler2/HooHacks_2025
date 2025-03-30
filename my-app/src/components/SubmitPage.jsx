import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Text} from "@react-three/drei";
import './SubmitPage.css'


const SubmitPage = () => {
  const navigate = useNavigate();

  const radius = 3; // Distance from the center
  const positions = [
    [radius, radius, 0],
    [-radius, -radius, 0],
    [0, radius, 0],
    [0, -radius, 0],
    [radius, 0, 0],
    [-radius, 0, 0],

  ];

  // State to track which sphere is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // Track if the central sphere is hovered

  // State to track popup visibility
  const [showPopup, setShowPopup] = useState(false);

  const handleSphereClick = () => {
    setShowPopup(!showPopup);
  };


  return (
    <div style={{ textAlign: "center", marginTop: "80px"}}>
      <h1>Your Knowledge Chart Results</h1>

      <Canvas style={{ width: "100vw", height: "70vh" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <OrbitControls />

        {/* Central Sphere */}
        <group position={[0, 0, 0]}>
          <mesh
            onClick={handleSphereClick}
            onPointerOver={() => setIsHovered(true)}  // Set hover state to true
            onPointerOut={() => setIsHovered(false)} // Set hover state to false
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={isHovered ? "rgb(130, 129, 129)" : "rgb(6, 6, 6)"} // Change color on hover
            />
          </mesh>
          <Text
          position={[0, 0, 1]} // Adjust position of text
          fontSize={0.2} // Adjust size of text
          color="white" // Color of the text
          anchorX="center" // Centering text horizontally
          anchorY="middle" // Centering text vertically
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
            >
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial
                color={hoveredIndex === index ? "rgb(151, 167, 249)" : "rgb(23, 73, 221)"} // Highlight effect
              />
            </mesh>

            {/* Line from Center to Outer Sphere */}
            <Line points={[[0, 0, 0], pos]} color="white" lineWidth={2} />
          </React.Fragment>
        ))}
      </Canvas>

        {/* Popup Window */}
        {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Report Summary</h2>
            <p>AI report overview, pulled from python script</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      <button className="home-button" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SubmitPage;
