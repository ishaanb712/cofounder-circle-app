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

export default function MainLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Performance monitoring
  const { trackUserInteraction } = usePerformance();

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      // User is not authenticated, show sign-in modal
      setShowSignInModal(true);
    }
  };

  const userTypes = [
    {
      id: 'students',
      title: 'Students',
      description: 'Connect with mentors, find internships, and kickstart your career journey',
      icon: GraduationCap,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      href: '/student',
      features: ['Mentorship Programs', 'Internship Opportunities', 'Career Guidance', 'Skill Development']
    },
    {
      id: 'founders',
      title: 'Founders',
      description: 'Connect with investors, mentors, and build your startup ecosystem',
      icon: Rocket,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      href: '/founder',
      features: ['Investor Network', 'Mentorship', 'Startup Resources', 'Funding Opportunities']
    },
    {
      id: 'mentors',
      title: 'Mentors',
      description: 'Share your expertise and guide the next generation of professionals',
      icon: User,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      href: '/mentor',
      features: ['Mentorship Programs', 'Expert Network', 'Knowledge Sharing', 'Impact Opportunities']
    },
    {
      id: 'vendors',
      title: 'Vendors',
      description: 'Connect with startups and grow your business with quality clients',
      icon: Building2,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      href: '/vendor',
      features: ['Startup Network', 'Business Growth', 'Quality Leads', 'Service Opportunities']
    },
    {
      id: 'professionals',
      title: 'Working Professionals',
      description: 'Advance your career and connect with opportunities worldwide',
      icon: Briefcase,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      href: '/professional',
      features: ['Career Growth', 'Professional Network', 'Skill Development', 'Global Opportunities']
    }
  ];

  const stats = [
    { number: '5000+', label: 'Active Users' },
    { number: '1000+', label: 'Startups' },
    { number: '500+', label: 'Mentors' },
    { number: '200+', label: 'Vendors' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      text: 'Found my dream internship through this platform. The mentorship program was incredible!',
      color: 'blue'
    },
    {
      name: 'Michael Chen',
      role: 'Founder',
      text: 'Connected with amazing investors and mentors. This platform accelerated our growth.',
      color: 'green'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Mentor',
      text: 'Helping students and founders grow has been incredibly rewarding. Great community!',
      color: 'purple'
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
        {/* Optimized Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=60')",
            filter: 'brightness(0.3)'
          }}
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
              Connect. Grow.{' '}
              <span style={{ background: 'linear-gradient(91.36deg, #3CE5A7 1.48%, #114DFF 98.84%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Succeed.
              </span>
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
              The ultimate platform connecting students, founders, mentors, vendors, and professionals in one unified ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="font-medium transition-all duration-300 px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(16px, 3vw, 20px)',
                    lineHeight: '100%',
                    letterSpacing: '3%',
                    textAlign: 'center',
                    background: 'linear-gradient(91.36deg, #3CE5A7 1.48%, #114DFF 98.84%)',
                    color: 'white',
                    minWidth: '200px'
                  }}
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="font-medium transition-all duration-300 px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(16px, 3vw, 20px)',
                    lineHeight: '100%',
                    letterSpacing: '3%',
                    textAlign: 'center',
                    background: 'linear-gradient(91.36deg, #3CE5A7 1.48%, #114DFF 98.84%)',
                    color: 'white',
                    minWidth: '200px'
                  }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <a
                href="#ecosystem"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center"
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Choose Your Path
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500
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
                className="relative"
              >
                <div 
                  onClick={() => handleCardClick(userType.href)}
                  className={`relative bg-gradient-to-br ${userType.bgGradient} rounded-2xl p-8 h-full border-2 border-transparent hover:border-${userType.color}-200 transition-all duration-300 cursor-pointer group`}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${userType.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <userType.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 700
                    }}
                  >
                    {userType.title}
                  </h3>
                  <p 
                    className="text-gray-600 mb-6"
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
                        <CheckCircle className={`w-4 h-4 text-${userType.color}-500`} />
                        <span 
                          className="text-sm text-gray-600"
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
                      className={`text-${userType.color}-600 font-semibold group-hover:text-${userType.color}-700 transition-colors`}
                      style={{
                        fontFamily: 'var(--font-roboto), sans-serif',
                        fontWeight: 500
                      }}
                    >
                      Get Started
                    </span>
                    <ArrowRight className={`w-5 h-5 text-${userType.color}-600 group-hover:translate-x-1 transition-transform`} />
                  </div>

                  {/* Hover Effect */}
                  {hoveredCard === userType.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`absolute inset-0 bg-gradient-to-r ${userType.gradient} rounded-2xl opacity-10`}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Why Choose The CoFounder Circle?
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500
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
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-gray-600"
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
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 900
              }}
            >
              Success Stories
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500
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
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className={`w-6 h-6 text-${testimonial.color}-500 mr-2`} />
                  <div>
                    <h4 
                      className="font-semibold text-gray-900"
                      style={{
                        fontFamily: 'var(--font-montserrat), sans-serif',
                        fontWeight: 600
                      }}
                    >
                      {testimonial.name}
                    </h4>
                    <p 
                      className="text-sm text-gray-600"
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
                  className="text-gray-700 italic"
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
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
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
              className="text-xl text-indigo-100 mb-8"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500
              }}
            >
              Choose your path and start connecting with opportunities that match your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
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
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
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
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
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
      <footer className="bg-gray-900 text-white py-12">
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
                className="text-gray-400"
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
              <ul className="space-y-2 text-gray-400">
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
              <ul className="space-y-2 text-gray-400">
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
              <ul className="space-y-2 text-gray-400">
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
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
