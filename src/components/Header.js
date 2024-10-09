// src/components/Header.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { throttle } from "lodash";

// 導航欄容器
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 65px;
  background: rgba(255, 255, 255, 0.9); /* 使用白色背景，稍微透明 */
  backdrop-filter: blur(10px);
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1001;
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(-100%)")};
  transition: transform 0.3s ease-in-out;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加輕微陰影 */
`;

// 標誌或網站名稱
const Logo = styled(Link)`
  font-family: "Audiowide", sans-serif;
  font-size: 1.8rem;
  color: #333333; /* 文字色改為深灰色 */
  text-decoration: none;
  &:hover {
    color: #ff6f61; /* 主色 */
  }
`;

// 導航連結容器
const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  flex-shrink: 0; /* 防止 NavLinks 被壓縮 */
`;

// 單個導航連結
const NavLinkItem = styled(Link)`
  font-family: "Noto Sans TC", sans-serif;
  font-size: 1.2rem;
  color: #333333; /* 文字色改為深灰色 */
  text-decoration: none;
  position: relative;
  white-space: nowrap; /* 防止文字換行 */
  &:after {
    content: "";
    position: absolute;
    width: 0%;
    height: 2px;
    background: #ffc75f; /* 點綴色 */
    left: 0;
    bottom: -5px;
    transition: width 0.3s ease;
  }
  &:hover:after {
    width: 100%;
  }
  &:hover {
    color: #ff6f61; /* 主色 */
  }
`;

const Header = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const controlNavbar = throttle(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setShow(true);
      } else {
        setShow(false);
      }
      setLastScrollY(currentScrollY);
    }
  }, 200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY, controlNavbar]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const timeout = setTimeout(() => {
        setShow(true);
        setIsScrolling(false);
      }, 300);
      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <Nav show={show}>
      <Logo to="/">Counterspell Taiwan</Logo>
      <NavLinks>
        <NavLinkItem to="/">主頁</NavLinkItem>
        <NavLinkItem to="/workshops">工作坊</NavLinkItem>
        <NavLinkItem to="/awards">得獎名單</NavLinkItem>
      </NavLinks>
    </Nav>
  );
};

export default Header;
