import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { Calendar } from 'lucide-react';

// 時間軸區塊樣式
const TimelineSection = styled.section`
  background: linear-gradient(45deg, #feca57, #ff9ff3);
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
`;

// 時間軸內容樣式
const TimelineContent = styled.div`
  width: 100%;
  max-width: 1000px;
  position: relative;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    background: white;
    z-index: 0;
  }
`;

const TimelineItemWrapper = styled(motion.div)`
  position: relative;
  margin-bottom: 25px;
  width: 100%; /* 改為 100% */
  display: flex; /* 使用 flex 來排列 */
  justify-content: ${({ index }) => (index % 2 === 0 ? 'flex-start' : 'flex-end')}; /* 奇數項靠左，偶數項靠右 */
  padding: 0 40px;
  box-sizing: border-box;

  /* 調整圓點的位置，保證它在中線 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%; /* 圓點位於中線 */
    transform: translate(-50%, -50%); /* 確保圓點居中 */
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    z-index: 1;
  }
`;

// 時間軸項目內容樣式
const TimelineItemContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 45%;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: white;
  }

  p {
    font-size: 1.1rem;
    color: white;
  }

  time {
    display: block;
    font-size: 1rem;
    color: #feca57;
    margin-bottom: 10px;
    font-weight: bold;
  }
`;

// 區塊標題樣式
const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TimelineItem = ({ date, event, description, index, inView }) => {
    const controls = useAnimation();
    const itemRef = useRef(null);
  
    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);
  
    // 定義動畫變體
    const variants = {
      hidden: { 
        opacity: 0, 
        x: index % 2 === 0 ? -50 : 50  // 根據索引決定動畫方向
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration: 0.5, 
          ease: "easeOut" 
        } 
      }
    };
  
    const contentVariants = {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1,
        transition: { 
          delay: 0.2,
          duration: 0.3,
          ease: "easeOut"
        }
      }
    };
  
    return (
      <TimelineItemWrapper
        ref={itemRef}
        variants={variants}
        initial="hidden"
        animate={controls}
        index={index} // 傳遞 index 以便控制位置
      >
        <TimelineItemContent variants={contentVariants}>
          <time>{date}</time>
          <h3>{event}</h3>
          <p>{description}</p>
        </TimelineItemContent>
      </TimelineItemWrapper>
    );
};

// 主要時間軸組件
const Timeline = ({ items }) => {
  const [inViewItems, setInViewItems] = useState([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    // 創建IntersectionObserver來監視項目的可見性
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'));
            setInViewItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.5 }
    );

    // 觀察所有時間軸項目
    const itemElements = timelineRef.current.querySelectorAll('.timeline-item');
    itemElements.forEach((item) => observer.observe(item));

    // 清理函數
    return () => observer.disconnect();
  }, []);

  return (
    <TimelineSection>
      <SectionTitle>
        <Calendar /> 活動時程
      </SectionTitle>
      <TimelineContent ref={timelineRef}>
        {items.map((item, index) => (
          <div key={index} className="timeline-item" data-index={index}>
            <TimelineItem {...item} index={index} inView={inViewItems.includes(index)} />
          </div>
        ))}
      </TimelineContent>
    </TimelineSection>
  );
};

export default Timeline;