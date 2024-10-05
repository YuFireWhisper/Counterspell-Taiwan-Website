import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import { Calendar, Users, Award, Briefcase, Mail, ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer'; // Install this package

import content from '../content';

// --------------------------------------------
// 1. Styled Components Definitions
// --------------------------------------------

// Global Styles
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    scroll-snap-type: y mandatory;
    overflow-y: scroll; /* Enabled vertical scrolling */
    height: 100%;
    scroll-behavior: smooth; /* Smooth scrolling */
  }
  html {
    height: 100%;
  }
`;

// Container for the Home Page
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
`;

// Parallax Background
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

// Hero Section with animated opacity
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
  z-index: -1;
  will-change: opacity, transform;
`;

// Animated Headings with dynamic transform
const AnimatedH1 = styled(animated.h1)`
  font-family: 'Audiowide', sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  will-change: opacity, transform;
`;

const AnimatedP = styled(animated.p)`
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 1.5rem;
  max-width: 600px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  will-change: opacity, transform;
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

// Content Wrapper holding all sections
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

// Placeholder to push content below Hero
const HeroPlaceholder = styled.div`
  height: 100vh;
  scroll-snap-align: start;
`;

// Generic Section styling with backdrop and animation
const Section = styled.section`
  margin-bottom: 100px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  will-change: background, transform;
  scroll-snap-align: start;
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

const ContactSection = styled(Section)`
  background: linear-gradient(45deg, #5f27cd, #48dbfb);
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
  max-width: 300px;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  justify-items: center;
  will-change: transform;
`;

const GoalItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 25px;
  border-radius: 15px;
  color: white;
  transition: transform 0.3s ease;
  max-width: 300px;
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

// Contact Form Styling with animations
const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  will-change: opacity, transform;

  input,
  textarea {
    padding: 15px;
    border: none;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1.1rem;
    width: 100%;
    max-width: 500px;
    will-change: background, transform;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
      background-color: rgba(255, 255, 255, 0.3);
      outline: none;
      transform: scale(1.02);
    }
  }
`;

const SubmitButton = styled.button`
  padding: 15px 30px;
  background-color: #feca57;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  will-change: transform;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #ffda57;
  }
`;

const FormStatus = styled.p`
  margin-top: 10px;
  color: #feca57;
  font-weight: bold;
`;

// Navigation Dots with tooltips and animations
const NavigationDots = ({ activeSection, sectionRefs }) => (
  <NavDotsContainer>
    {Object.keys(sectionRefs).map((section) => {
      const isActive = activeSection === section;
      return (
        <Tooltip key={section} data-tooltip={formatSectionName(section)}>
          <NavDotComponent
            isActive={isActive}
            onClick={() => {
              if (sectionRefs[section].current) {
                sectionRefs[section].current.scrollIntoView({ behavior: 'smooth' });
              }
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
    case 'contact':
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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [scrollY, setScrollY] = useState(0);

  const eventInfoRef = useRef(null);
  const aboutUsRef = useRef(null);
  const goalsRef = useRef(null);
  const participantInfoRef = useRef(null);
  const contactRef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      eventInfo: eventInfoRef,
      aboutUs: aboutUsRef,
      goals: goalsRef,
      participantInfo: participantInfoRef,
      contact: contactRef,
    }),
    [eventInfoRef, aboutUsRef, goalsRef, participantInfoRef, contactRef]
  );

  // 2. Setup Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Calculate Hero Opacity based on the first section's position
      if (eventInfoRef.current) {
        const rect = eventInfoRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Reversed opacity logic: opaque at top, transparent as you scroll down
        const opacity = Math.min(1, Math.max(0, rect.top / windowHeight));
        setHeroOpacity(opacity);
      }

      // Determine Active Section
      const scrollPosition = currentScrollY + window.innerHeight / 2;

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  // 3. Initialize react-spring for Hero opacity
  const heroSpring = useSpring({
    opacity: heroOpacity,
    config: config.slow,
  });

  // 4. Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 5. Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setFormStatus('Message Sent!');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 3000);
  };

  // 6. Early return after Hooks
  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        <ParallaxBackground />

        <AnimatedHero style={heroSpring}>
          <AnimatedH1
            style={{
              transform:
                scrollY < window.innerHeight
                  ? 'translateY(0)'
                  : 'translateY(-50px)',
            }}
          >
            {content.eventName || 'Hackathon 2024'}
          </AnimatedH1>
          <AnimatedP
            style={{
              transform:
                scrollY < window.innerHeight
                  ? 'translateY(0)'
                  : 'translateY(-50px)',
            }}
          >
            {content.eventDescription || 'Innovate. Create. Revolutionize.'}
          </AnimatedP>
          <ScrollIndicator
            onClick={() => {
              if (sectionRefs.eventInfo.current) {
                sectionRefs.eventInfo.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span>Scroll to explore</span>
            <ChevronDown size={24} />
          </ScrollIndicator>
        </AnimatedHero>

        <ContentWrapper>
          <HeroPlaceholder />

          {/* Event Info Section */}
          <EventInfoSection ref={sectionRefs.eventInfo} id="eventInfo">
            <SectionTitle>
              <Calendar /> Event Information
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
          <AboutUsSection ref={sectionRefs.aboutUs} id="aboutUs">
            <SectionTitle>
              <Users /> About Us
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
          <GoalsSection ref={sectionRefs.goals} id="goals">
            <SectionTitle>
              <Award /> Event Goals
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
          <ParticipantInfoSection ref={sectionRefs.participantInfo} id="participantInfo">
            <SectionTitle>
              <Briefcase /> Participant Information
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

          {/* Contact Section */}
          <ContactSection ref={sectionRefs.contact} id="contact">
            <SectionTitle>
              <Mail /> Contact Us
            </SectionTitle>
            <ContactForm onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <SubmitButton type="submit">Send</SubmitButton>
              {formStatus && <FormStatus>{formStatus}</FormStatus>}
            </ContactForm>
          </ContactSection>
        </ContentWrapper>

        <NavigationDots activeSection={activeSection} sectionRefs={sectionRefs} />
      </HomeContainer>
    </>
  );
};

// --------------------------------------------
// 4. Export the Home Component
// --------------------------------------------

export default Home;
