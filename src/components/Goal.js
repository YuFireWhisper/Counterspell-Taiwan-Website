// src/components/Goal.js

import React from 'react';
import styled from 'styled-components';
import { Award } from 'lucide-react';
import { Section, SectionTitle } from './Section';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';

// 目標內容網格
const GoalsSection = styled(Section)`
  background: linear-gradient(45deg, #ff9ff3, #feca57);
  width: 100%;
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
  transition: transform 0.3s ease;
  will-change: transform, opacity;
  width: 100%;
  max-width: 300px;

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

// SectionAnimation 組件，用於進場動畫
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

// Goals 組件
const Goals = ({ goals }) => {
  return (
    <GoalsSection>
      <SectionTitle>
        <Award /> 活動目標
      </SectionTitle>
      <GoalsContent>
        {goals.map((goal, index) => (
          <SectionAnimation key={index}>
            <GoalItem>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
            </GoalItem>
          </SectionAnimation>
        ))}
      </GoalsContent>
    </GoalsSection>
  );
};

export default Goals;
