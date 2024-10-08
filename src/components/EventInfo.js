// src/components/EventInfo.js

import React from 'react';
import styled from 'styled-components';
import { Calendar, Users, MapPin } from 'lucide-react';
import SectionAnimation from './SectionAnimation';
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

const EventInfo = () => {
  return (
    <EventInfoContainer>
      {/* 活動日期 */}
      <EventInfoItem>
        <SectionAnimation>
          <Calendar size={40} />
          <h3>活動日期</h3>
          <p>{content.eventDetails?.date || '2024年12月1日 - 12月2日'}</p>
        </SectionAnimation>
      </EventInfoItem>

      {/* 活動地點 */}
      <EventInfoItem>
        <SectionAnimation>
          <MapPin size={40} />
          <h3>活動地點</h3>
          <p>{content.eventDetails?.location || '台北市信義區信義路五段7號'}</p>
        </SectionAnimation>
      </EventInfoItem>

      {/* 主辦單位 */}
      <EventInfoItem>
        <SectionAnimation>
          <Users size={40} />
          <h3>主辦單位</h3>
          <p>{content.eventDetails?.organizer || 'HackIt'}</p>
          <h3>協辦單位</h3>
          <p>{content.eventDetails?.coOrganizer || 'Hack Club'}</p>
        </SectionAnimation>
      </EventInfoItem>
    </EventInfoContainer>
  );
};

export default EventInfo;
