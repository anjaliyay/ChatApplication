import React from "react";
import "../styles/Navbar.css"
import { Link } from "react-router-dom"

const Navbar = ({ handleLogout }) => {
    return (
        <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">Chat App</Link>
            </div>
            <ul className="navbar-nav">
    
                <li className="nav-item">
                    <Link to="/Register" className="nav-link">
                        Register
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/Login" className="nav-link">
                        Login
                    </Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
export default Navbar;
