import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Users } from 'lucide-react';
import content from './content';

const AboutUsSection = styled.section`
  background: linear-gradient(45deg, #54a0ff, #5f27cd);
  margin-bottom: 30px;
  background-color: transparent;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  will-change: background, transform;
  transition: background 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const AboutUsContent = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  text-align: center;
  will-change: opacity, transform;
  font-size: 1.5rem;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

// 自定義滾動觸發鉤子
const useScrollTrigger = (threshold = 0.5) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const handleScroll = () => {
    const element = elementRef.current;
    if (!element) return;

    const { top, bottom } = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (top <= windowHeight * threshold && bottom >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化檢測

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isVisible, elementRef };
};

const AboutUs = () => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 滾動到視口 70% 處觸發

  return (
    <AboutUsSection ref={elementRef}>
      <SectionTitle>
        <Users /> 關於我們
      </SectionTitle>
      <AboutUsContent isVisible={isVisible}>
        <p>
          {content.aboutUs || '我們是一群對技術充滿熱情，致力於改變世界的創新者。'}
        </p>
      </AboutUsContent>
    </AboutUsSection>
  );
};

export default AboutUs;
