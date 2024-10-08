import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { Calendar } from 'lucide-react';

// 時間軸區塊樣式
const TimelineSection = styled.section`
  background: linear-gradient(45deg, #feca57, #ff9ff3);
  max-height: 650px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  justify-content: center;
  border-radius: 20px;
  margin: 0 auto;
  margin-bottom: 30px;
`;

// 時間軸內容樣式
const TimelineContent = styled.div`
  width: 100%;
  max-width: 1000px;
  position: relative;
  margin: 0 auto;
  transform: scale(0.8);
  transform-origin: top center; /* 設定縮放的原點 */

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    background: white;
    z-index: 0;
    transform: translateX(-50%);
  }
`;

// 每個時間軸項目的外層容器
const TimelineItemWrapper = styled(motion.div)`
  position: relative;
  width: 50%;
  padding: 5px 10px; /* 減少 padding 來縮小項目距離 */
  box-sizing: border-box;
  margin-top: 5px; /* 調整為 10px 來縮小項目之間的間距 */

  /* 控制左右側的位置 */
  ${({ index }) => (index % 2 === 0 ? 'left: 0;' : 'left: 50%;')} /* 奇數左側，偶數右側 */
  
  /* 不需要transform來移動內容 */
  
  /* 使用圓點來標記時間軸 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${({ index }) => (index % 2 === 0 ? '100%' : '0')}; /* 左側圓點靠右，右側圓點回到左側 */
    transform: translateX(-50%) translateY(-50%); /* 調整圓點到中線位置 */
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
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* 控制每個項目的最大寬度 */

  h3 {
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: white;
  }

  p {
    font-size: 1rem;
    color: white;
  }

  time {
    display: block;
    font-size: 0.9rem;
    color: #feca57;
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

// 區塊標題樣式
const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
  margin-top: 60px;
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
            index={index}
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

        const itemElements = timelineRef.current.querySelectorAll('.timeline-item');
        itemElements.forEach((item) => observer.observe(item));

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
