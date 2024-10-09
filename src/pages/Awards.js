// src/pages/Awards.js

import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom"; // 使用 react-router-dom 進行路由
import content from "../components/content";

// 全局樣式（可重複使用或從 Home.js 中抽取）
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: 'Noto Sans TC', sans-serif;
    background-color: #121212;
    color: white;
  }
  a {
    color: #feca57;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

// 頁面容器
const PageContainer = styled.div`
  padding: 50px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7d794, #f8a5c2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 頁面標題
const PageTitle = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  font-family: "Audiowide", sans-serif;
`;

// 得獎名單內容區塊
const AwardsContent = styled.div`
  max-width: 1000px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

// 單個獎項類別
const AwardCategory = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  ul {
    list-style-type: disc;
    margin-left: 20px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
`;

// 返回主頁按鈕
const BackButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #feca57;
  color: #121212;
  border-radius: 50px;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background: #ff9f43;
  }
`;

// --------------------------------------------
// 1. Awards 組件
// --------------------------------------------

const Awards = () => {
  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <PageTitle>得獎名單</PageTitle>
        <AwardsContent>
          <AwardCategory>
            <h2>地區獎項</h2>
            <ul>
              <li>
                <strong>金牌：</strong>
                {content.awards.regional.gold || "待確認"} 組
              </li>
              <li>
                <strong>銀牌：</strong>
                {content.awards.regional.silver || "待確認"} 組
              </li>
              <li>
                <strong>銅牌：</strong>
                {content.awards.regional.bronze || "待確認"} 組
              </li>
              <li>
                <strong>GenAI 特別獎：</strong>
                {content.awards.regional.genAI || "待確認"} 組
              </li>
              <li>
                <strong>佳作：</strong>
                {content.awards.regional.honorableMentions || "待確認"} 組
              </li>
            </ul>
          </AwardCategory>
          <AwardCategory>
            <h2>全球獎項</h2>
            <p>全球獎項資訊將另行公布於官網及 Email 通知各參賽隊伍。</p>
          </AwardCategory>
        </AwardsContent>
        <BackButton to="/">返回主頁</BackButton>
      </PageContainer>
    </>
  );
};

export default Awards;
