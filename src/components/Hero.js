// src/components/Hero.js

import React from "react";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";
import { useSpring, animated, config } from "@react-spring/web";

// Styled Components for Hero section
const AnimatedHero = styled(animated.div)`
  position: fixed; /* 改為相對定位，以便放置背景圖片或色塊 */
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #333333; /* 文字色改為深灰色 */
  z-index: 0;
  background: linear-gradient(135deg, #ff6f61, #ffc75f); /* 使用漸變背景 */
`;

// 標題
const AnimatedH1 = styled(animated.h1)`
  @font-face {
    font-family: "Audiowide";
    src: url("/fonts/Audiowide-Regular.ttf") format("truetype");
  }
  font-family: "Audiowide", sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); /* 文字陰影改為白色 */
  will-change: opacity;
  animation: fadeInDown 1s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 描述文字
const AnimatedP = styled(animated.p)`
  font-family: "Noto Sans TC", sans-serif;
  font-size: 1.5rem;
  max-width: 600px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); /* 文字陰影改為白色 */
  will-change: opacity;
  animation: fadeInUp 1s ease-out 0.5s forwards;
  color: #333333; /* 文字色改為深灰色 */

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 滑動指示器
const ScrollIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  cursor: pointer;

  span {
    margin-bottom: 10px;
    font-size: 1rem;
    color: #333333; /* 文字色改為深灰色 */
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(10px);
    }
    60% {
      transform: translateY(5px);
    }
  }

  svg {
    animation: bounceIcon 2s infinite;
    color: #333333; /* 圖標色改為深灰色 */
  }

  @keyframes bounceIcon {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(10px);
    }
    60% {
      transform: translateY(5px);
    }
  }
`;

const Hero = ({ heroSpring, handleScrollTo, timelineRef, content }) => {
  return (
    <AnimatedHero style={heroSpring}>
      <AnimatedH1>{content.eventName || "Counterspell Taiwan"}</AnimatedH1>
      <AnimatedP>
        {content.eventDescription || "全台第一場由青少年舉辦給青少年的黑客松"}
      </AnimatedP>
      <ScrollIndicator onClick={() => handleScrollTo(timelineRef)}>
        <span>滑動以探索</span>
        <ChevronDown size={24} />
      </ScrollIndicator>
    </AnimatedHero>
  );
};

export default Hero;
