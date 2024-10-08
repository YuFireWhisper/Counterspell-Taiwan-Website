import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { HelpCircle } from 'lucide-react';
import content from './content';

const QASectionStyled = styled.section`
  background: linear-gradient(45deg, #20bf6b, #0fb9b1);
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

const QAContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  will-change: opacity, transform;
`;

const Question = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  padding-right: 20px;

  &:after {
    content: '+';
    position: absolute;
    right: 0;
    top: 0;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  &.active:after {
    transform: rotate(45deg);
  }
`;

const Answer = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: 20px;
`;

const QAItem = styled.div`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'translateY(0)' : 'translateY(50px)')};
  transition: transform 0.3s ease, opacity 0.3s ease;
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

const QASection = () => {
  const { isVisible, elementRef } = useScrollTrigger(0.7); // 滾動到視口 70% 處觸發
  const [activeQAIndices, setActiveQAIndices] = useState({});

  const toggleQA = (index) => {
    setActiveQAIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <QASectionStyled ref={elementRef}>
      <SectionTitle>
        <HelpCircle /> 常見問答
      </SectionTitle>
      <QAContent>
        {(content.qa || []).map((qaItem, index) => (
          <QAItem key={index} isVisible={isVisible}>
            <div>
              <Question
                className={activeQAIndices[index] ? 'active' : ''}
                onClick={() => toggleQA(index)}
              >
                {qaItem.question}
              </Question>
              {activeQAIndices[index] && <Answer>{qaItem.answer}</Answer>}
            </div>
          </QAItem>
        ))}
      </QAContent>
    </QASectionStyled>
  );
};

export default QASection;
