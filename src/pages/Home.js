import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { Calendar, Users, Award, Briefcase, Mail, ChevronDown } from 'lucide-react';

import content from '../content';

const Home = () => {
  const [activeSection, setActiveSection] = useState(null);

  const containerRef = useRef(null);
  const ghostRef = useRef(null);
  const scrollRef = useRef(null);

  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, windowHeight], [1, 0]);
  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const skewVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30
  });

  const skew = useTransform(skewVelocity, [-1000, 1000], [-15, 15]);

  const scaleX = useSpring(1, physics);

  useAnimationFrame((t, delta) => {
    const moveBy = delta * smoothVelocity.get() * 0.01;
    const yDelta = scrollY.get() - scrollRef.current;
    const maxY = document.body.clientHeight - windowHeight;

    let newScrollY = scrollRef.current + moveBy;
    newScrollY = Math.max(0, Math.min(newScrollY, maxY));

    scrollRef.current = newScrollY;

    if (containerRef.current) {
      containerRef.current.scrollTop = newScrollY;
    }

    const skewDelta = yDelta - moveBy;
    const clampedSkewDelta = Math.max(-20, Math.min(20, skewDelta));

    scaleX.set(1 + Math.abs(clampedSkewDelta) * 0.002);
  });

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionRefs = {
    eventInfo: useRef(null),
    aboutUs: useRef(null),
    goals: useRef(null),
    participantInfo: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = containerRef.current.scrollTop + window.innerHeight / 2;

      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (
          ref.current &&
          ref.current.offsetTop <= scrollPosition &&
          ref.current.offsetTop + ref.current.offsetHeight > scrollPosition
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    containerRef.current.addEventListener('scroll', handleScroll);
    return () => containerRef.current.removeEventListener('scroll', handleScroll);
  }, []);

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <HomeContainer ref={containerRef}>
      <ParallaxBackground />
      <ScrollContainer ref={ghostRef}>
        <Hero style={{ opacity: spring }}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {content.eventName || 'Hackathon 2024'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {content.eventDescription || 'Innovate. Create. Revolutionize.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <ScrollIndicator
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <span>Scroll to explore</span>
              <ChevronDown size={24} />
            </ScrollIndicator>
          </motion.div>
        </Hero>

        <ContentWrapper style={{ skew, scaleX }}>
          <EventInfoSection ref={sectionRefs.eventInfo} id="eventInfo">
            <SectionTitle>
              <Calendar /> Event Information
            </SectionTitle>
            <EventInfoContent>
              {Object.entries(content.eventDetails || {}).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <InfoItem>
                    <strong>{key}:</strong> {value}
                  </InfoItem>
                </motion.div>
              ))}
            </EventInfoContent>
          </EventInfoSection>

          <AboutUsSection ref={sectionRefs.aboutUs} id="aboutUs">
            <SectionTitle>
              <Users /> About Us
            </SectionTitle>
            <AboutUsContent>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {content.aboutUs || 'We are a team of innovators passionate about technology and its potential to change the world.'}
              </motion.p>
              
            </AboutUsContent>
          </AboutUsSection>

          <GoalsSection ref={sectionRefs.goals} id="goals">
            <SectionTitle>
              <Award /> Event Goals
            </SectionTitle>
            <GoalsContent>
              {(content.goals || []).map((goal, index) => (
                <GoalItem
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3>{goal.title}</h3>
                  <p>{goal.description}</p>
                </GoalItem>
              ))}
            </GoalsContent>
          </GoalsSection>

          <ParticipantInfoSection ref={sectionRefs.participantInfo} id="participantInfo">
            <SectionTitle>
              <Briefcase /> Participant Information
            </SectionTitle>
            <ParticipantInfoContent>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3>Registration Process</h3>
                <p>{content.registrationProcess}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3>Required Items</h3>
                <RequiredItemsList>
                  {(content.requiredItems || []).map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </RequiredItemsList>
              </motion.div>
            </ParticipantInfoContent>
          </ParticipantInfoSection>

          <ContactSection ref={sectionRefs.contact} id="contact">
            <SectionTitle>
              <Mail /> Contact Us
            </SectionTitle>
            <ContactForm
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Message" rows={5}></textarea>
              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </SubmitButton>
            </ContactForm>
          </ContactSection>
        </ContentWrapper>
      </ScrollContainer>

      <ProgressIndicator style={{ scaleX: spring }} />
      <NavigationDots activeSection={activeSection} sectionRefs={sectionRefs} containerRef={containerRef} />
    </HomeContainer>
  );
};

// Styled components
const HomeContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  perspective: 10px;
  perspective-origin: 50% 50%;
`;

const ScrollContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: visible;
  overflow-x: hidden;
`;

const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  z-index: -1;
`;

const Hero = styled(motion.div)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;

  h1 {
    font-family: 'Audiowide', sans-serif;
    font-size: 4rem;
    margin-bottom: 20px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  p {
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 1.5rem;
    max-width: 600px;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`;

const ScrollIndicator = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  cursor: pointer;

  span {
    margin-bottom: 10px;
  }
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  transform-origin: 50% 0;
`;

const Section = styled.section`
  margin-bottom: 100px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
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

  svg {
    flex-shrink: 0;
  }
`;

// Event Info Section
const EventInfoSection = styled(Section)`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
`;

const EventInfoContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const InfoItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 10px;
  flex: 1 1 200px;
  font-size: 1.1rem;
  color: white;

  strong {
    display: block;
    margin-bottom: 5px;
  }
`;

// About Us Section
const AboutUsSection = styled(Section)`
  background: linear-gradient(45deg, #54a0ff, #5f27cd);
`;

const AboutUsContent = styled.div`
  color: white;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
`;

const TeamMember = styled(motion.div)`
  perspective: 1000px;
  cursor: pointer;
`;

const TeamMemberFront = styled.div`
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 15px;
    border: 3px solid white;
  }

  h3 {
    margin-bottom: 5px;
    font-size: 1.2rem;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const TeamMemberBack = styled.div`
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  transform: rotateY(180deg);

  p {
    font-size: 1rem;
    text-align: center;
  }
`;

// Goals Section
const GoalsSection = styled(Section)`
  background: linear-gradient(45deg, #ff9ff3, #feca57);
`;

const GoalsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const GoalItem = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 25px;
  border-radius: 15px;
  color: white;
  transition: transform 0.3s ease;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

// Participant Info Section
const ParticipantInfoSection = styled(Section)`
  background: linear-gradient(45deg, #48dbfb, #ff6b6b);
`;

const ParticipantInfoContent = styled.div`
  color: white;

  h3 {
    font-size: 1.8rem;
    margin-top: 30px;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`;

const RequiredItemsList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    font-size: 1.1rem;
    margin-bottom: 10px;
    padding-left: 25px;
    position: relative;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #feca57;
    }
  }
`;

// Contact Section
const ContactSection = styled(Section)`
  background: linear-gradient(45deg, #5f27cd, #48dbfb);
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  input,
  textarea {
    padding: 15px;
    border: none;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1.1rem;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 15px 30px;
  background-color: #feca57;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
`;

const ProgressIndicator = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: #feca57;
  transform-origin: 0%;
  z-index: 1000;
`;

const NavigationDots = ({ activeSection, sectionRefs, containerRef }) => (
  <NavDots>
    {Object.keys(sectionRefs).map((section) => (
      <NavDot
        key={section}
        $active={activeSection === section}
        onClick={() => {
          sectionRefs[section].current.scrollIntoView({ behavior: 'smooth' });
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />
    ))}
  </NavDots>
);

const NavDots = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
`;

const NavDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? '#feca57' : 'white')};
  cursor: pointer;
`;

export default Home;