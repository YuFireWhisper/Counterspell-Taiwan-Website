// src/pages/Home.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import {
  Calendar,
  Users,
  Award,
  Briefcase,
  Mail,
  ChevronDown,
  HelpCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { loadFull } from 'tsparticles';
import Particles from '@tsparticles/react';
import _ from 'lodash';
import content from '../components/content';

// --------------------------------------------
// 1. 定義 Styled Components
// --------------------------------------------

// 全局樣式
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Audiowide';
    src: url('/fonts/Audiowide-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    overflow: hidden; /* 禁止默認滾動 */
    height: 100%;
    font-family: 'Noto Sans TC', sans-serif;
    background-color: #121212; /* 深色背景以增強動態效果 */
  }
  html {
    height: 100%;
  }
`;

// 固定的視差背景（位於 Hero 下方）
const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  z-index: -3; /* 位於 ParticleBackground 下方 */
  will-change: background;
  /* 如有需要，添加動態雲層 */
`;

// 粒子背景組件
const ParticleBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -2;
`;

// 固定的 Hero 區域，帶有動畫透明度（位於背景上方）
const AnimatedHero = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  z-index: 0; /* 位於 ParallaxBackground 和 ParticleBackground 上方 */
  will-change: opacity;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景以增強可讀性 */
`;

// 動畫標題
const AnimatedH1 = styled(animated.h1)`
  font-family: 'Audiowide', sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  will-change: opacity;
  animation: fadeInDown 1s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 動畫段落
const AnimatedP = styled(animated.p)`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 1.5rem;
  max-width: 600px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  will-change: opacity;
  animation: fadeInUp 1s ease-out 0.5s forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 滾動指示器，帶有彈跳動畫
const ScrollIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  cursor: pointer;

  span {
    margin-bottom: 10px;
    font-size: 1rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(10px);
    }
    60% {
      transform: translateY(5px);
    }
  }

  svg {
    animation: bounceIcon 2s infinite;
  }

  @keyframes bounceIcon {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(10px);
    }
    60% {
      transform: translateY(5px);
    }
  }
`;

// Home 容器，使用 Locomotive Scroll
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden; /* Locomotive Scroll 處理滾動 */
  z-index: 1; /* 位於 Hero 上方 */
`;

// 內容包裝器，包含所有區塊
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  position: relative; /* 確保 z-index 生效 */
  z-index: 1; /* 位於 Hero 上方 */
`;

// 占位元素，將內容推到 Hero 下方
const HeroPlaceholder = styled.div`
  height: 100vh;
`;

// 通用區塊樣式，帶有背景和動畫
const Section = styled.section`
  margin-bottom: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  will-change: background, transform;
  transition: background 0.5s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

// 帶有圖標的區塊標題
const SectionTitle = styled.h2`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  will-change: opacity, transform;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.2);
    }
  }
`;

// 活動資訊容器，使用 Flex 排列
const EventInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 30px;
`;

// 活動資訊項目，繼承 Section，並調整樣式
const EventInfoItem = styled(Section)`
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  background: linear-gradient(45deg, #ff9ff3, #feca57);
  margin: 10px;
  text-align: center;
  color: white;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  svg {
    margin-bottom: 15px;
  }
`;

// 關於我們內容
const AboutUsSection = styled(Section)`
  background: linear-gradient(45deg, #54a0ff, #5f27cd);
`;

const AboutUsContent = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  will-change: opacity, transform;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
    max-width: 800px;
    text-align: center;
  }
`;

// 目標內容網格
const GoalsSection = styled(Section)`
  background: linear-gradient(45deg, #ff9ff3, #feca57);
`;

const GoalsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
  will-change: transform;
`;

// 目標項目，帶有懸停效果
const GoalItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 15px;
  color: white;
  transition: transform 0.3s ease;
  will-change: transform, opacity;

  &:hover {
    transform: scale(1.05);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.5;
    text-align: center;
  }
`;

// 必備物品區塊
const RequiredItemsSection = styled(Section)`
  background: linear-gradient(45deg, #48dbfb, #ff6b6b);
`;

const RequiredItemsContent = styled.div`
  color: white;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  justify-items: center;
  will-change: transform;
`;

const RequiredItem = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  svg {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.1rem;
  }
`;

// 報名區塊，調整樣式以包含報名流程
const RegistrationSection = styled(Section)`
  background: linear-gradient(45deg, #5f27cd, #48dbfb);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
`;

const RegistrationContent = styled.div`
  max-width: 800px;
  margin-bottom: 30px;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
`;

// 報名按鈕，帶有動畫效果
const RegistrationButton = styled(animated.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b); /* 軟橙到桃色漸變 */
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform, background, box-shadow;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4); /* 較柔和的陰影 */

  &:hover {
    transform: scale(1.08); /* 懸停時更明顯的縮放 */
    background: linear-gradient(135deg, #feb47b, #ff7e5f); /* 懸停時漸變反轉 */
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.6); /* 懸停時更大的陰影 */
  }

  &:active {
    transform: scale(1); /* 點擊時恢復縮放 */
    box-shadow: 0 3px 10px rgba(255, 126, 95, 0.3); /* 點擊時較輕的陰影 */
  }
`;

// FAQ 樣式組件
const QASection = styled(Section)`
  background: linear-gradient(45deg, #20bf6b, #0fb9b1);
`;

const QAContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  will-change: opacity, transform;
`;

const Question = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  padding-right: 20px;

  &:after {
    content: '+';
    position: absolute;
    right: 0;
    top: 0;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  &.active:after {
    transform: rotate(45deg);
  }
`;

const Answer = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: 20px;
`;

// 聯絡資訊區塊
const ContactInfoSection = styled(Section)`
  background: linear-gradient(45deg, #f8a5c2, #f7d794);
`;

const ContactInfoContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: opacity, transform;
  gap: 15px;
`;

// 聯絡項目
const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// 動畫的列表項目
const AnimatedLiStyled = styled(animated.li)`
  will-change: opacity, transform;
`;

// 導航圓點容器
const NavDotsContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
  will-change: transform;
`;

// 導航圓點的提示工具
const Tooltip = styled.div`
  position: relative;
  display: inline-block;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    right: 120%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    white-space: nowrap;
    font-size: 0.9rem;
    opacity: 1;
    transition: opacity 0.3s;
  }

  &::after {
    content: '';
    opacity: 0;
    transition: opacity 0.3s;
  }
`;

// 動畫導航圓點
const AnimatedNavDot = styled(animated.div)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? '#feca57' : 'white')};
  cursor: pointer;
  will-change: transform, background-color, opacity;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #feca57;
    transform: scale(1.2);
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
`;

// React.memo 用於導航圓點組件，避免不必要的重新渲染
const NavDotComponent = React.memo(({ isActive, onClick, tooltip }) => {
  const springProps = useSpring({
    transform: isActive ? 'scale(1.5)' : 'scale(1)',
    opacity: isActive ? 1 : 0.7,
    config: config.wobbly,
  });

  return (
    <Tooltip data-tooltip={tooltip}>
      <AnimatedNavDot style={springProps} isActive={isActive} onClick={onClick} />
    </Tooltip>
  );
});

// 導航圓點組件
const NavigationDots = ({ activeSection, sectionRefs, handleScrollTo }) => (
  <NavDotsContainer>
    {Object.keys(sectionRefs).map((section) => {
      const isActive = activeSection === section;
      return (
        <NavDotComponent
          key={section}
          isActive={isActive}
          onClick={() => {
            handleScrollTo(sectionRefs[section]);
          }}
          tooltip={formatSectionName(section)}
        />
      );
    })}
  </NavDotsContainer>
);

// 輔助函數，用於格式化區塊名稱
const formatSectionName = (section) => {
  const sectionNames = {
    eventDate: '活動日期',
    eventLocation: '活動地點',
    eventOrganizer: '主辦單位',
    aboutUs: '關於我們',
    goals: '活動目標',
    requiredItems: '必備物品',
    registration: '報名活動',
    qa: '常見問答',
    contactInfo: '聯絡資訊',
  };
  return sectionNames[section] || section;
};

// --------------------------------------------
// 2. SectionAnimation 組件，用於進場動畫
// --------------------------------------------

const SectionAnimation = React.memo(({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 14 },
  });

  return (
    <animated.div ref={ref} style={animation}>
      {children}
    </animated.div>
  );
});

// --------------------------------------------
// 3. ParticleEffect 組件，使用 @tsparticles/react
// --------------------------------------------

const ParticleEffect = React.memo(() => {
  const particlesInit = async (engine) => {
    // 加載完整的 tsparticles 套件以確保所有功能可用
    await loadFull(engine);
  };

  const particlesOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: false, mode: 'repulse' }, // 禁用懸停 repulse 以提升性能
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: { enable: false },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'bounce',
        random: false,
        speed: 1.5, // 減慢移動速度以提升性能
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 30, // 減少粒子數量以提升性能
      },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } }, // 減少粒子大小
    },
    detectRetina: true,
  };

  return (
    <ParticleBackground>
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
    </ParticleBackground>
  );
});

// --------------------------------------------
// 4. Home 組件定義
// --------------------------------------------

const Home = () => {
  // State Hooks
  const [activeSection, setActiveSection] = useState(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [activeQAIndices, setActiveQAIndices] = useState({});

  // Refs for Sections
  const scrollContainerRef = useRef(null);
  const locoScroll = useRef(null);
  const eventDateRef = useRef(null);
  const eventLocationRef = useRef(null);
  const eventOrganizerRef = useRef(null);
  const aboutUsRef = useRef(null);
  const goalsRef = useRef(null);
  const requiredItemsRef = useRef(null);
  const registrationRef = useRef(null);
  const qaRef = useRef(null);
  const contactInfoRef = useRef(null);

  // Memoized Section References
  const sectionRefs = useMemo(
    () => ({
      eventDate: eventDateRef,
      eventLocation: eventLocationRef,
      eventOrganizer: eventOrganizerRef,
      aboutUs: aboutUsRef,
      goals: goalsRef,
      requiredItems: requiredItemsRef,
      registration: registrationRef,
      qa: qaRef,
      contactInfo: contactInfoRef,
    }),
    []
  );

  // 節流的滾動事件處理器
  const handleScroll = useMemo(
    () =>
      _.throttle((obj) => {
        // 根據滾動位置計算 Hero 區域的透明度
        const scrollY = obj.scroll.y;
        const windowHeight = window.innerHeight;
        const opacity = 1 - Math.min(scrollY / windowHeight, 1);
        setHeroOpacity(opacity);

        // 根據滾動位置確定當前活動的區塊
        const scrollPosition = scrollY + windowHeight / 2;

        for (const [section, ref] of Object.entries(sectionRefs)) {
          if (
            ref.current &&
            ref.current.offsetTop <= scrollPosition &&
            ref.current.offsetTop + ref.current.offsetHeight > scrollPosition
          ) {
            setActiveSection(section);
            break;
          }
        }
      }, 100), // 節流延遲設置為 100ms
    [sectionRefs]
  );

  // 初始化 Locomotive Scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      locoScroll.current = new LocomotiveScroll({
        el: scrollContainerRef.current,
        smooth: true,
      });

      locoScroll.current.on('scroll', handleScroll);
    }

    return () => {
      if (locoScroll.current) {
        locoScroll.current.destroy();
      }
      handleScroll.cancel(); // 取消任何待處理的節流調用
    };
  }, [handleScroll]);

  // 處理滾動到特定區塊的函數
  const handleScrollTo = (ref) => {
    if (locoScroll.current && ref.current) {
      locoScroll.current.scrollTo(ref.current);
    }
  };

  // 使用 react-spring 進行 Hero 區域透明度動畫
  const heroSpring = useSpring({
    opacity: heroOpacity,
    config: {
      tension: 180,
      friction: 20,
    },
  });

  // 如果 content 尚未加載，顯示載入訊息
  if (!content) {
    return <div>Loading...</div>;
  }

  // 切換 FAQ 項目的顯示狀態
  const toggleQA = (index) => {
    setActiveQAIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <GlobalStyle />
      <ParticleEffect /> {/* 添加粒子背景 */}
      {/* 固定的元素位於滾動容器上方 */}
      <ParallaxBackground />
      <AnimatedHero style={heroSpring}>
        <AnimatedH1>{content.eventName || 'Hackathon 2024'}</AnimatedH1>
        <AnimatedP>
          {content.eventDescription || 'Innovate. Create. Revolutionize.'}
        </AnimatedP>
        <ScrollIndicator onClick={() => handleScrollTo(eventDateRef)}>
          <span>滑動以探索</span>
          <ChevronDown size={24} />
        </ScrollIndicator>
      </AnimatedHero>

      {/* 滾動容器 */}
      <HomeContainer ref={scrollContainerRef} data-scroll-container>
        <ContentWrapper>
          <HeroPlaceholder />

          {/* 活動資訊項目 */}
          <EventInfoContainer data-scroll-section>
            {/* 活動日期 */}
            <EventInfoItem ref={eventDateRef} id="eventDate">
              <SectionAnimation>
                <svg width="40" height="40">
                  <Calendar size={40} />
                </svg>
                <h3>活動日期</h3>
                <p>{content.eventDetails?.date || '2024年12月1日 - 12月2日'}</p>
              </SectionAnimation>
            </EventInfoItem>

            {/* 活動地點 */}
            <EventInfoItem ref={eventLocationRef} id="eventLocation">
              <SectionAnimation>
                <svg width="40" height="40">
                  <MapPin size={40} />
                </svg>
                <h3>活動地點</h3>
                <p>{content.eventDetails?.location || '台北市信義區信義路五段7號'}</p>
              </SectionAnimation>
            </EventInfoItem>

            {/* 主辦單位 */}
            <EventInfoItem ref={eventOrganizerRef} id="eventOrganizer">
              <SectionAnimation>
                <svg width="40" height="40">
                  <Users size={40} />
                </svg>
                <h3>主辦單位</h3>
                <p>{content.eventDetails?.organizer || 'Tech Innovators Inc.'}</p>
                <h3>贊助商</h3>
                <p>{content.eventDetails?.sponsors || 'Sponsor A, Sponsor B, Sponsor C'}</p>
              </SectionAnimation>
            </EventInfoItem>
          </EventInfoContainer>

          {/* 關於我們區塊 */}
          <AboutUsSection ref={aboutUsRef} id="aboutUs" data-scroll-section>
            <SectionTitle>
              <Users /> 關於我們
            </SectionTitle>
            <AboutUsContent>
              <SectionAnimation>
                <AnimatedP>
                  {content.aboutUs ||
                    '我們是一群對技術充滿熱情，致力於改變世界的創新者。'}
                </AnimatedP>
              </SectionAnimation>
            </AboutUsContent>
          </AboutUsSection>

          {/* 活動目標區塊 */}
          <GoalsSection ref={goalsRef} id="goals" data-scroll-section>
            <SectionTitle>
              <Award /> 活動目標
            </SectionTitle>
            <GoalsContent>
              {(content.goals || []).map((goal, index) => (
                <SectionAnimation key={index}>
                  <GoalItem>
                    <h3>{goal.title}</h3>
                    <p>{goal.description}</p>
                  </GoalItem>
                </SectionAnimation>
              ))}
            </GoalsContent>
          </GoalsSection>

          {/* 必備物品區塊 */}
          <RequiredItemsSection ref={requiredItemsRef} id="requiredItems" data-scroll-section>
            <SectionTitle>
              <Briefcase /> 必備物品
            </SectionTitle>
            <RequiredItemsContent>
              {(content.participantInfo?.requiredItems || []).map((item, index) => (
                <SectionAnimation key={index}>
                  <RequiredItem>
                    <Briefcase size={30} />
                    <p>{item}</p>
                  </RequiredItem>
                </SectionAnimation>
              ))}
            </RequiredItemsContent>
          </RequiredItemsSection>

          {/* 報名活動區塊，包含報名流程 */}
          <RegistrationSection ref={registrationRef} id="registration" data-scroll-section>
            <SectionTitle>
              <Mail /> 報名活動
            </SectionTitle>
            <RegistrationContent>
              <SectionAnimation>
                <p>
                  {content.participantInfo?.registrationProcess ||
                    '報名流程資訊尚未更新。'}
                </p>
              </SectionAnimation>
            </RegistrationContent>
            <SectionAnimation>
              <RegistrationButton
                onClick={() => {
                  if (content.registrationPath) {
                    if (
                      content.registrationPath.startsWith('#') &&
                      sectionRefs.registration.current
                    ) {
                      handleScrollTo(sectionRefs.registration);
                    } else {
                      window.location.href = content.registrationPath;
                    }
                  }
                }}
              >
                開啟報名表單
              </RegistrationButton>
            </SectionAnimation>
          </RegistrationSection>

          {/* 常見問答區塊 */}
          <QASection ref={qaRef} id="qa" data-scroll-section>
            <SectionTitle>
              <HelpCircle /> 常見問答
            </SectionTitle>
            <QAContent>
              {(content.qa || []).map((qaItem, index) => (
                <SectionAnimation key={index}>
                  <div>
                    <Question
                      className={activeQAIndices[index] ? 'active' : ''}
                      onClick={() => toggleQA(index)}
                    >
                      {qaItem.question}
                    </Question>
                    {activeQAIndices[index] && <Answer>{qaItem.answer}</Answer>}
                  </div>
                </SectionAnimation>
              ))}
            </QAContent>
          </QASection>

          {/* 聯絡資訊區塊 */}
          <ContactInfoSection ref={contactInfoRef} id="contactInfo" data-scroll-section>
            <SectionTitle>
              <Phone /> 聯絡資訊
            </SectionTitle>
            <ContactInfoContent>
              <SectionAnimation>
                <ContactItem>
                  <Mail size={24} />{' '}
                  <a href={`mailto:${content.contactInfo?.email || 'contact@hackathon2024.com'}`}>
                    {content.contactInfo?.email || 'contact@hackathon2024.com'}
                  </a>
                </ContactItem>
              </SectionAnimation>
              <SectionAnimation>
                <ContactItem>
                  <Phone size={24} />{' '}
                  <a
                    href={`https://instagram.com/${content.contactInfo?.instagram || 'hackathon2024'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{content.contactInfo?.instagram || 'hackathon2024'}
                  </a>
                </ContactItem>
              </SectionAnimation>
            </ContactInfoContent>
          </ContactInfoSection>
        </ContentWrapper>

        {/* 導航圓點 */}
        <NavigationDots
          activeSection={activeSection}
          sectionRefs={sectionRefs}
          handleScrollTo={handleScrollTo}
        />
      </HomeContainer>
    </>
  );
};

// --------------------------------------------
// 5. 匯出 Home 組件
// --------------------------------------------

export default Home;
