// src/pages/Home.js
// 網頁主頁面

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function Home() {
    const [navbarHeight, setNavbarHeight] = useState(0);

    // 以下是頁面的內容，後期應該要轉為使用資料庫
    const eventName = 'Counterspell Taiwan';
    const eventDescriptionText = "全台第一場由青少年為青少年舉辦的黑客松";
    
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
            <EventName>{ eventName }</EventName>
            <EventDescription>{ eventDescriptionText }</EventDescription>
        </HomePageContent>
    )
}


// 以下是樣式設定
const HomePageContent = styled.div`
    display: grid;
    grid-template-columns: 200px 700px 1fr;
    grid-template-rows: 100px 110px 90px 1fr;
    grid-template-areas:
        ". . ."
        ". eventName ."
        ". eventDescription .";
    gap: px;
    height: calc(100vh - ${props => props.navbarHeight}px);
    padding-top: ${props => props.navbarHeight}px;
`;

const EventName = styled.h1`
    grid-area: eventName;
    @font-face {
        font-family: 'Audiowide-Regular';
        src: url('/fonts/Audiowide-Regular.ttf?v=1') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    font-family: 'Audiowide-Regular';
    font-size: 60px;
    color: black;
    white-space: pre-line;
    display: grid;
    align-items: start;
`;

const EventDescription = styled.p`
    @font-face {
        font-family: 'Noto Sans TC';
        src: url('/fonts/NotoSansTC-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    font-family: 'Noto Sans TC';
    font-size: 25px;
    grid-area: eventDescription;
    display: grid;
    align-items: start;
    border-bottom: 2px solid black;
    padding-bottom: 5px;
    width: 75%;
`;

export default Home;