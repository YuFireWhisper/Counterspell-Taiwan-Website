import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Calendar, Users, MapPin } from 'lucide-react';
import content from './content';

const EventInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 30px;
  border-radius: 20px;
`;

const EventInfoItem = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  background: linear-gradient(45deg, #ff9ff3, #feca57);
  margin: 10px;
  text-align: center;
  color: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: transform 0.3s ease, opacity 0.3s ease;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  svg {
    margin-bottom: 15px;
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

const EventInfo = () => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 滾動到視口 70% 處觸發

  return (
    <EventInfoContainer ref={elementRef}>
      {/* 活動日期 */}
      <EventInfoItem isVisible={isVisible}>
        <Calendar size={40} />
        <h3>活動日期</h3>
        <p>{content.eventDetails?.date || '2024年12月1日 - 12月2日'}</p>
      </EventInfoItem>

      {/* 活動地點 */}
      <EventInfoItem isVisible={isVisible}>
        <MapPin size={40} />
        <h3>活動地點</h3>
        <p>{content.eventDetails?.location || '台北市信義區信義路五段7號'}</p>
      </EventInfoItem>

      {/* 主辦單位 */}
      <EventInfoItem isVisible={isVisible}>
        <Users size={40} />
        <h3>主辦單位</h3>
        <p>{content.eventDetails?.organizer || 'HackIt'}</p>
        <h3>協辦單位</h3>
        <p>{content.eventDetails?.coOrganizer || 'Hack Club'}</p>
      </EventInfoItem>
    </EventInfoContainer>
  );
};

export default EventInfo;
