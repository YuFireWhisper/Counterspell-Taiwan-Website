// /components/NavigationDots.js

import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// 導航圓點容器
const NavDotsContainerWrapper = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
  will-change: transform;
`;

// 導航圓點的提示工具
const Tooltip = styled.div`
  position: relative;
  display: inline-block;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    right: 120%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    white-space: nowrap;
    font-size: 0.9rem;
    opacity: 1;
    transition: opacity 0.3s;
  }

  &::after {
    content: '';
    opacity: 0;
    transition: opacity 0.3s;
  }
`;

// 動畫導航圓點
const AnimatedNavDot = styled(animated.div)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? '#feca57' : 'white')};
  cursor: pointer;
  will-change: transform, background-color, opacity;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #feca57;
    transform: scale(1.2);
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
`;

// React.memo 用於導航圓點組件，避免不必要的重新渲染
const NavDotComponent = React.memo(({ isActive, onClick, tooltip }) => {
  const springProps = useSpring({
    transform: isActive ? 'scale(1.5)' : 'scale(1)',
    opacity: isActive ? 1 : 0.7,
    config: config.wobbly,
  });

  return (
    <Tooltip data-tooltip={tooltip}>
      <AnimatedNavDot style={springProps} isActive={isActive} onClick={onClick} />
    </Tooltip>
  );
});

const NavDots = ({ activeSection, sections, handleScrollTo }) => (
    <NavDotsContainerWrapper>
      {sections.map(({ id, name, ref }) => {
        const isActive = activeSection === id;
        return (
          <NavDotComponent
            key={id}
            isActive={isActive}
            onClick={() => {
              handleScrollTo(ref);
            }}
            tooltip={name}
          />
        );
      })}
    </NavDotsContainerWrapper>
  );

export default NavDots;
