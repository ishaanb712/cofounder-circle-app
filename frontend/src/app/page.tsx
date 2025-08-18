'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight,
  CheckCircle,
  Award,
  Globe,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Building2,
  Calendar,
  GraduationCap,
  Briefcase,
  User,
  Lightbulb,
  Zap,
  Target,
  Rocket,
  Shield,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser, onAuthStateChange, AuthUser, handleRedirectResult } from '@/lib/firebase-secure';
import Logo from '@/components/Logo';
import { usePerformance } from '@/hooks/usePerformance';

// Lazy load components
const GoogleSignInButton = lazy(() => import('@/components/GoogleSignInButton'));
const UserProfileSetup = lazy(() => import('@/components/UserProfileSetup'));
const SignInModal = lazy(() => import('@/components/SignInModal'));

// Rain effect component
const RainEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 bg-white/20 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1 + Math.random() * 2}s`,
          height: `${20 + Math.random() * 60}px`,
          top: '-100px',
          animation: `rain ${2 + Math.random() * 3}s linear infinite`
        }}
      />
    ))}
    <style jsx>{`
      @keyframes rain {
        0% {
          transform: translateY(-100px);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh);
          opacity: 0;
        }
      }
    `}</style>
  </div>
);

export default function MainLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Text streaming state
  const [streamingText, setStreamingText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  // AI Search state
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const streamingUserTypes = ['student', 'founder', 'mentor', 'vendor', 'working professional'];
  
  // Performance monitoring
  const { trackUserInteraction } = usePerformance();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Text streaming effect
  useEffect(() => {
    // Only run animation if user is not typing
    if (isUserTyping) return;
    
    const currentWord = streamingUserTypes[currentWordIndex];
    
    if (isTyping) {
      if (streamingText.length < currentWord.length) {
        const timer = setTimeout(() => {
          setStreamingText(currentWord.slice(0, streamingText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Pause for 2 seconds when word is complete
        return () => clearTimeout(timer);
      }
    } else {
      if (streamingText.length > 0) {
        const timer = setTimeout(() => {
          setStreamingText(streamingText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % streamingUserTypes.length);
          setIsTyping(true);
        }, 500); // Pause before starting next word
        return () => clearTimeout(timer);
      }
    }
  }, [streamingText, isTyping, currentWordIndex, streamingUserTypes, isUserTyping]);

  // AI Search function
  const handleAISearch = async (searchText: string) => {
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: searchText }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the appropriate page
        window.location.href = data.redirect_url;
      } else {
        console.error('AI search failed');
        // Fallback: scroll to ecosystem section
        const ecosystemSection = document.getElementById('ecosystem');
        if (ecosystemSection) {
          ecosystemSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error during AI search:', error);
      // Fallback: scroll to ecosystem section
      const ecosystemSection = document.getElementById('ecosystem');
      if (ecosystemSection) {
        ecosystemSection.scrollIntoView({ behavior: 'smooth' });
      }
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !isClient) return;

    // Handle redirect result first
    const handleAuthRedirect = async () => {
      try {
        const result = await handleRedirectResult();
        if (result.user) {
          setUser(result.user);
          if (!result.user.user_type) {
            setShowProfileSetup(true);
          }
        } else if (result.error) {
          console.error('Redirect result error:', result.error);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    // Check current user on mount
    getCurrentUser().then(setUser).catch(error => {
      console.error('Error getting current user:', error);
    });

    // Handle redirect result
    handleAuthRedirect();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (user && !user.user_type) {
        setShowProfileSetup(true);
      }
    });

    return unsubscribe;
  }, [isClient]);

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    // Navigate to the pending page if there is one
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
      setPendingNavigation(null);
    }
  };

  const handleSignInError = (error: string) => {
    console.error('Sign in error:', error);
    // You could show a toast notification here
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    // Redirect to appropriate dashboard or landing page
  };

  const handleProfileSetupSkip = () => {
    setShowProfileSetup(false);
  };

  const handleCardClick = (href: string) => {
    if (user) {
      // User is authenticated, navigate to the page
      window.location.href = href;
    } else {
      // User is not authenticated, store the intended destination and show sign-in modal
      setPendingNavigation(href);
      setShowSignInModal(true);
    }
  };

  const handleRegisterClick = () => {
    if (user) {
      // User is authenticated, show profile setup or redirect to dashboard
      if (!user.user_type) {
        setShowProfileSetup(true);
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      // User is not authenticated, scroll to ecosystem section
      const ecosystemSection = document.getElementById('ecosystem');
      if (ecosystemSection) {
        ecosystemSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const userTypes = [
    {
      id: 'students',
      title: 'Students',
      description: 'Connect with mentors, find internships, and kickstart your career journey',
      icon: GraduationCap,
      href: '/student',
      features: ['Mentorship Programs', 'Internship Opportunities', 'Career Guidance', 'Skill Development']
    },
    {
      id: 'founders',
      title: 'Founders',
      description: 'Connect with investors, mentors, and build your startup ecosystem',
      icon: Rocket,
      href: '/founder',
      features: ['Investor Network', 'Mentorship', 'Startup Resources', 'Funding Opportunities']
    },
    {
      id: 'mentors',
      title: 'Mentors',
      description: 'Share your expertise and guide the next generation of professionals',
      icon: User,
      href: '/mentor',
      features: ['Mentorship Programs', 'Expert Network', 'Knowledge Sharing', 'Impact Opportunities']
    },
    {
      id: 'vendors',
      title: 'Vendors',
      description: 'Connect with startups and grow your business with quality clients',
      icon: Building2,
      href: '/vendor',
      features: ['Startup Network', 'Business Growth', 'Quality Leads', 'Service Opportunities']
    },
    {
      id: 'professionals',
      title: 'Working Professionals',
      description: 'Advance your career and connect with opportunities worldwide',
      icon: Briefcase,
      href: '/professional',
      features: ['Career Growth', 'Professional Network', 'Skill Development', 'Global Opportunities']
    }
  ];



  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      text: 'Found my dream internship through this platform. The mentorship program was incredible!'
    },
    {
      name: 'Michael Chen',
      role: 'Founder',
      text: 'Connected with amazing investors and mentors. This platform accelerated our growth.'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Mentor',
      text: 'Helping students and founders grow has been incredibly rewarding. Great community!'
    }
  ];

  const features = [
    {
      title: 'Unified Ecosystem',
      description: 'One platform connecting all stakeholders in the startup ecosystem',
      icon: Users
    },
    {
      title: 'Quality Connections',
      description: 'Curated matches based on skills, interests, and goals',
      icon: Star
    },
    {
      title: 'Growth Opportunities',
      description: 'Access to resources, funding, and mentorship for all user types',
      icon: TrendingUp
    },
    {
      title: 'Global Network',
      description: 'Connect with professionals and opportunities worldwide',
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/50 shadow-lg">
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
                className="font-medium transition-all duration-300 px-6 py-2 md:px-8 md:py-3 hover:scale-105"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  lineHeight: '100%',
                  letterSpacing: '3%',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  color: 'white',
                  borderRadius: '50px',
                  minWidth: '120px',
                  maxWidth: '276px',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
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
                className="font-medium transition-all duration-300 px-4 py-2 hover:scale-105"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '3%',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  color: 'white',
                  borderRadius: '50px',
                  minWidth: '100px',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
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
        {/* Rain Effect */}
        <RainEffect />
        
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
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
              Connect. Grow.{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text' 
              }}>
                Succeed.
              </span>
            </h1>
            <p 
              className="mb-8 max-w-3xl mx-auto mt-6"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(18px, 4vw, 24px)',
                lineHeight: '1.2',
                letterSpacing: '0%',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)'
              }}
            >
              The ultimate platform connecting students, founders, mentors, vendors, and professionals in one unified ecosystem.
            </p>
            
            {/* Search Bar */}
            <div className="mb-8 max-w-2xl mx-auto w-full">
              <div className="relative">
                {!isUserTyping && (
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none z-10">
                    <span style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400, fontSize: '18px' }}>
                      I am a{' '}
                    </span>
                    <span 
                      className="text-white"
                      style={{ 
                        fontFamily: 'var(--font-roboto), sans-serif', 
                        fontWeight: 400,
                        fontSize: '18px',
                        borderRight: '2px solid #FFFFFF',
                        animation: isTyping ? 'blink 1s infinite' : 'none'
                      }}
                    >
                      {streamingText}
                    </span>
                  </div>
                )}
                <input
                  type="text"
                  value={searchValue}
                  className="w-full px-6 py-4 rounded-full text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                  onFocus={() => setIsUserTyping(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setIsUserTyping(false);
                    }
                  }}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (e.target.value.length > 0) {
                      setIsUserTyping(true);
                    } else {
                      setIsUserTyping(false);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAISearch(searchValue);
                    }
                  }}
                />
                <button
                  onClick={() => handleAISearch(searchValue)}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500
                  }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                <style jsx>{`
                  @keyframes blink {
                    0%, 50% { border-color: #60A5FA; }
                    51%, 100% { border-color: transparent; }
                  }
                `}</style>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="font-medium transition-all duration-300 px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2 hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(16px, 3vw, 20px)',
                    lineHeight: '100%',
                    letterSpacing: '3%',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    color: 'white',
                    minWidth: '200px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="font-medium transition-all duration-300 px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2 hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(16px, 3vw, 20px)',
                    lineHeight: '100%',
                    letterSpacing: '3%',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    color: 'white',
                    minWidth: '200px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <a
                href="#ecosystem"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center hover:scale-105"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(16px, 3vw, 20px)',
                  lineHeight: '100%',
                  letterSpacing: '3%',
                  minWidth: '200px'
                }}
              >
                Explore Ecosystem
              </a>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Choose Your Path
            </h2>
            <p 
              className="text-xl text-slate-300 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            >
              Join the ecosystem that matches your goals and aspirations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <motion.div
                key={userType.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredCard(userType.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                <div 
                  onClick={() => handleCardClick(userType.href)}
                  className="relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer backdrop-blur-sm hover:scale-105"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                    <userType.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 
                    className="text-2xl font-bold text-white mb-4"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 700
                    }}
                  >
                    {userType.title}
                  </h3>
                  <p 
                    className="text-slate-300 mb-6"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {userType.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {userType.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span 
                          className="text-sm text-slate-300"
                          style={{
                            fontFamily: 'var(--font-roboto), sans-serif',
                            fontWeight: 400
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors"
                      style={{
                        fontFamily: 'var(--font-roboto), sans-serif',
                        fontWeight: 500
                      }}
                    >
                      Get Started
                    </span>
                    <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Why Choose The CoFounder Circle?
            </h2>
            <p 
              className="text-xl text-slate-300 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            >
              The only platform that brings together all stakeholders in the startup ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 
                  className="text-2xl font-bold text-white mb-4"
                  style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-slate-300"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Success Stories
            </h2>
            <p 
              className="text-xl text-slate-300 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            >
              Hear from our community members who have achieved their goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-400 mr-2" />
                  <div>
                    <h4 
                      className="font-semibold text-white"
                      style={{
                        fontFamily: 'var(--font-montserrat), sans-serif',
                        fontWeight: 600
                      }}
                    >
                      {testimonial.name}
                    </h4>
                    <p 
                      className="text-sm text-slate-300"
                      style={{
                        fontFamily: 'var(--font-roboto), sans-serif',
                        fontWeight: 400
                      }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p 
                  className="text-slate-300 italic"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                >
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl font-bold text-white mb-6"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Ready to Join the Ecosystem?
            </h2>
            <p 
              className="text-xl text-slate-300 mb-8"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            >
              Choose your path and start connecting with opportunities that match your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500
                  }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500
                  }}
                >
                  Get Started
                </button>
              )}
              <a
                href="#ecosystem"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Explore All Paths
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 700
                }}
              >
                The CoFounder Circle
              </h3>
              <p 
                className="text-slate-300"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                Connecting the entire startup ecosystem - students, founders, mentors, vendors, and professionals.
              </p>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600
                }}
              >
                Platform
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/student" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Students</Link></li>
                <li><Link href="/founder" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Founders</Link></li>
                <li><Link href="/mentor" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Mentors</Link></li>
                <li><Link href="/vendor" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Vendors</Link></li>
                <li><Link href="/professional" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Professionals</Link></li>
              </ul>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600
                }}
              >
                Resources
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>Events</a></li>
              </ul>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600
                }}
              >
                Contact
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span suppressHydrationWarning style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>hello@cofoundercircle.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span suppressHydrationWarning style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span suppressHydrationWarning style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-300">
            <p style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>&copy; 2024 The CoFounder Circle. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isClient && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>}>
          <SignInModal
            isOpen={showSignInModal}
            onClose={() => {
              setShowSignInModal(false);
              setPendingNavigation(null);
            }}
            onSuccess={handleSignInSuccess}
            onError={handleSignInError}
          />
        </Suspense>
      )}

      {/* User Profile Setup Modal */}
      {showProfileSetup && user && isClient && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>}>
          <UserProfileSetup
            user={user}
            onComplete={handleProfileSetupComplete}
            onSkip={handleProfileSetupSkip}
          />
        </Suspense>
      )}
    </div>
  );
}
