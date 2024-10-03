// src/pages/Home.js
// 網頁主頁面

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function Home() {
    const [navbarHeight, setNavbarHeight] = useState(0);

    // 以下是頁面的內容，後期應該要轉為使用資料庫
    const homePageTitle = 'Counterspell Taiwan';
    
    useEffect(() => {
        // 查找導航欄元素
        const navbar = document.querySelector('nav');
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight); // 計算導航條的高度
        }

        // 導航條高度可能會改變，監控 window 的 resize 事件
        const handleResize = () => {
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight);
        }
        };

        // 增加事件監聽器
        window.addEventListener('resize', handleResize);

        // 清理事件監聽器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <HomePageContent navbarHeight={navbarHeight}>
            <HomePageTitle>{ homePageTitle }</HomePageTitle>
        </HomePageContent>
    )
}

const HomePageTitle = styled.h1`
    font-size: 48px;
    color: black;
    font-family: 'PressStart2P-Regular', sans-serif;
    font-weight: bold;
    text-align: left;
`;

const HomePageContent = styled.div`
    background-size: cover;
    padding-top: ${props => `${props.navbarHeight}px`};
    margin: 0 auto;
    padding-left: 50px;
    padding-right: 20px;
`;

export default Home;