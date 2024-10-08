import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';

const SectionAnimation = React.memo(({ children }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
  
    const animation = useSpring({
      opacity: 1,  // 初始就設為可見
      transform: 'translateY(0px)',
      config: { tension: 120, friction: 14 },
    });
  
    return (
      <animated.div ref={ref} style={animation}>
        {children}
      </animated.div>
    );
  });

export default SectionAnimation;