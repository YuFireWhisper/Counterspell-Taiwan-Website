import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import { Calendar, Users, Award, Briefcase, Mail, ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { useInView } from 'react-intersection-observer'; // 確保已安裝此套件
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

import content from '../content';

// --------------------------------------------
// 1. 定義樣式元件
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
    overflow: hidden; /* 防止預設滾動 */
    height: 100%;
    font-family: 'Noto Sans TC', sans-serif;
  }
  html {
    height: 100%;
  }
`;

// 固定的視差背景（位於Hero下方）
const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  z-index: -2;
  will-change: background;
`;

// 固定的Hero區塊，帶有動畫透明度（位於背景上方）
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
  z-index: 0; /* 位於背景上方但內容下方 */
  will-change: opacity;
`;

// 動畫標題
const AnimatedH1 = styled(animated.h1)`
  font-family: 'Audiowide', sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  will-change: opacity;
`;

const AnimatedP = styled(animated.p)`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 1.5rem;
  max-width: 600px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  will-change: opacity;
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
    0%, 20%, 50%, 80%, 100% {
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

// 使用Locomotive Scroll的首頁容器
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden; /* Locomotive Scroll 處理滾動 */
  z-index: 1; /* 位於Hero上方 */
`;

// 包含所有區塊的內容容器
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  position: relative; /* 確保z-index生效 */
  z-index: 1; /* 位於Hero上方 */
`;

// 占位符，用於將內容推至Hero下方
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
`;

// 區塊標題，帶有圖示
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

// 特定區塊，帶有獨特背景
const EventInfoSection = styled(Section)`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
`;

const AboutUsSection = styled(Section)`
  background: linear-gradient(45deg, #54a0ff, #5f27cd);
`;

const GoalsSection = styled(Section)`
  background: linear-gradient(45deg, #ff9ff3, #feca57);
`;

const ParticipantInfoSection = styled(Section)`
  background: linear-gradient(45deg, #48dbfb, #ff6b6b);
`;

const RegistrationSection = styled(Section)`
  background: linear-gradient(45deg, #5f27cd, #48dbfb);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

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

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
`;

// 內容容器，帶有動畫
const EventInfoContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  will-change: transform;
`;

const InfoItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 10px;
  flex: 1 1 200px;
  font-size: 1.1rem;
  color: white;
  will-change: opacity, transform;
  transition: transform 0.3s ease;

  strong {
    display: block;
    margin-bottom: 5px;
  }

  &:hover {
    transform: scale(1.05);
  }
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

const GoalsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 5px;
  justify-items: center;
  will-change: transform;
`;

const GoalItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px;
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

const ParticipantInfoContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: opacity, transform;

  h3 {
    font-size: 1.8rem;
    margin-top: 30px;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 20px;
    max-width: 800px;
    text-align: center;
  }
`;

const RequiredItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform;

  li {
    font-size: 1.1rem;
    margin-bottom: 10px;
    padding-left: 25px;
    position: relative;
    will-change: opacity, transform;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #feca57;
    }

    &:hover {
      color: #feca57;
      transform: translateX(5px);
      transition: transform 0.3s ease, color 0.3s ease;
    }
  }
`;

const RegistrationButton = styled(animated.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b); /* 從柔和的橙色到桃色的漸層 */
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform, background, box-shadow;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4); /* 更柔和的陰影 */

  &:hover {
    transform: scale(1.08); /* 滑鼠懸停時更明顯的縮放 */
    background: linear-gradient(135deg, #feb47b, #ff7e5f); /* 滑鼠懸停時反轉漸層 */
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.6); /* 滑鼠懸停時更大的陰影 */
  }

  &:active {
    transform: scale(1); /* 點擊時重置縮放 */
    box-shadow: 0 3px 10px rgba(255, 126, 95, 0.3); /* 點擊時較輕的陰影 */
  }
`;

// 導覽點，帶有提示和動畫
const NavigationDots = ({ activeSection, sectionRefs, handleScrollTo }) => (
  <NavDotsContainer>
    {Object.keys(sectionRefs).map((section) => {
      const isActive = activeSection === section;
      return (
        <Tooltip key={section} data-tooltip={formatSectionName(section)}>
          <NavDotComponent
            isActive={isActive}
            onClick={() => {
              handleScrollTo(sectionRefs[section]);
            }}
          />
        </Tooltip>
      );
    })}
  </NavDotsContainer>
);

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

// 格式化區塊名稱
const formatSectionName = (section) => {
  const sectionNames = {
    eventInfo: '活動資訊',
    aboutUs: '關於我們',
    goals: '活動目標',
    participantInfo: '參與者須知',
    registration: '報名活動',
    qa: '常見問答',
    contactInfo: '聯絡資訊',
  };
  return sectionNames[section] || section;
};

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

const NavDotComponent = React.memo(({ isActive, onClick }) => {
  const springProps = useSpring({
    transform: isActive ? 'scale(1.5)' : 'scale(1)',
    opacity: isActive ? 1 : 0.7,
    config: config.wobbly,
  });

  return <AnimatedNavDot style={springProps} isActive={isActive} onClick={onClick} />;
});

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

const AnimatedLiStyled = styled(animated.li)`
  will-change: opacity, transform;
`;

// --------------------------------------------
// 2. SectionAnimation 元件，用於減震效果
// --------------------------------------------

const SectionAnimation = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 14 }, // 減震效果
  });

  return (
    <animated.div ref={ref} style={animation}>
      {children}
    </animated.div>
  );
};

// --------------------------------------------
// 3. Home 元件定義
// --------------------------------------------

const Home = () => {
  // 1. 在頂層定義所有 Hook
  const [activeSection, setActiveSection] = useState(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [activeQAIndices, setActiveQAIndices] = useState({}); // 新增 Hook

  // Refs
  const scrollContainerRef = useRef(null);
  const locoScroll = useRef(null);
  const eventInfoRef = useRef(null);
  const aboutUsRef = useRef(null);
  const goalsRef = useRef(null);
  const participantInfoRef = useRef(null);
  const registrationRef = useRef(null);
  const qaRef = useRef(null);
  const contactInfoRef = useRef(null);

  // 記憶化區塊參考
  const sectionRefs = useMemo(
    () => ({
      eventInfo: eventInfoRef,
      aboutUs: aboutUsRef,
      goals: goalsRef,
      participantInfo: participantInfoRef,
      registration: registrationRef,
      qa: qaRef,
      contactInfo: contactInfoRef,
    }),
    [eventInfoRef, aboutUsRef, goalsRef, participantInfoRef, registrationRef, qaRef, contactInfoRef]
  );

  // 2. 初始化 Locomotive Scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      locoScroll.current = new LocomotiveScroll({
        el: scrollContainerRef.current,
        smooth: true,
      });

      locoScroll.current.on('scroll', (obj) => {
        // 根據 scrollY 計算 Hero 的透明度
        const scrollY = obj.scroll.y;
        const windowHeight = window.innerHeight;
        const opacity = 1 - Math.min(scrollY / windowHeight, 1);
        setHeroOpacity(opacity);

        // 確定當前活躍區塊
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
      });
    }

    return () => {
      if (locoScroll.current) {
        locoScroll.current.destroy();
      }
    };
  }, [sectionRefs]);

  // 3. 設定函式以使用 Locomotive Scroll 進行平滑滾動
  const handleScrollTo = (ref) => {
    if (locoScroll.current && ref.current) {
      locoScroll.current.scrollTo(ref.current);
    }
  };

  // 4. 使用 react-spring 設定 Hero 的透明度動畫
  const heroSpring = useSpring({
    opacity: heroOpacity,
    config: {
      tension: 180,
      friction: 20,
    },
  });

  // 5. Hook 之後的早期返回
  if (!content) {
    return <div>Loading...</div>;
  }

  // 6. 切換 Q&A 項目
  const toggleQA = (index) => {
    setActiveQAIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <GlobalStyle />
      {/* 固定於滾動容器外的元素 */}
      <ParallaxBackground />
      <AnimatedHero style={heroSpring}>
        <AnimatedH1>
          {content.eventName || 'Hackathon 2024'}
        </AnimatedH1>
        <AnimatedP>
          {content.eventDescription || 'Innovate. Create. Revolutionize.'}
        </AnimatedP>
        <ScrollIndicator onClick={() => handleScrollTo(sectionRefs.eventInfo)}>
          <span>滑動以探索</span>
          <ChevronDown size={24} />
        </ScrollIndicator>
      </AnimatedHero>

      {/* 滾動容器 */}
      <HomeContainer ref={scrollContainerRef} data-scroll-container>
        <ContentWrapper>
          <HeroPlaceholder />

          {/* 活動資訊區塊 */}
          <EventInfoSection ref={sectionRefs.eventInfo} id="eventInfo" data-scroll-section>
            <SectionTitle>
              <Calendar /> 活動資訊
            </SectionTitle>
            <EventInfoContent>
              {Object.entries(content.eventDetails || {}).map(([key, value]) => (
                <SectionAnimation key={key}>
                  <InfoItem>
                    <strong>{key}:</strong> {value}
                  </InfoItem>
                </SectionAnimation>
              ))}
            </EventInfoContent>
          </EventInfoSection>

          {/* 關於我們區塊 */}
          <AboutUsSection ref={sectionRefs.aboutUs} id="aboutUs" data-scroll-section>
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
          <GoalsSection ref={sectionRefs.goals} id="goals" data-scroll-section>
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

          {/* 參與者須知區塊 */}
          <ParticipantInfoSection ref={sectionRefs.participantInfo} id="participantInfo" data-scroll-section>
            <SectionTitle>
              <Briefcase /> 參與者須知
            </SectionTitle>
            <ParticipantInfoContent>
              <SectionAnimation>
                <h3>報名流程</h3>
                <p>{content.registrationProcess}</p>
              </SectionAnimation>
              <SectionAnimation>
                <h3>必備物品</h3>
                <RequiredItemsList>
                  {(content.requiredItems || []).map((item, index) => (
                    <AnimatedLiStyled key={index}>
                      {item}
                    </AnimatedLiStyled>
                  ))}
                </RequiredItemsList>
              </SectionAnimation>
            </ParticipantInfoContent>
          </ParticipantInfoSection>

          {/* 報名活動區塊 */}
          <RegistrationSection ref={sectionRefs.registration} id="registration" data-scroll-section>
            <SectionTitle>
              <Mail /> 報名活動
            </SectionTitle>
            <SectionAnimation>
              <RegistrationButton
                onClick={() => {
                  if (content.registrationPath) {
                    // 使用 locomotive-scroll 的 scrollTo 如果 registrationPath 是頁面上的錨點
                    // 否則，直接導航
                    if (content.registrationPath.startsWith('#') && sectionRefs.registration.current) {
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
          <QASection ref={sectionRefs.qa} id="qa" data-scroll-section>
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
          <ContactInfoSection ref={sectionRefs.contactInfo} id="contactInfo" data-scroll-section>
            <SectionTitle>
              <Phone /> 聯絡資訊
            </SectionTitle>
            <ContactInfoContent>
              <SectionAnimation>
                <ContactItem>
                  <Mail size={24} /> <a href={`mailto:${content.contactInfo.email}`} style={{ color: 'white', textDecoration: 'none' }}>{content.contactInfo.email}</a>
                </ContactItem>
              </SectionAnimation>
              <SectionAnimation>
                <ContactItem>
                  <Phone size={24} /> <a href={`https://instagram.com/${content.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>@{content.contactInfo.instagram}</a>
                </ContactItem>
              </SectionAnimation>
            </ContactInfoContent>
          </ContactInfoSection>
        </ContentWrapper>

        {/* 導覽點 */}
        <NavigationDots activeSection={activeSection} sectionRefs={sectionRefs} handleScrollTo={handleScrollTo} />
      </HomeContainer>
    </>
  );
};

// --------------------------------------------
// 4. 匯出 Home 元件
// --------------------------------------------

export default Home;
