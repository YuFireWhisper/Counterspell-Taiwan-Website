import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Briefcase } from 'lucide-react';
import content from './content';

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

const RequiredItemsSection = styled.section`
  background: linear-gradient(45deg, #48dbfb, #ff6b6b);
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

const RequiredItemsContent = styled.div`
  color: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
  width: 100%;
  max-width: 1000px;
  will-change: transform;
  padding: 5px 10px;
`;

const RequiredItem = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px;
  margin: 0 10px;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(20px)')};

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

// 自定義鉤子，用於檢測滾動和視口
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

const RequiredItems = () => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 當元素進入視口 70% 時觸發

  return (
    <RequiredItemsSection ref={elementRef}>
      <SectionTitle>
        <Briefcase /> 必備物品
      </SectionTitle>
      <RequiredItemsContent>
        {(content.participantInfo?.requiredItems || []).map((item, index) => (
          <RequiredItem key={index} isVisible={isVisible}>
            <Briefcase size={30} />
            <p>{item}</p>
          </RequiredItem>
        ))}
      </RequiredItemsContent>
    </RequiredItemsSection>
  );
};

export default RequiredItems;
