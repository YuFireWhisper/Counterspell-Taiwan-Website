// src/components/Timeline.js

import React from 'react';
import styled from 'styled-components'; // 確保引入 styled-components
import { Calendar } from 'lucide-react';
import SectionAnimation from './SectionAnimation'; // 引入 SectionAnimation
import { Section, SectionTitle } from './Section'; // 引入通用的 Section 和 SectionTitle

// 時間軸內容樣式
const TimelineContent = styled.div`
  width: 100%;
  max-width: 1000px;
  position: relative;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    background: #6A4C93; /* 輔色 */
    z-index: 0;
    transform: translateX(-50%);
  }
`;

// 時間軸項目的外層容器
const TimelineItemWrapper = styled.div`
  position: relative;
  width: 50%;
  padding: 20px 40px;
  box-sizing: border-box;
  margin-top: 20px;
  
  ${({ index }) => (index % 2 === 0 ? 'left: 0;' : 'left: 50%;')}
  
  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    padding: 10px 20px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    ${({ index }) => (index % 2 === 0 ? 'right: -8px;' : 'left: -8px;')}
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: #FF6F61; /* 主色 */
    border-radius: 50%;
    z-index: 1;
  }
`;

// 時間軸項目內容樣式
const TimelineItemContent = styled.div`
  background: #FFE5D9; /* 淡珊瑚橙 */
  backdrop-filter: blur(5px);
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #6A4C93; /* 輔色 */
  }
  
  p {
    font-size: 1.2rem;
    color: #333333; /* 文字色改為深灰色 */
    line-height: 1.5;
  }
  
  time {
    display: block;
    font-size: 1rem;
    color: #FF6F61; /* 主色 */
    margin-bottom: 5px;
  }
`;

// 主要時間軸組件
const Timeline = ({ items }) => {
  return (
    <Section bgColor="#E6E6FF"> {/* 淡紫羅蘭色 */}
      <SectionTitle>
        <Calendar /> 活動時程
      </SectionTitle>
      <TimelineContent>
        {items.map((item, index) => (
          <SectionAnimation key={index}>
            <TimelineItemWrapper index={index}>
              <TimelineItemContent>
                <time>{item.date}</time>
                <h3>{item.event}</h3>
                <p>{item.description}</p>
              </TimelineItemContent>
            </TimelineItemWrapper>
          </SectionAnimation>
        ))}
      </TimelineContent>
    </Section>
  );
};

export default Timeline;
