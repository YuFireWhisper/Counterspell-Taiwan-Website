// src/components/EventInfo.js

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Calendar, Users, MapPin } from 'lucide-react';
import content from './content';
import { Section, SectionTitle } from './Section'; // 引入通用的 Section 和 SectionTitle
import SectionAnimation from './SectionAnimation';

// 容器保持為 flex，並設置 align-items 為 stretch 以確保子項目高度一致
const EventInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 30px;
  border-radius: 20px;
  padding: 50px;
`;

// 調整 EventInfoItem 以使用 flex 來置中內容，並確保高度一致
const EventInfoItem = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background: ${(props) => props.itemBgColor || '#FFE5D9'}; /* 使用新配色方案的淡珊瑚橙 */
  margin: 10px;
  text-align: center;
  color: #333333; /* 深灰色文字 */
  border-radius: 20px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直置中 */
  align-items: center; /* 水平置中 */
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: transform 0.3s ease, opacity 0.3s ease;

  /* 確保所有項目的高度一致 */
  height: 100%;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #FF6F61; /* 主色 */
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
    color: #333333; /* 深灰色文字 */
  }

  svg {
    margin-bottom: 15px;
    color: #6A4C93; /* 輔色圖標 */
  }
`;

const EventInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.7, // 觸發閾值為 70%
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <Section ref={sectionRef} bgColor="#E6E6FF"> {/* 淡紫羅蘭色背景 */}
      <SectionTitle>
        <MapPin /> 活動資訊
      </SectionTitle>
      <EventInfoContainer>
        {/* 活動日期 */}
        <SectionAnimation>
          <EventInfoItem isVisible={isVisible} itemBgColor="#FFE5D9"> {/* 淡珊瑚橙 */}
            <Calendar size={40} />
            <h3>活動日期</h3>
            <p>{content.eventDetails?.date || '2024年12月1日 - 12月2日'}</p>
          </EventInfoItem>
        </SectionAnimation>

        {/* 活動地點 */}
        <SectionAnimation>
          <EventInfoItem isVisible={isVisible} itemBgColor="#FFE5D9"> {/* 淡珊瑚橙 */}
            <MapPin size={40} />
            <h3>活動地點</h3>
            <p>{content.eventDetails?.location || '台北市信義區信義路五段7號'}</p>
          </EventInfoItem>
        </SectionAnimation>

        {/* 主辦單位 */}
        <SectionAnimation>
          <EventInfoItem isVisible={isVisible} itemBgColor="#FFE5D9"> {/* 淡珊瑚橙 */}
            <Users size={40} />
            <h3>主辦單位</h3>
            <p>{content.eventDetails?.organizer || 'HackIt'}</p>
            <h3>協辦單位</h3>
            <p>{content.eventDetails?.coOrganizer || 'Hack Club'}</p>
          </EventInfoItem>
        </SectionAnimation>
      </EventInfoContainer>
    </Section>
  );
};

export default EventInfo;
