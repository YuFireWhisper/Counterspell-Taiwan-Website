// src/pages/Home.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import {
  ChevronDown,
} from 'lucide-react';

import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { loadFull } from 'tsparticles';
import Particles from '@tsparticles/react';
import _ from 'lodash';
import content from '../components/content';
import { Link } from 'react-router-dom';
import Timeline from '../components/Timeline';
import Goals from '../components/Goal';
import EventInfo from '../components/EventInfo';
import AboutUs from '../components/AboutUs';
import RequiredItems from '../components/RequiredItems';
import Registration from '../components/Registration';
import QASection from '../components/QASection';
import ContactInfo from '../components/ContactInfo';

// --------------------------------------------
// 1. 定義 Styled Components
// --------------------------------------------

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
  @font-face {
    font-family: 'Audiowide';
    src: url('/fonts/Audiowide-Regular.ttf') format('truetype');
  }
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

// CTA 按鈕樣式
const CTAButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CTAButton = styled(Link)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4);

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.6);
  }

  &:active {
    transform: scale(1);
    box-shadow: 0 3px 10px rgba(255, 126, 95, 0.3);
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
    {/* 新增導航按鈕連結到獨立頁面 */}
    <Tooltip data-tooltip="工作坊">
      <Link to="/workshops">
        <AnimatedNavDot isActive={false} />
      </Link>
    </Tooltip>
    <Tooltip data-tooltip="得獎名單">
      <Link to="/awards">
        <AnimatedNavDot isActive={false} />
      </Link>
    </Tooltip>
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
    workshops: '工作坊',
    awards: '得獎名單',
    timeline: '活動時程',
  };
  return sectionNames[section] || section;
};

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
  const timelineRef = useRef(null);

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
      timeline: timelineRef,
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
      {/* Header 已在 App.js 中引入 */}
      <ParticleEffect /> {/* 添加粒子背景 */}
      {/* 固定的元素位於滾動容器上方 */}
      <ParallaxBackground />
      <AnimatedHero style={heroSpring}>
        <AnimatedH1>{content.eventName || 'Counterspell Taiwan'}</AnimatedH1>
        <AnimatedP>
          {content.eventDescription || '全台第一場由青少年舉辦給青少年的黑客松'}
        </AnimatedP>
        <ScrollIndicator onClick={() => handleScrollTo(timelineRef)}>
          <span>滑動以探索</span>
          <ChevronDown size={24} />
        </ScrollIndicator>
      </AnimatedHero>

      {/* 滾動容器 */}
      <HomeContainer ref={scrollContainerRef} data-scroll-container>
        <ContentWrapper>
          <HeroPlaceholder />

          {/* 關於我們區塊 */}
          <div ref={aboutUsRef} id="aboutUs" data-scroll-section>
            <AboutUs />
          </div>

          {/* 時間軸區塊 */}
          <div ref={timelineRef} id="timeline" data-scroll-section>
            <Timeline items={content.schedule} />
          </div>

          {/* 活動資訊區塊 */}
          <div ref={eventDateRef} id="eventInfo" data-scroll-section>
            <EventInfo />
          </div>

          {/* 活動目標區塊 */}
          <div ref={goalsRef} id="goals" data-scroll-section>
            <Goals goals={content.goals || []} />
          </div>

          {/* 必備物品區塊 */}
          <div ref={requiredItemsRef} id="requiredItems" data-scroll-section>
            <RequiredItems />
          </div>

          {/* 報名活動區塊，包含報名流程 */}
          <div ref={registrationRef} id="registration" data-scroll-section>
            <Registration sectionRefs={sectionRefs} handleScrollTo={handleScrollTo} />
          </div>

          {/* 常見問答區塊 */}
          <div ref={qaRef} id="qa" data-scroll-section>
            <QASection />
          </div>

          {/* 聯絡資訊區塊 */}
          <div ref={contactInfoRef} id="contactInfo" data-scroll-section>
            <ContactInfo />
          </div>
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
