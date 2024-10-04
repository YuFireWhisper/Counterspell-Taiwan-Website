// src/pages/Home.js

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'; // 引入 react-spring

function Home() {
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [firstPageHeight, setFirstPageHeight] = useState(0);
    const firstPageRef = useRef(null);

    // 以下是頁面的內容，後期應該要轉為使用資料庫
    const eventName = 'Counterspell Taiwan';
    const eventDescriptionText = "全台第一場由青少年為青少年舉辦的黑客松";
    const hackathonInfoTitleText = "甚麼是黑客松?";
    const hackathonInfoText = "黑客松是一種由程式設計師、設計師、產品經理等多種角色組成的團隊，共同在限定時間內合作完成特定項目的競賽活動。";
    const teamIntroductionTitleText = "團隊介紹";
    const teamIntroductionText = "我們是一群來自全台各地的青少年，對程式設計、設計、產品開發等領域有著濃厚的興趣。";
    const scheduleTitleText = "活動時間表";

    useEffect(() => {
        // 获取导航栏高度
        const navbar = document.querySelector('nav');
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight);
        }

        // 获取 FirstPage 高度
        const updateFirstPageHeight = () => {
            if (firstPageRef.current) {
                setFirstPageHeight(firstPageRef.current.offsetHeight);
            }
        };

        updateFirstPageHeight();

        const handleResize = () => {
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            }
            updateFirstPageHeight();
        };

        window.addEventListener('resize', handleResize);

        // 清理事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 使用 react-spring 创建滚动阻尼效果
    const [{ scrollY }, set] = useSpring(() => ({ scrollY: 0 }));

    useEffect(() => {
        const handleScroll = () => {
            set({ scrollY: window.scrollY });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [set]);

    return (
        <HomePageContent>
            <FirstPage navbarHeight={navbarHeight} ref={firstPageRef}>
                <EventName>{eventName}</EventName>
                <EventDescription>{eventDescriptionText}</EventDescription>
            </FirstPage>
            <animated.div
                style={{
                    transform: scrollY.to(y => `translateY(${y * -0.5}px)`),
                    position: 'relative',
                    zIndex: 2,
                    marginTop: `calc(${firstPageHeight}px + ${navbarHeight}px)`,
                }}
            >
                <ContentSection>
                    <Section index={0}>
                        <SectionTitle>{hackathonInfoTitleText}</SectionTitle>
                        <Divider />
                        <SectionText>{hackathonInfoText}</SectionText>
                    </Section>
                    <Section index={1}>
                        <SectionTitle>{teamIntroductionTitleText}</SectionTitle>
                        <Divider />
                        <SectionText>{teamIntroductionText}</SectionText>
                    </Section>
                    <ScheduleSection>
                        <SectionTitle>{scheduleTitleText}</SectionTitle>
                        <Divider />
                        <ScheduleTable>
                            <thead>
                                <tr>
                                    <th>時間</th>
                                    <th>活動</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>09:00 - 10:00</td>
                                    <td>開幕典禮</td>
                                </tr>
                                <tr>
                                    <td>10:00 - 12:00</td>
                                    <td>團隊組建與頭腦風暴</td>
                                </tr>
                                <tr>
                                    <td>12:00 - 13:00</td>
                                    <td>午餐時間</td>
                                </tr>
                                <tr>
                                    <td>13:00 - 17:00</td>
                                    <td>項目開發</td>
                                </tr>
                                <tr>
                                    <td>17:00 - 18:00</td>
                                    <td>展示與評審</td>
                                </tr>
                            </tbody>
                        </ScheduleTable>
                    </ScheduleSection>
                </ContentSection>
            </animated.div>
        </HomePageContent>
    );
}

// 以下是樣式設定
const HomePageContent = styled.div`
    /* 使整个页面可滚动 */
    min-height: 100vh;
    overflow-y: auto;
    position: relative;
`;

const FirstPage = styled.div`
    position: fixed;
    top: ${props => props.navbarHeight}px;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: 30px auto;
    grid-template-rows: 100px auto;
    grid-template-areas:
        '. eventName'
        '. eventDescription';
    align-items: start;
    padding: 20px;
    background-color: white;
    z-index: 1;
    border-bottom: 2px solid #e0e0e0;
    min-height: 100vh;
`;

const ContentSection = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f0f0f0;
    gap: 20px;
`;

const Section = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 2fr;
    align-items: center;
    background-color: white;
    padding: 60px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
`;

const ScheduleSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 60px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    gap: 20px;
`;

const EventName = styled.h1`
    /* 字體設置 */
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
    /* 字體設置 */
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
    background-color: #8bc34a;
    border-radius: 5px;
`;

const ScheduleTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border: 1px solid #e0e0e0;
        padding: 10px;
        text-align: center;
    }

    th {
        background-color: #f0f0f0;
        font-weight: bold;
    }
`;

export default Home;