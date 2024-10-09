// src/components/Goal.js

import React from 'react';
import styled from 'styled-components';
import { Award } from 'lucide-react';
import { Section, SectionTitle } from './Section';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';

// 目標內容包裝
const GoalsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  justify-items: center;
  width: 100%;
  max-width: 1000px;
  will-change: transform;
`;

// 目標項目，帶有懸停效果
const GoalItem = styled.div`
  background-color: #FF6F61; /* 主色 */
  padding: 15px;
  border-radius: 15px;
  color: #FFFFFF; /* 文字色 */
  transition: transform 0.3s ease;
  will-change: transform, opacity;
  max-width: 400px;
  height: 160px;
  margin: 0 20px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 111, 97, 0.2); /* 添加陰影 */
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-align: center;
    color: #FFC75F; /* 點綴色 */
  }

  p {
    color: #FFFFFF; /* 文字色 */
    font-size: 1.1rem;
    line-height: 1.5;
    text-align: center;
  }
`;

const GoalSectionTitle = styled(SectionTitle)`
  color: #6A4C93; /* 輔色 */
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
    <Section bgColor="#FFE5D9"> {/* 淡珊瑚橙 */}
      <GoalSectionTitle>
        <Award /> 活動目標
      </GoalSectionTitle>
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
    </Section>
  );
};

export default Goals;
