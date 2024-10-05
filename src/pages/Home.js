import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import { Calendar, Users, Award, Briefcase, Mail, ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { useInView } from 'react-intersection-observer'; // Ensure this package is installed
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

import content from '../content';

// --------------------------------------------
// 1. Styled Components Definitions
// --------------------------------------------

// Global Styles
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Audiowide';
    src: url('/fonts/Audiowide-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    overflow: hidden; /* Prevent default scrolling */
    height: 100%;
    font-family: 'Noto Sans TC', sans-serif;
  }
  html {
    height: 100%;
  }
`;

// Parallax Background (Fixed, below Hero)
const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  z-index: -2;
  will-change: background;
`;

// Hero Section with animated opacity (Fixed, above Background)
const AnimatedHero = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  z-index: 0; /* Positioned above background but below content */
  will-change: opacity;
`;

// Animated Headings
const AnimatedH1 = styled(animated.h1)`
  font-family: 'Audiowide', sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  will-change: opacity;
`;

const AnimatedP = styled(animated.p)`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 1.5rem;
  max-width: 600px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  will-change: opacity;
`;

// Scroll Indicator with bounce animation
const ScrollIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  cursor: pointer;

  span {
    margin-bottom: 10px;
    font-size: 1rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
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

// Container for the Home Page with Locomotive Scroll
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden; /* Locomotive Scroll handles scrolling */
  z-index: 1; /* Positioned above Hero */
`;

// Content Wrapper holding all sections
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  position: relative; /* To ensure z-index works */
  z-index: 1; /* Positioned above Hero */
`;

// Placeholder to push content below Hero
const HeroPlaceholder = styled.div`
  height: 100vh;
`;

// Generic Section styling with backdrop and animation
const Section = styled.section`
  margin-bottom: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  will-change: background, transform;
`;

// Section Title with icon
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

// Specific Sections with unique backgrounds
const EventInfoSection = styled(Section)`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
`;

const AboutUsSection = styled(Section)`
  background: linear-gradient(45deg, #54a0ff, #5f27cd);
`;

const GoalsSection = styled(Section)`
  background: linear-gradient(45deg, #ff9ff3, #feca57);
`;

const ParticipantInfoSection = styled(Section)`
  background: linear-gradient(45deg, #48dbfb, #ff6b6b);
`;

// Updated Registration Section (now Registration Section)
const RegistrationSection = styled(Section)`
  background: linear-gradient(45deg, #5f27cd, #48dbfb);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

// Q&A Section
const QASection = styled(Section)`
  background: linear-gradient(45deg, #20bf6b, #0fb9b1);
`;

const QAContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

// Contact Information Section
const ContactInfoSection = styled(Section)`
  background: linear-gradient(45deg, #f8a5c2, #f7d794);
`;

const ContactInfoContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: opacity, transform;
  gap: 15px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
`;

// Content Containers with animations
const EventInfoContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  will-change: transform;
`;

const InfoItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 10px;
  flex: 1 1 200px;
  font-size: 1.1rem;
  color: white;
  will-change: opacity, transform;
  transition: transform 0.3s ease;

  strong {
    display: block;
    margin-bottom: 5px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const AboutUsContent = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  will-change: opacity, transform;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
    max-width: 800px;
    text-align: center;
  }
`;

const GoalsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 5px;
  justify-items: center;
  will-change: transform;
`;

const GoalItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 15px;
  color: white;
  transition: transform 0.3s ease;
  will-change: transform, opacity;

  &:hover {
    transform: scale(1.05);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.5;
    text-align: center;
  }
`;

const ParticipantInfoContent = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: opacity, transform;

  h3 {
    font-size: 1.8rem;
    margin-top: 30px;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 20px;
    max-width: 800px;
    text-align: center;
  }
`;

const RequiredItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform;

  li {
    font-size: 1.1rem;
    margin-bottom: 10px;
    padding-left: 25px;
    position: relative;
    will-change: opacity, transform;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #feca57;
    }

    &:hover {
      color: #feca57;
      transform: translateX(5px);
      transition: transform 0.3s ease, color 0.3s ease;
    }
  }
`;

const RegistrationButton = styled(animated.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b); /* Gradient from soft orange to peach */
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform, background, box-shadow;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4); /* Softer shadow */

  &:hover {
    transform: scale(1.08); /* More dramatic scale for hover */
    background: linear-gradient(135deg, #feb47b, #ff7e5f); /* Reverse gradient on hover */
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.6); /* Larger shadow on hover */
  }

  &:active {
    transform: scale(1); /* Reset scale on click */
    box-shadow: 0 3px 10px rgba(255, 126, 95, 0.3); /* Lighter shadow on click */
  }
`;

// Navigation Dots with tooltips and animations
const NavigationDots = ({ activeSection, sectionRefs, handleScrollTo }) => (
  <NavDotsContainer>
    {Object.keys(sectionRefs).map((section) => {
      const isActive = activeSection === section;
      return (
        <Tooltip key={section} data-tooltip={formatSectionName(section)}>
          <NavDotComponent
            isActive={isActive}
            onClick={() => {
              handleScrollTo(sectionRefs[section]);
            }}
          />
        </Tooltip>
      );
    })}
  </NavDotsContainer>
);

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

const formatSectionName = (section) => {
  switch (section) {
    case 'eventInfo':
      return 'Event Information';
    case 'aboutUs':
      return 'About Us';
    case 'goals':
      return 'Goals';
    case 'participantInfo':
      return 'Participant Info';
    case 'registration':
      return 'Register';
    case 'qa':
      return 'Q&A';
    case 'contactInfo':
      return 'Contact';
    default:
      return section;
  }
};

const NavDotsContainer = styled.div`
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

const NavDotComponent = React.memo(({ isActive, onClick }) => {
  const springProps = useSpring({
    transform: isActive ? 'scale(1.5)' : 'scale(1)',
    opacity: isActive ? 1 : 0.7,
    config: config.wobbly,
  });

  return <AnimatedNavDot style={springProps} isActive={isActive} onClick={onClick} />;
});

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

// Animated Styled Components for Sections
const AnimatedDivStyled = styled(animated.div)`
  will-change: opacity, transform;
`;

const AnimatedLiStyled = styled(animated.li)`
  will-change: opacity, transform;
`;

// --------------------------------------------
// 2. SectionAnimation Component for Damping
// --------------------------------------------


const SectionAnimation = ({ children }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
  
    const animation = useSpring({
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0px)' : 'translateY(50px)',
      config: { tension: 120, friction: 14 }, // Damping effect
    });
  
    return (
      <animated.div ref={ref} style={animation}>
        {children}
      </animated.div>
    );
};

// --------------------------------------------
// 3. Home Component Definition
// --------------------------------------------

const Home = () => {
    // 1. Define all Hooks at the top level
    const [activeSection, setActiveSection] = useState(null);
    const [heroOpacity, setHeroOpacity] = useState(1);
    const [activeQAIndices, setActiveQAIndices] = useState({}); // New Hook
  
    // Refs
    const scrollContainerRef = useRef(null);
    const locoScroll = useRef(null);
    const eventInfoRef = useRef(null);
    const aboutUsRef = useRef(null);
    const goalsRef = useRef(null);
    const participantInfoRef = useRef(null);
    const registrationRef = useRef(null);
    const qaRef = useRef(null);
    const contactInfoRef = useRef(null);
  
    // Memoized Section References
    const sectionRefs = useMemo(
      () => ({
        eventInfo: eventInfoRef,
        aboutUs: aboutUsRef,
        goals: goalsRef,
        participantInfo: participantInfoRef,
        registration: registrationRef,
        qa: qaRef,
        contactInfo: contactInfoRef,
      }),
      [eventInfoRef, aboutUsRef, goalsRef, participantInfoRef, registrationRef, qaRef, contactInfoRef]
    );
  
    // 2. Initialize Locomotive Scroll
    useEffect(() => {
      if (scrollContainerRef.current) {
        locoScroll.current = new LocomotiveScroll({
          el: scrollContainerRef.current,
          smooth: true,
        });
  
        locoScroll.current.on('scroll', (obj) => {
          // Calculate Hero Opacity based on scrollY
          const scrollY = obj.scroll.y;
          const windowHeight = window.innerHeight;
          const opacity = 1 - Math.min(scrollY / windowHeight, 1);
          setHeroOpacity(opacity);
  
          // Determine Active Section
          const scrollPosition = scrollY + windowHeight / 2;
  
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
        });
      }
  
      return () => {
        if (locoScroll.current) {
          locoScroll.current.destroy();
        }
      };
    }, [sectionRefs]);
  
    // 3. Setup a function to handle smooth scrolling using Locomotive Scroll
    const handleScrollTo = (ref) => {
      if (locoScroll.current && ref.current) {
        locoScroll.current.scrollTo(ref.current);
      }
    };
  
    // 4. Initialize react-spring for Hero opacity
    const heroSpring = useSpring({
      opacity: heroOpacity,
      config: {
        tension: 180,
        friction: 20,
      },
    });
  
    // 5. Early return after Hooks
    if (!content) {
      return <div>Loading...</div>;
    }
  
    // 6. Toggle Q&A Items
    const toggleQA = (index) => {
      setActiveQAIndices((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };
  
    return (
      <>
        <GlobalStyle />
        {/* Fixed Elements Outside Scroll Container */}
        <ParallaxBackground />
        <AnimatedHero style={heroSpring}>
          <AnimatedH1>
            {content.eventName || 'Hackathon 2024'}
          </AnimatedH1>
          <AnimatedP>
            {content.eventDescription || 'Innovate. Create. Revolutionize.'}
          </AnimatedP>
          <ScrollIndicator onClick={() => handleScrollTo(sectionRefs.eventInfo)}>
            <span>Scroll to explore</span>
            <ChevronDown size={24} />
          </ScrollIndicator>
        </AnimatedHero>
  
        {/* Scroll Container */}
        <HomeContainer ref={scrollContainerRef} data-scroll-container>
          <ContentWrapper>
            <HeroPlaceholder />
  
            {/* Event Info Section */}
            <EventInfoSection ref={sectionRefs.eventInfo} id="eventInfo" data-scroll-section>
              <SectionTitle>
                <Calendar /> 活動資訊
              </SectionTitle>
              <EventInfoContent>
                {Object.entries(content.eventDetails || {}).map(([key, value], index) => (
                  <SectionAnimation key={key}>
                    <InfoItem>
                      <strong>{key}:</strong> {value}
                    </InfoItem>
                  </SectionAnimation>
                ))}
              </EventInfoContent>
            </EventInfoSection>
  
            {/* About Us Section */}
            <AboutUsSection ref={sectionRefs.aboutUs} id="aboutUs" data-scroll-section>
              <SectionTitle>
                <Users /> 關於我們
              </SectionTitle>
              <AboutUsContent>
                <SectionAnimation>
                  <AnimatedP>
                    {content.aboutUs ||
                      'We are a team of innovators passionate about technology and its potential to change the world.'}
                  </AnimatedP>
                </SectionAnimation>
              </AboutUsContent>
            </AboutUsSection>
  
            {/* Goals Section */}
            <GoalsSection ref={sectionRefs.goals} id="goals" data-scroll-section>
              <SectionTitle>
                <Award /> 活動目標
              </SectionTitle>
              <GoalsContent>
                {(content.goals || []).map((goal, index) => (
                  <SectionAnimation key={index}>
                    <GoalItem>
                      <h3>{goal.title}</h3>
                      <p>{goal.description}</p>
                    </GoalItem>
                  </SectionAnimation>
                ))}
              </GoalsContent>
            </GoalsSection>
  
            {/* Participant Info Section */}
            <ParticipantInfoSection ref={sectionRefs.participantInfo} id="participantInfo" data-scroll-section>
              <SectionTitle>
                <Briefcase /> 參與者須知
              </SectionTitle>
              <ParticipantInfoContent>
                <SectionAnimation>
                  <h3>Registration Process</h3>
                  <p>{content.registrationProcess}</p>
                </SectionAnimation>
                <SectionAnimation>
                  <h3>Required Items</h3>
                  <RequiredItemsList>
                    {(content.requiredItems || []).map((item, index) => (
                      <AnimatedLiStyled key={index}>
                        {item}
                      </AnimatedLiStyled>
                    ))}
                  </RequiredItemsList>
                </SectionAnimation>
              </ParticipantInfoContent>
            </ParticipantInfoSection>
  
            {/* Registration Section */}
            <RegistrationSection ref={sectionRefs.registration} id="registration" data-scroll-section>
              <SectionTitle>
                <Mail /> 報名活動
              </SectionTitle>
              <SectionAnimation>
                <RegistrationButton
                  onClick={() => {
                    if (content.registrationPath) {
                      // Use locomotive-scroll's scrollTo if registrationPath is an anchor on the page
                      // Otherwise, navigate directly
                      if (content.registrationPath.startsWith('#') && sectionRefs.registration.current) {
                        handleScrollTo(sectionRefs.registration);
                      } else {
                        window.location.href = content.registrationPath;
                      }
                    }
                  }}
                >
                  開啟報名表單
                </RegistrationButton>
              </SectionAnimation>
            </RegistrationSection>
  
            {/* Q&A Section */}
            <QASection ref={sectionRefs.qa} id="qa" data-scroll-section>
              <SectionTitle>
                <HelpCircle /> 常見問答
              </SectionTitle>
              <QAContent>
                {(content.qa || []).map((qaItem, index) => (
                  <SectionAnimation key={index}>
                    <div>
                      <Question
                        className={activeQAIndices[index] ? 'active' : ''}
                        onClick={() => toggleQA(index)}
                      >
                        {qaItem.question}
                      </Question>
                      {activeQAIndices[index] && <Answer>{qaItem.answer}</Answer>}
                    </div>
                  </SectionAnimation>
                ))}
              </QAContent>
            </QASection>
  
            {/* Contact Information Section */}
            <ContactInfoSection ref={sectionRefs.contactInfo} id="contactInfo" data-scroll-section>
              <SectionTitle>
                <Phone /> 聯絡資訊
              </SectionTitle>
              <ContactInfoContent>
                <SectionAnimation>
                  <ContactItem>
                    <Mail size={24} /> <a href={`mailto:${content.contactInfo.email}`} style={{ color: 'white', textDecoration: 'none' }}>{content.contactInfo.email}</a>
                  </ContactItem>
                </SectionAnimation>
                <SectionAnimation>
                  <ContactItem>
                    <Phone size={24} /> <a href={`https://instagram.com/${content.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>@{content.contactInfo.instagram}</a>
                  </ContactItem>
                </SectionAnimation>
              </ContactInfoContent>
            </ContactInfoSection>
          </ContentWrapper>
  
          {/* Navigation Dots */}
          <NavigationDots activeSection={activeSection} sectionRefs={sectionRefs} handleScrollTo={handleScrollTo} />
        </HomeContainer>
      </>
    );
  };

// --------------------------------------------
// 4. Export the Home Component
// --------------------------------------------

export default Home;
