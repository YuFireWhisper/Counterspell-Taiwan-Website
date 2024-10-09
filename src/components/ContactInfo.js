// src/components/ContactInfo.js

import React from 'react';
import styled from 'styled-components';
import { Mail, Phone } from 'lucide-react';
import SectionAnimation from './SectionAnimation'; // 引入 SectionAnimation
import content from './content';
import { Section, SectionTitle } from './Section'; // 引入通用的 Section 和 SectionTitle

const ContactInfoContent = styled.div`
  color: white;
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
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactInfo = () => {
  return (
    <Section style={{ background: 'linear-gradient(45deg, #f8a5c2, #f7d794)' }}>
      <SectionTitle>
        <Phone /> 聯絡資訊
      </SectionTitle>
      <ContactInfoContent>
        <SectionAnimation>
          <ContactItem>
            <Mail size={24} />
            <a href={`mailto:${content.contactInfo?.email || 'contact@hackathon2024.com'}`}>
              {content.contactInfo?.email || 'contact@hackathon2024.com'}
            </a>
          </ContactItem>
        </SectionAnimation>
        <SectionAnimation>
          <ContactItem>
            <Phone size={24} />
            <a
              href={`https://instagram.com/${content.contactInfo?.instagram || 'hackathon2024'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{content.contactInfo?.instagram || 'hackathon2024'}
            </a>
          </ContactItem>
        </SectionAnimation>
      </ContactInfoContent>
    </Section>
  );
};

export default ContactInfo;
