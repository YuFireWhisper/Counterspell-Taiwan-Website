// src/components/Navbar.js
// 頁面頂部導航條

import React from 'react';
import styled from 'styled-components';

function Navbar() {
    return (
        <NavbarConttainer>
            <NavLink href='/'>Home</NavLink>
        </NavbarConttainer>
    );
}

const NavbarConttainer = styled.nav`
    width: 100%;
    height: 30px;
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
`;

const NavLink = styled.a`
    color: black;
    font-weight: bold;
    text-decoration: none;
    font-size: 18px;
`;

export default Navbar;