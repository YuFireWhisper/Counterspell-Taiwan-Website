// src/components/ContactInfo.js

import React from 'react';
import styled from 'styled-components';
import { Mail, Phone } from 'lucide-react';
import SectionAnimation from './SectionAnimation';
import content from './content';

const ContactInfoSection = styled.section`
  background: linear-gradient(45deg, #f8a5c2, #f7d794);
  margin-bottom: 30px;
  background-color: transparent;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  will-change: background, transform;
  transition: background 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContactInfoContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: opacity, transform;
  gap: 15px;
  width: 100%;
  max-width: 800px;
`;

const SectionTitle = styled.h2`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  will-change: opacity, transform;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.2);
    }
  }
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
    <ContactInfoSection>
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
    </ContactInfoSection>
  );
};

export default ContactInfo;
