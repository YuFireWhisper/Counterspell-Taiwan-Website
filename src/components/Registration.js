// src/components/Registration.js

import React from "react";
import styled from "styled-components";
import { Mail } from "lucide-react";
import SectionAnimation from "./SectionAnimation";
import content from "./content";
import { animated } from "@react-spring/web";
import { Section, SectionTitle } from "./Section";

const RegistrationContent = styled.div`
  max-width: 800px;
  margin-bottom: 30px;

  p {
    font-size: 1.5rem;
    line-height: 1.6;
    color: #333333; /* 文字色改為深灰色 */
  }
`;

const RegistrationButton = styled(animated.button)`
  padding: 15px 30px;
  background: #ff6f61; /* 主色 */
  color: #ffffff; /* 白色文字 */
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform, background, box-shadow;
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.4); /* 調整陰影顏色 */

  &:hover {
    transform: scale(1.08);
    background: #ffc75f; /* 點綴色 */
    box-shadow: 0 8px 25px rgba(255, 199, 95, 0.6); /* 調整陰影顏色 */
  }

  &:active {
    transform: scale(1);
    box-shadow: 0 3px 10px rgba(255, 111, 97, 0.3); /* 調整陰影顏色 */
  }
`;

const RegistrationTitle = styled(SectionTitle)`
  color: #ff6f61; /* 主色 */
`;

const Registration = ({ sectionRefs, handleScrollTo }) => {
  return (
    <Section bgColor="#FFF3CC">
      {" "}
      {/* 淡芥末黃 */}
      <RegistrationTitle>
        <Mail /> 報名活動
      </RegistrationTitle>
      <RegistrationContent>
        <SectionAnimation>
          <p>
            {content.participantInfo?.registrationProcess ||
              "報名流程資訊尚未更新。"}
          </p>
        </SectionAnimation>
      </RegistrationContent>
      <SectionAnimation>
        <RegistrationButton
          onClick={() => {
            if (content.registrationPath) {
              if (
                content.registrationPath.startsWith("#") &&
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
