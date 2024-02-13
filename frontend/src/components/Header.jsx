import React from 'react';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Header() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">DevPlayground</Link>
            </div>

            <nav>
                <ul className="nav-list">
                    {!(localStorage.getItem("token") !== undefined && localStorage.getItem("token") !== null) ? (
                        <>
                            <li>
                                <Link to="/login" className="nav-link">
                                    <FaSignInAlt /> Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="nav-link">
                                    <FaUser /> Register
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/" className="nav-link" onClick={logout}>
                                <FaSignOutAlt /> Logout
                            </Link>
                            {/* <button className="btn" onClick={logout}>
                                <FaSignOutAlt /> Logout
                            </button> */}
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
