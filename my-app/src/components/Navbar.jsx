import React from "react";
import { Link } from "react-scroll";
import copVisionLogo from "../images/copvision_logo.png";
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
        {/* Logo */}
        <a href="/">
          <img src={copVisionLogo} alt="CopVision Logo" className="navbar_logo" />
        </a>
        {/* Navigation Links */}
        <div className="navbar_links">
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="navbar_element"
              offset={-60}
            >
              Home
            </Link>

            <Link
              to="upload"
              smooth={true}
              duration={750}
              className="navbar_element"
              offset={-60}
            >
              Upload
            </Link>

            <Link
              to="info"
              smooth={true}
              duration={750}
              className="navbar_element"
              offset={-90}
            >
              Info
            </Link>

            <Link
              to="contact-us"
              smooth={true}
              duration={750}
              className="navbar_element"
              offset={-80}
            >
              Contact Us
            </Link>
        </div>
    </nav>
  );
};
  
export default Navbar;