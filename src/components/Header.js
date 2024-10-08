// src/components/Header.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { throttle } from 'lodash';

// 導航欄容器
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; /* 固定高度 */
  background: rgba(20, 20, 20, 0.9); /* 調整背景顏色 */
  backdrop-filter: blur(10px);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1001; /* 高於其他固定元素 */
  transform: ${(props) => (props.show ? 'translateY(0)' : 'translateY(-100%)')};
  transition: transform 0.3s ease-in-out;
`;

// 標誌或網站名稱
const Logo = styled(Link)`
  font-family: 'Audiowide', sans-serif;
  font-size: 1.8rem;
  color: #ffffff; /* 修改為白色，與背景協調 */
  text-decoration: none;

  &:hover {
    color: #ff9f43; /* 懸停時的顏色 */
  }
`;

// 導航連結容器
const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

// 單個導航連結
const NavLinkItem = styled(Link)`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 1.2rem;
  color: #dddddd; /* 修改為較淺的灰色 */
  text-decoration: none;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    background: #ff9f43; /* 修改為與標誌協調的顏色 */
    left: 0;
    bottom: -5px;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }

  &:hover {
    color: #ff9f43; /* 懸停時的顏色 */
  }
`;

const Header = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const controlNavbar = throttle(() => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // 向上滾動，顯示導航欄
        setShow(true);
      } else {
        // 向下滾動，隱藏導航欄
        setShow(false);
      }

      setLastScrollY(currentScrollY);
    }
  }, 200); // 每200ms最多觸發一次

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // 清除事件監聽器
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY, controlNavbar]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // 當用戶停止滾動超過300ms，顯示導航欄
      const timeout = setTimeout(() => {
        setShow(true);
        setIsScrolling(false);
      }, 300);

      setScrollTimeout(timeout);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
        {/* 如有其他頁面，可在此添加 */}
      </NavLinks>
    </Nav>
  );
};

export default Header;
