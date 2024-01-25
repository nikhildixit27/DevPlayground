import React, { useState } from 'react';

function Header({ togglePreview, showPreview }) {
    const [isLoggedIn, setLoggedIn] = useState(false);

    const toggleLogin = () => {
        setLoggedIn((prevState) => !prevState);
    };

    return (
        <header>
            <div className="logo">DevPlayground</div>

            <div className="user-controls">
                <button onClick={togglePreview}>
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>

                <button onClick={toggleLogin}>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </header>
    );
}

export default Header;
