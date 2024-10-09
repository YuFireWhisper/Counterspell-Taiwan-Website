// src/pages/Home.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';

import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { loadFull } from 'tsparticles';
import Particles from '@tsparticles/react';
import _ from 'lodash';
import content from '../components/content';
import Timeline from '../components/Timeline';
import Goals from '../components/Goal';
import EventInfo from '../components/EventInfo';
import AboutUs from '../components/AboutUs';
import RequiredItems from '../components/RequiredItems';
import Registration from '../components/Registration';
import QASection from '../components/QASection';
import ContactInfo from '../components/ContactInfo';
import Hero from '../components/Hero';
import NavigationDots from '../components/NavDots'; 

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
  const timelineRef = useRef(null);

  // Initialize all refs at the top level
  const aboutUsRef = useRef(null);
  const eventInfoRef = useRef(null);
  const goalsRef = useRef(null);
  const requiredItemsRef = useRef(null);
  const registrationRef = useRef(null);
  const qaRef = useRef(null);
  const contactInfoRef = useRef(null);

  // Use memo to store sections
  const sections = useMemo(() => [
    { id: 'aboutUs', name: '關於我們', ref: aboutUsRef },
    { id: 'timeline', name: '活動時程', ref: timelineRef },
    { id: 'eventInfo', name: '活動資訊', ref: eventInfoRef },
    { id: 'goals', name: '活動目標', ref: goalsRef },
    { id: 'requiredItems', name: '必備物品', ref: requiredItemsRef },
    { id: 'registration', name: '報名活動', ref: registrationRef },
    { id: 'qa', name: '常見問答', ref: qaRef },
    { id: 'contactInfo', name: '聯絡資訊', ref: contactInfoRef },
  ], []);

  const sectionRefs = useMemo(
    () => sections.reduce((acc, section) => {
      acc[section.id] = section.ref;
      return acc;
    }, {}),
    [sections]
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
      locoScroll.current.update();
    }

    return () => {
      if (locoScroll.current) {
        locoScroll.current.destroy();
      }
      handleScroll.cancel();
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
      {/* Hero 區塊 */}
      <Hero heroSpring={heroSpring} handleScrollTo={handleScrollTo} timelineRef={timelineRef} content={content} />

      {/* 滾動容器 */}
      <HomeContainer ref={scrollContainerRef} data-scroll-container>
        <ContentWrapper>
          <HeroPlaceholder />

          {sections.map(({ id, name, ref }) => (
            <div key={id} ref={ref} id={id} data-scroll-section>
              {/* Render the corresponding section component based on the id */}
              {id === 'aboutUs' && <AboutUs />}
              {id === 'timeline' && <Timeline items={content.schedule} />}
              {id === 'eventInfo' && <EventInfo />}
              {id === 'goals' && <Goals goals={content.goals || []} />}
              {id === 'requiredItems' && <RequiredItems />}
              {id === 'registration' && <Registration sectionRefs={sectionRefs} handleScrollTo={handleScrollTo} />}
              {id === 'qa' && <QASection />}
              {id === 'contactInfo' && <ContactInfo />}
            </div>
          ))}

          {/* 導航圓點 */}
          <NavigationDots
            activeSection={activeSection}
            sections={sections}  // 傳遞帶有名稱的 sections
            handleScrollTo={handleScrollTo}
          />

        </ContentWrapper>
      </HomeContainer>
    </>
  );
};

// --------------------------------------------
// 5. 匯出 Home 組件
// --------------------------------------------

export default Home;
