import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Mail } from 'lucide-react';
import content from './content';
import { animated } from '@react-spring/web';

// 帶有圖標的區塊標題
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

const RegistrationSection = styled.section`
  background: linear-gradient(45deg, #5f27cd, #48dbfb);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
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

const RegistrationContent = styled.div`
  max-width: 800px;
  margin-bottom: 30px;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
    transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
`;

const RegistrationButton = styled(animated.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform, background, box-shadow;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4);
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: transform 0.3s ease, opacity 0.3s ease;

  &:hover {
    transform: scale(1.08);
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.6);
  }

  &:active {
    transform: scale(1);
    box-shadow: 0 3px 10px rgba(255, 126, 95, 0.3);
  }
`;

// 自定義滾動觸發鉤子
const useScrollTrigger = (threshold = 0.5) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const handleScroll = () => {
    const element = elementRef.current;
    if (!element) return;

    const { top, bottom } = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (top <= windowHeight * threshold && bottom >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化檢測

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isVisible, elementRef };
};

const Registration = ({ sectionRefs, handleScrollTo }) => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 滾動到視口 70% 處觸發

  return (
    <RegistrationSection ref={elementRef}>
      <SectionTitle>
        <Mail /> 報名活動
      </SectionTitle>
      <RegistrationContent isVisible={isVisible}>
        <p>
          {content.participantInfo?.registrationProcess ||
            '報名流程資訊尚未更新。'}
        </p>
      </RegistrationContent>
      <RegistrationButton
        isVisible={isVisible}
        onClick={() => {
          if (content.registrationPath) {
            if (
              content.registrationPath.startsWith('#') &&
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
    </RegistrationSection>
  );
};

export default Registration;
