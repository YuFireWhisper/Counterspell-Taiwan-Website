// src/components/RequiredItems.js

import React from "react";
import styled from "styled-components";
import { Briefcase } from "lucide-react";
import SectionAnimation from "./SectionAnimation";
import content from "./content";
import { Section, SectionTitle } from "./Section";

const RequiredItemsContent = styled.div`
  color: #333333; /* 文字色改為深灰色 */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
  width: 100%;
  max-width: 1000px;
  padding: 5px 10px;
`;

const RequiredItem = styled.div`
  background-color: #ffe5d9; /* 淡珊瑚橙 */
  padding: 15px;
  margin: 0 10px;
  border-radius: 15px;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 4px 15px rgba(255, 111, 97, 0.2); /* 添加陰影 */
  }

  svg {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #6a4c93; /* 輔色 */
  }

  p {
    font-size: 1.1rem;
    color: #333333; /* 文字色改為深灰色 */
  }
`;

const RequiredItemsTitle = styled(SectionTitle)`
  color: #ff6f61; /* 主色 */
`;

const RequiredItems = () => {
  return (
    <Section bgColor="#E6E6FF">
      {" "}
      {/* 淡紫羅蘭色 */}
      <RequiredItemsTitle>
        <Briefcase /> 必備物品
      </RequiredItemsTitle>
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
