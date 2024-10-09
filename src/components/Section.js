// src/components/Section.js

import styled from 'styled-components';

// 通用區塊樣式，帶有背景和動畫
export const Section = styled.section`
  margin-bottom: 30px;
  background-color: ${(props) => props.bgColor || '#F2F2F2'}; /* 接收 bgColor props，預設為 #F2F2F2 */
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 帶有圖標的區塊標題
export const SectionTitle = styled.h2`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #FF6F61; /* 主色 */
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.2);
    }
  }
`;
