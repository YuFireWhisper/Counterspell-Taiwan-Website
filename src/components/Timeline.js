import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Calendar } from 'lucide-react';

// 時間軸區塊樣式
const TimelineSection = styled.section`
  background: linear-gradient(45deg, #feca57, #ff9ff3);
  max-height: 650px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  justify-content: center;
  border-radius: 20px;
  margin: 0 auto;
  margin-bottom: 30px;
`;

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

  ${({ index }) => (index % 2 === 0 ? 'left: 0;' : 'left: 50%;')}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${({ index }) => (index % 2 === 0 ? '100%' : '0')};
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
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: transform 0.3s ease, opacity 0.3s ease;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: white;
  }

  p {
    font-size: 1rem;
    color: white;
  }

  time {
    display: block;
    font-size: 0.9rem;
    color: #feca57;
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

// 區塊標題樣式
const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
  margin-top: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
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

const TimelineItem = ({ date, event, description, index }) => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 滾動到視口 70% 處觸發

  return (
    <TimelineItemWrapper ref={elementRef} index={index}>
      <TimelineItemContent isVisible={isVisible}>
        <time>{date}</time>
        <h3>{event}</h3>
        <p>{description}</p>
      </TimelineItemContent>
    </TimelineItemWrapper>
  );
};

// 主要時間軸組件
const Timeline = ({ items }) => {
  return (
    <TimelineSection>
      <SectionTitle>
        <Calendar /> 活動時程
      </SectionTitle>
      <TimelineContent>
        {items.map((item, index) => (
          <TimelineItem key={index} {...item} index={index} />
        ))}
      </TimelineContent>
    </TimelineSection>
  );
};

export default Timeline;
