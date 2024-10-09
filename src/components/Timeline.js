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
  transform: scale(0.8);
  transform-origin: top center;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    background: white;
    z-index: 0;
    transform: translateX(-50%);
  }
`;

// 每個時間軸項目的外層容器
const TimelineItemWrapper = styled.div`
  position: relative;
  width: 50%;
  padding: 5px 10px;
  box-sizing: border-box;
  margin-top: 5px;

  ${({ index }) => (index % 2 === 0 ? 'left: 5%;' : 'left: 51%;')}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${({ index }) => (index % 2 === 0 ? '90%' : '-2%')};
    transform: translateX(-50%) translateY(-50%);
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    z-index: 1;
  }
`;

// 時間軸項目內容樣式
const TimelineItemContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 5px;
    color: white;
  }

  p {
    font-size: 1.2rem;
    color: white;
    pading: 5px;
  }

  time {
    display: block;
    font-size: 2rem;
    color: white;
    font-weight: bold;
  }
`;

// 主要時間軸組件
const Timeline = ({ items }) => {
  return (
    <Section style={{ background: 'linear-gradient(to right top, #8ee4ba, #8dd5a0, #8dc687, #8eb76f, #8fa758)' }}>
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
