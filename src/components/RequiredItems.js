// src/components/RequiredItems.js

import React from 'react';
import styled from 'styled-components';
import { Briefcase } from 'lucide-react';
import SectionAnimation from './SectionAnimation';
import content from './content';
import { Section, SectionTitle } from './Section'; // 引入通用的 Section 和 SectionTitle

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
  transition: transform 0.3s ease;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center;

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

const RequiredItems = () => {
  return (
    <Section style={{ background: 'linear-gradient(45deg, #48dbfb, #ff6b6b)' }}>
      <SectionTitle>
        <Briefcase /> 必備物品
      </SectionTitle>
      <RequiredItemsContent>
        {(content.participantInfo?.requiredItems || []).map((item, index) => (
          <SectionAnimation key={index}>
            <RequiredItem>
              <Briefcase size={30} />
              <p>{item}</p>
            </RequiredItem>
          </SectionAnimation>
        ))}
      </RequiredItemsContent>
    </Section>
  );
};

export default RequiredItems;
