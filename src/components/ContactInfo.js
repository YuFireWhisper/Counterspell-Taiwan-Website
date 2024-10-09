// src/components/ContactInfo.js

import React from "react";
import styled from "styled-components";
import { Mail, Phone } from "lucide-react";
import SectionAnimation from "./SectionAnimation"; // 引入 SectionAnimation
import content from "./content";
import { Section, SectionTitle } from "./Section"; // 引入通用的 Section 和 SectionTitle

const ContactInfoContent = styled.div`
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 800px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;

  a {
    color: #ff6f61; /* 主色 */
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: #ffc75f; /* 點綴色 */
    }
  }
`;

const ContactInfo = () => {
  return (
    <Section bgColor="#E6E6FF">
      {" "}
      {/* 淡紫羅蘭色 */}
      <SectionTitle>
        <Phone /> 聯絡資訊
      </SectionTitle>
      <ContactInfoContent>
        <SectionAnimation>
          <ContactItem>
            <Mail size={24} />
            <a
              href={`mailto:${content.contactInfo?.email || "contact@hackathon2024.com"}`}
            >
              {content.contactInfo?.email || "contact@hackathon2024.com"}
            </a>
          </ContactItem>
        </SectionAnimation>
        <SectionAnimation>
          <ContactItem>
            <Phone size={24} />
            <a
              href={`https://instagram.com/${content.contactInfo?.instagram || "hackathon2024"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{content.contactInfo?.instagram || "hackathon2024"}
            </a>
          </ContactItem>
        </SectionAnimation>
      </ContactInfoContent>
    </Section>
  );
};

export default ContactInfo;
