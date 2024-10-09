// src/pages/Workshops.js

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
  background: linear-gradient(135deg, #f8a5c2, #f7d794);
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

// 工作坊內容區塊
const WorkshopContent = styled.div`
  max-width: 1000px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

// 單個工作坊項目
const WorkshopItem = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  ul {
    list-style-type: disc;
    margin-left: 20px;
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
// 1. Workshops 組件
// --------------------------------------------

const Workshops = () => {
  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <PageTitle>工作坊</PageTitle>
        <WorkshopContent>
          <WorkshopItem>
            <h2>{content.workshopDetails.title || "遊戲開發入門"}</h2>
            <p>
              {content.workshopDetails.description ||
                "參加我們的遊戲開發入門工作坊，學習如何利用現代化工具快速創建遊戲原型，結合生成式AI進行創意發想，並掌握精緻化設計的技巧。"}
            </p>
            <ul>
              <li>
                <strong>地點：</strong>
                {content.workshopDetails.location || "待確認"}
              </li>
              <li>
                <strong>時間：</strong>
                {content.workshopDetails.time || "待確認"}
              </li>
              <li>
                <strong>導師：</strong>
                {content.workshopDetails.instructors || "待確認"}
              </li>
              <li>
                <strong>費用：</strong>
                {content.workshopDetails.fee || "全額免費"}
              </li>
              <li>
                <strong>報名方式：</strong>
                {content.workshopDetails.registration ||
                  "報名 Counterspell Taiwan 即可免費參加"}
              </li>
              <li>
                <strong>需攜帶物品：</strong>
                {content.workshopDetails.requiredItems || "待確認"}
              </li>
            </ul>
          </WorkshopItem>
          {/* 如有多個工作坊，可重複上面的 WorkshopItem */}
        </WorkshopContent>
        <BackButton to="/">返回主頁</BackButton>
      </PageContainer>
    </>
  );
};

export default Workshops;
