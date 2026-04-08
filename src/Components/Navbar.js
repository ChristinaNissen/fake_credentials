import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdHelpOutline, MdHome } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import Logo from "../Assets/logo.jpg";


const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdowns when clicking outside the profile or login areas
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/welcome"); // Navigate to welcome page on logout
  };

  return (
    <header className="navbar">
      {/* Left side: the logo */}
      <div className="navbar-logo">
        <img
          src={Logo}
          alt="Agency Logo"
        />
        <span>Agency for Online Voting</span>
      </div>
      {/* Right side: the links and profile, equally spaced */}
      <div className="navbar-right">
        <Link to="/help" className="navbar-link">
          <MdHelpOutline className="navbar-icon" size={20} />
          <span className="navbar-text">Help</span>
        </Link>
        <Link to="/welcome" className="navbar-link" onClick={handleLogout}>
          <MdHome className="navbar-icon" size={20} />
          <span className="navbar-text">Home</span>
        </Link>
        {!isLoggedIn && (
          <div className="navbar-profile" ref={loginDropdownRef}>
            <FaUserCircle
              className="navbar-icon"
              size={24}
              onClick={() => setLoginDropdownOpen((prev) => !prev)}
            />
            {loginDropdownOpen && (
              <div className="profile-dropdown">
                <button
                  onClick={() => {
                    navigate("/login");
                    setLoginDropdownOpen(false);
                  }}
                  className="dropdown-item"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        )}
        {isLoggedIn && (
          <div className="navbar-profile" ref={dropdownRef}>
            <FaUserCircle
              className="navbar-icon profile-icon"
              size={24}
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div className="profile-dropdown">
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;