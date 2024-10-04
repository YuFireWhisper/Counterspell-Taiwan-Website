// src/pages/Home.js
// 網頁主頁面

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function Home() {
    const [navbarHeight, setNavbarHeight] = useState(0);

    // 以下是頁面的內容，後期應該要轉為使用資料庫
    const eventName = 'Counterspell Taiwan';
    const eventDescriptionText = "全台第一場由青少年為青少年舉辦的黑客松";
    const hackathonInfoTitle = "甚麼是黑客松?";
    const hackathonInfoText = "黑客松是一種由程式設計師、設計師、產品經理等多種角色組成的團隊，共同在限定時間內合作完成特定項目的競賽活動。";
    const teamIntroductionTitle = "團隊介紹";
    const teamIntroductionText = "我們是一群來自全台各地的青少年，對程式設計、設計、產品開發等領域有著濃厚的興趣。";

    useEffect(() => {
        // 查找導航欄元素
        const navbar = document.querySelector('nav');
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight); // 計算導航條的高度
        }

        // 導航條高度可能會改變，監控 window 的 resize 事件
        const handleResize = () => {
            const navbar = document.querySelector('nav');
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
            <FirstPage>
                <EventName>{eventName}</EventName>
                <EventDescription>{eventDescriptionText}</EventDescription>
            </FirstPage>
            <ContentSection>
                <Section index={0}>
                    <SectionTitle>{hackathonInfoTitle}</SectionTitle>
                    <Divider />
                    <SectionText>{hackathonInfoText}</SectionText>
                </Section>
                <Section index={1}>
                    <SectionTitle>{teamIntroductionTitle}</SectionTitle>
                    <Divider />
                    <SectionText>{teamIntroductionText}</SectionText>
                </Section>
            </ContentSection>
        </HomePageContent>
    )
}

// 以下是樣式設定
const HomePageContent = styled.div`
    display: grid;
    grid-template-rows: calc(100vh - ${props => props.navbarHeight}px) auto;
    grid-template-areas:
        "firstPage"
        "contentSection";
    padding-top: ${props => props.navbarHeight}px;
    overflow: hidden;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
`;

const FirstPage = styled.div`
    grid-area: firstPage;
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 100px auto;
    grid-template-areas:
        ". eventName"
        ". eventDescription";
    align-items: start;
    padding: 20px;
    scroll-snap-align: start;
    height: calc(100vh - ${props => props.navbarHeight}px);
    min-height: 100vh;
`;

const ContentSection = styled.div`
    grid-area: contentSection;
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 20px;
    scroll-snap-align: start;
    min-height: calc(100vh - ${props => props.navbarHeight}px);
`;

const Section = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 2fr;
    align-items: center;
    background-color: ${props => props.index % 2 === 0 ? '#ffffff' : '#f0f0f0'};
    padding: 60px;
    border-radius: 20px;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 0;
`;

const EventName = styled.h1`
    @font-face {
        font-family: 'Audiowide-Regular';
        src: url('/fonts/Audiowide-Regular.ttf?v=1') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    grid-area: eventName;
    font-family: 'Audiowide-Regular';
    font-size: 60px;
    color: black;
    white-space: pre-line;
    justify-self: flex-start;
    width: 75%;
`;

const EventDescription = styled.p`
    @font-face {
        font-family: 'Noto Sans TC';
        src: url('/fonts/NotoSansTC-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    grid-area: eventDescription;
    font-family: 'Noto Sans TC';
    font-size: 25px;
    align-self: start;
    border-bottom: 2px solid black;
    padding-bottom: 5px;
    width: 40%;
`;

const SectionTitle = styled.h2`
    font-family: 'Noto Sans TC';
    font-size: 40px;
    font-weight: 800;
    align-self: center;
    justify-self: center;
    text-align: center;
`;

const SectionText = styled.p`
    font-family: 'Noto Sans TC';
    font-size: 16px;
    padding-left: 40px;
    align-self: start;
    padding-top: 10px;
    width: 100%;
`;

const Divider = styled.div`
    width: 4px;
    height: 100%;
    background-color: #8BC34A;
    border-radius: 5px;
`;

export default Home;