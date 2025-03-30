import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";

const SubmitPage = () => {
  const navigate = useNavigate();

  const radius = 2.5; // Distance from the center
  const positions = [
    [radius, 0, 0],
    [-radius, 0, 0],
    [0, radius, 0],
    [0, -radius, 0],
    [0, 0, radius],
  ];

  // State to track which sphere is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Your Knowledge Chart Results</h1>

      <Canvas style={{ width: "100vw", height: "70vh" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <OrbitControls />

        {/* Central Sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="blue" wireframe />
        </mesh>

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
                color={hoveredIndex === index ? "yellow" : "red"} // Highlight effect
                wireframe
              />
            </mesh>

            {/* Line from Center to Outer Sphere */}
            <Line points={[[0, 0, 0], pos]} color="white" lineWidth={2} />
          </React.Fragment>
        ))}
      </Canvas>

      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SubmitPage;
