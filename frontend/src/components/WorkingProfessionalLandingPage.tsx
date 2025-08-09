'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Play,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Briefcase,
  Star,
  Building,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import WorkingProfessionalRegistrationModal from './WorkingProfessionalRegistrationModal';
import SignInModal from './SignInModal';
import Logo from './Logo';
import { useAuth } from '@/lib/useAuth';

export default function WorkingProfessionalLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);
  const isInView = useInView(videoRef, { once: false, amount: 0.3 });

  const {
    user,
    showSignInModal,
    setShowSignInModal,
    setPendingNavigation,
    handleSignInError
  } = useAuth();

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    // After successful sign-in, show the registration modal
    setIsModalOpen(true);
  };

  // Monitor user state changes and show registration modal when user becomes authenticated
  useEffect(() => {
    if (user && showSignInModal) {
      // User just signed in, close sign-in modal and show registration modal
      setShowSignInModal(false);
      setIsModalOpen(true);
    }
  }, [user, showSignInModal]);

  const handleRegisterClick = () => {
    if (user) {
      // User is authenticated, open the registration modal
      setIsModalOpen(true);
    } else {
      // User is not authenticated, show sign-in modal
      setShowSignInModal(true);
    }
  };

  const stats = [
    { number: '76%', label: 'of professionals want to explore a side hustle or startup project without leaving their job' },
    { number: '6-12', label: 'months is all it takes for advisory or project-based gigs to turn into equity or co-founder roles' },
    { number: '45%', label: 'faster growth: portfolio careers that mix full-time jobs with startup work are outpacing traditional roles' }
  ];

  const features = [
    {
      title: 'Side Hustles & Paid Projects',
      description: 'Work on real startup campaigns, tech builds, or growth projects on your own schedule.',
      // icon: TrendingUp
    },
    {
      title: 'Advisory & Mentorship Roles',
      description: 'Guide founders in your domain - marketing, product, finance, or operations - and earn recognition or equity.',
      // icon: Users
    },
    {
      title: 'Co-founder & Startup Matches',
      description: 'Join founders looking for experienced partners without leaving your day job.',
      // icon: BookOpen
    },
    {
      title: 'Weekend & Freelance Gigs',
      description: 'Flexible engagements that build your portfolio, income, and network, without a career risk.',
      // icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            
            {/* Left side - Logo */}
            <div className="flex items-center md:ml-4 ml-4">
              <img 
                src="/final_logo.svg" 
                alt="CoFounder Circle" 
                className="h-14 md:h-14"
                style={{ width: 'auto' }}
              />
            </div>
            
            {/* Right side - CTA Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={handleRegisterClick}
                className="font-medium transition-all duration-300 px-6 py-2 md:px-8 md:py-3"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  lineHeight: '100%',
                  letterSpacing: '3%',
                  textAlign: 'center',
                  background: 'linear-gradient(91.36deg, #3CE5A7 1.48%, #114DFF 98.84%)',
                  color: 'white',
                  borderRadius: '50px',
                  minWidth: '120px',
                  maxWidth: '276px'
                }}
              >
                REGISTER NOW
              </button>
            </div>
            
            {/* Mobile - Logo and Register Button */}
            <div className="md:hidden flex items-center justify-between w-full">
              <div className="flex-1 flex justify-center">
                <Logo size="sm" />
              </div>
              <button
                onClick={handleRegisterClick}
                className="font-medium transition-all duration-300 px-4 py-2"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '3%',
                  textAlign: 'center',
                  background: 'linear-gradient(91.36deg, #3CE5A7 1.48%, #114DFF 98.84%)',
                  color: 'white',
                  borderRadius: '50px',
                  minWidth: '100px'
                }}
              >
                REGISTER NOW
              </button>
            </div>
          </div>
          

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-16 md:pt-20">
        {/* Optimized Background - Replaced large image with gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-teal-900 via-blue-800 to-indigo-900"
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 
              className="font-black leading-none tracking-normal text-center"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontSize: 'clamp(28px, 8vw, 72px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                textAlign: 'center',
                maxWidth: '90vw',
                margin: '0 auto'
              }}
            >
              Turn Your Experience into Equity, Mentorship, and Growth.
              <br />
            </h1>
            <p 
              className="mb-8 max-w-3xl mx-auto mt-6"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(18px, 4vw, 24px)',
                lineHeight: '1.2',
                letterSpacing: '0%',
                textAlign: 'center'
              }}
            >
              Join the Startup Revolution.
            </p>
            
            {/* Container for the button with white background */}
            <div className="relative inline-block">
              {/* White background box */}
              <div
                className="w-48 md:w-64 lg:w-72 h-12 md:h-14"
                style={{
                  borderRadius: '50px',
                  background: '#FFFFFF',
                  position: 'relative'
                }}
              />
              
              {/* Text button positioned on top */}
                              <button
                  onClick={handleRegisterClick}
                  className="absolute font-medium transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  lineHeight: '100%',
                  letterSpacing: '3%',
                  textAlign: 'center',
                  background: 'transparent',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: 'linear-gradient(91.36deg, #3CE5A7 1.48%, #114DFF 98.84%)',
                  whiteSpace: 'nowrap'
                }}
              >
                REGISTER NOW
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 
              className="mb-6 md:mb-8 text-center"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(36px, 8vw, 52px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                color: 'var(--Color-head, #636564)',
                maxWidth: '90vw',
                margin: '0 auto'
              }}
            >
              Find Your Side Hustle!
            </h2>
            <div 
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(16px, 3vw, 24px)',
                lineHeight: '1.2',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#2C2C2C',
                marginTop: '30px'
              }}
            >
              <p style={{fontWeight: 700}} >You’ve got the experience, skill & enterprise. Maybe even a career you’re proud of. But you want more.</p>
              <br />
              <p>A side hustle to earn extra.</p>
              <p>A way to turn your skills into startup equity.</p> 
              <p>Or maybe the chance to launch your own venture without giving up your safety net.</p>
              <br />
              <p style={{fontWeight: 700}}>BUT, there’s always a but.</p>
              <p>The startup world feels too scary, unknown and disorganised. </p>
              <p style={{fontWeight: 700}}>Too high-risk to take the plunge, so you're stuck.</p>
              <br />
              <p style={{ fontWeight: 700 }}>Co-Founder Circle changes that.</p>
            </div>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-none px-0">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-4 md:p-6 text-center relative"
                style={{
                  minHeight: '200px',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
                  marginTop: '20px'
                }}
              >
                <div 
                  className="mb-2"
                  style={{
                    position: 'relative',
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(48px, 8vw, 90px)',
                    lineHeight: '1',
                    letterSpacing: '0%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    background: 'linear-gradient(114deg, #3CE5A7 0%, #114DFF 117.74%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 1,
                    margin: '0',
                    marginTop: '5px'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 3vw, 25px)',
                    lineHeight: '1.3',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#4A4848',
                    padding: '0 10px',
                    marginTop: '10px'
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 
              className="mb-6 md:mb-8"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(28px, 6vw, 52px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#636564',
                maxWidth: '100%',
                margin: '0 auto',
                marginBottom: '40px'
              }}
            >
              We Are India’s First Startup Network That Unlocks Startup Opportunities for Professionals
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto px-4">
              <p 
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 3vw, 24px)',
                  lineHeight: '1.2',
                  letterSpacing: '5%',
                  textAlign: 'center',
                  color: '#2C2C2C'
                }}
              >
                We connect professionals directly with real founders and high‑growth startups across fields.
              </p>
              <br />
              <p 
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 3vw, 24px)',
                  lineHeight: '1.2',
                  letterSpacing: '5%',
                  textAlign: 'center',
                  color: '#2C2C2C'
                }}
              >
                No cold emails. No gatekeepers. No dead‑end projects.
                <br />
                Just side hustles, advisory gigs, and co‑founder opportunities that turn your experience into real impact & equity.
              </p>
              <br />
              <p 
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 3vw, 24px)',
                  lineHeight: '1.2',
                  letterSpacing: '5%',
                  textAlign: 'center',
                  color: '#2C2C2C'
                }}
              >
                Whether you want to earn on the side, mentor startups, or explore your own venture, CFC gives you a front‑row seat to India’s startup ecosystem, without leaving your 9‑to‑5.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 
              className="mb-8 md:mb-10"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(28px, 6vw, 52px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                textAlign: 'center',
                background: 'linear-gradient(114deg, #3CE5A7 0%, #114DFF 117.74%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 auto',
                maxWidth: '100%'
              }}
            >
              What is CoFounder Circle
            </h2>
            <div 
              className="relative rounded-lg overflow-hidden shadow-lg mx-auto"
              style={{
                width: '100%',
                maxWidth: '100%',
                height: 'clamp(180px, 35vw, 500px)',
                opacity: 1,
                margin: '20px auto 0 auto',
                display: 'block',
                position: 'relative'
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/ndiVL4plQDI?mute=1&enablejsapi=1${isInView ? '&autoplay=1' : ''}`}
                title="What is CoFounder Circle"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ref={videoRef}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 
              className="mb-6 md:mb-8"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(28px, 6vw, 52px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                textAlign: 'center',
                color: 'var(--Color-head, #636564)',
                margin: '0 auto',
                maxWidth: '100%'
              }}
            >
              What We Offer
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-4 md:p-6"
                style={{
                  boxShadow: '5px 4px 8.3px 3px #0000001C'
                }}
              >
                <h3 
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(20px, 4vw, 32px)',
                    lineHeight: '1.1',
                    letterSpacing: '0%',
                    background: 'linear-gradient(110.49deg, #3CE5A7 -30.4%, #2EB3C4 10.81%, #114DFF 96.23%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    padding: '8px 0',
                    minHeight: '40px'
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 2.5vw, 22px)',
                    lineHeight: '1.1',
                    letterSpacing: '0%',
                    color: '#636564'
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(28px, 6vw, 52px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                textAlign: 'center',
                color: 'var(--Color-head, #636564)',
                margin: '0 auto 20px auto',
                maxWidth: '100%'
              }}
            >
              SOUND GOOD?
            </h2>
            <p 
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(18px, 3vw, 24px)',
                lineHeight: '1.1',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#636564',
                margin: '0 auto 25px auto'
              }}
            >
              Let's get started!
            </p>
            <button
              onClick={handleRegisterClick}
              style={{
                width: 'clamp(200px, 80vw, 276px)',
                height: '54px',
                borderRadius: '50px',
                opacity: 1,
                background: 'linear-gradient(115.8deg, #3CE5A7 -46.67%, #114DFF 171.47%)',
                boxShadow: '0px 4px 4px 0px #00000021',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '100%',
                letterSpacing: '3%',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              REGISTER NOW
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">CoFounder Circle</h3>
              <p className="text-gray-400 text-sm md:text-base">
                India's first startup network built to empower professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Career Growth</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Professional Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Global Opportunities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Career Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Skill Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@cofoundercircle.ai
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 xxxxxxxxxx
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delhi, India
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2025 CoFounder Circle. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Working Professional Registration Modal */}
      <WorkingProfessionalRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
        onError={handleSignInError}
      />
    </div>
  );
} 