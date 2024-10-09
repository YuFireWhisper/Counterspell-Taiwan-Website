// src/components/AboutUs.js

import React from 'react';
import styled from 'styled-components';
import { Users } from 'lucide-react';
import SectionAnimation from './SectionAnimation';
import content from './content';
import { Section } from './Section';

const AboutUsSection = styled(Section)`
  background: #007BFF; /* 藍色主背景 */
  color: #F8F9FA; /* 文字為淡灰色 */
  font-size: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 2.5rem;
`;

const AboutUsContent = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  text-align: center;
  will-change: opacity, transform;
  font-size: 1.5rem;
`;

const AboutUs = () => {
  return (
    <AboutUsSection style={{ background: 'linear-gradient(45deg, #54a0ff, #5f27cd)' }}>
      <SectionTitle>
        <Users /> 關於我們
      </SectionTitle>
      <SectionAnimation>
        <AboutUsContent>
          <p>
            {content.aboutUs || '我們是一群對技術充滿熱情，致力於改變世界的創新者。'}
          </p>
        </AboutUsContent>
      </SectionAnimation>
    </AboutUsSection>
  );
};

export default AboutUs;
