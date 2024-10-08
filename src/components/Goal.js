import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Award } from 'lucide-react';
import { SectionTitle } from './Section';

// 目標內容網格
const GoalSection = styled.section`
  background: linear-gradient(45deg, #ff9ff3, #feca57);
  margin-bottom: 30px;
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

// 目標內容包裝
const GoalsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
  width: 100%;
  max-width: 1000px;
  will-change: transform;
`;

// 目標項目，帶有懸停效果
const GoalItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 15px;
  color: white;
  transition: transform 0.3s ease, opacity 0.3s ease;
  will-change: transform, opacity;
  width: 100%;
  max-width: 300px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};

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

// Goals 組件
const Goals = ({ goals }) => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 滾動到視口 70% 處觸發

  return (
    <GoalSection ref={elementRef}>
      <SectionTitle>
        <Award /> 活動目標
      </SectionTitle>
      <GoalsContent>
        {goals.map((goal, index) => (
          <GoalItem key={index} isVisible={isVisible}>
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
          </GoalItem>
        ))}
      </GoalsContent>
    </GoalSection>
  );
};

export default Goals;
