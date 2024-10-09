// src/components/Registration.js

import React from 'react';
import styled from 'styled-components';
import { Mail } from 'lucide-react';
import SectionAnimation from './SectionAnimation';
import content from './content';
import { animated } from '@react-spring/web';
import { Section, SectionTitle } from './Section'; // 引入通用的 Section 和 SectionTitle

const RegistrationContent = styled.div`
  max-width: 800px;
  margin-bottom: 30px;

  p {
    font-size: 1.5rem;
    line-height: 1.6;
    color: white;
  }
`;

const RegistrationButton = styled(animated.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform, background, box-shadow;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4);

  &:hover {
    transform: scale(1.08);
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.6);
  }

  &:active {
    transform: scale(1);
    box-shadow: 0 3px 10px rgba(255, 126, 95, 0.3);
  }
`;

const Registration = ({ sectionRefs, handleScrollTo }) => {
  return (
    <Section style={{ background: 'linear-gradient(45deg, #5f27cd, #48dbfb)' }}>
      <SectionTitle>
        <Mail /> 報名活動
      </SectionTitle>
      <RegistrationContent>
        <SectionAnimation>
          <p>
            {content.participantInfo?.registrationProcess ||
              '報名流程資訊尚未更新。'}
          </p>
        </SectionAnimation>
      </RegistrationContent>
      <SectionAnimation>
        <RegistrationButton
          onClick={() => {
            if (content.registrationPath) {
              if (
                content.registrationPath.startsWith('#') &&
                sectionRefs.registration.current
              ) {
                handleScrollTo(sectionRefs.registration);
              } else {
                window.location.href = content.registrationPath;
              }
            }
          }}
        >
          開啟報名表單
        </RegistrationButton>
      </SectionAnimation>
    </Section>
  );
};

export default Registration;
