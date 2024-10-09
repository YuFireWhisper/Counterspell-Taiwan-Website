// src/components/AboutUs.js

import React from "react";
import styled from "styled-components";
import { Users } from "lucide-react";
import SectionAnimation from "./SectionAnimation";
import content from "./content";
import { Section } from "./Section";

const AboutUsSection = styled(Section)`
  font-size: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #ff6f61; /* 主色 */
  font-size: 2.5rem;
`;

const AboutUsContent = styled.div`
  color: #333333; /* 文字色 */
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
    <AboutUsSection bgColor="#FFE5D9">
      {" "}
      {/* 淡珊瑚橙 */}
      <SectionTitle>
        <Users /> 關於我們
      </SectionTitle>
      <SectionAnimation>
        <AboutUsContent>
          <p>
            {content.aboutUs ||
              "我們是一群對技術充滿熱情，致力於改變世界的創新者。"}
          </p>
        </AboutUsContent>
      </SectionAnimation>
    </AboutUsSection>
  );
};

export default AboutUs;
