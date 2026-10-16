import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import watermarkImg from '../assets/watermark.png';

interface NotFoundPageProps {
  onNavigateHome?: (hash?: string) => void;
  currentPath?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  currentPath: propCurrentPath,
}) => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [path, setPath] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Detect coarse pointers (touch screens)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
    }
  }, []);

  // 1. Resolve Current Path
  useEffect(() => {
    if (propCurrentPath) {
      setPath(propCurrentPath);
    } else if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname + window.location.search + window.location.hash;
      setPath(fullPath || '/unknown-sector');
    }
  }, [propCurrentPath]);

  // 2. Document Title Management
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '404: Signal Lost | HARSH';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // 3. Mouse Tracking for Custom Cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 4. 3D Card Physics for Terminal
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(180);
  const spotlightY = useMotionValue(180);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    damping: 20,
    stiffness: 240,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    damping: 20,
    stiffness: 240,
  });

  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(circle 220px at ${x}px ${y}px, rgba(255,255,255,0.3), rgba(212,175,55,0.15), transparent 80%)`
  );

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleGoHome = (e: React.MouseEvent, hash?: string) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome(hash);
    } else {
      if (hash) {
        window.location.href = `/${hash}`;
      } else {
        window.location.href = '/';
      }
    }
  };

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleGoHome(e);
    }
  };

  const navItems = [
    { name: 'ABOUT', hash: '#about' },
    { name: 'PROJECTS', hash: '#work' },
    { name: 'SKILLS', hash: '#skills' },
    { name: 'EXPERIENCE', hash: '#experience' },
    { name: 'CONTACT', hash: '#contact' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-[#E8DFD8] font-sans selection:bg-[#cbb59d] selection:text-black overflow-x-hidden flex flex-col justify-between cursor-default md:cursor-none">
      
      {/* ================= 1. MINIMAL CUSTOM CURSOR ================= */}
      {cursorPos.x >= 0 && !prefersReducedMotion && !isTouchDevice && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-[1px]"
          animate={{
            x: cursorPos.x - (isHovered ? 24 : 5),
            y: cursorPos.y - (isHovered ? 24 : 5),
            width: isHovered ? 48 : 10,
            height: isHovered ? 48 : 10,
            backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.1)' : 'rgba(235, 215, 195, 0.95)',
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.5 }}
          aria-hidden="true"
        />
      )}

      {/* ================= 2. ATMOSPHERIC LIGHTING & WATERMARK ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Animated Primary Gold Orb */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { opacity: 0.08 }
              : { scale: [1, 1.25, 1], opacity: [0.06, 0.12, 0.06] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[38rem] h-[38rem] bg-[#D4AF37] rounded-full blur-[170px]"
        />

        {/* Animated Secondary Bronze Orb */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { opacity: 0.05 }
              : { scale: [1.2, 1, 1.2], opacity: [0.04, 0.09, 0.04] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -right-32 w-[36rem] h-[36rem] bg-[#8C6D4F] rounded-full blur-[180px]"
        />

        {/* Center Void Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] bg-[#D4AF37]/[0.03] rounded-full blur-[200px]" />

        {/* Subtle Cybernetic Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Background Emblem Insignia */}
        <div className="absolute top-1/2 right-12 lg:right-24 -translate-y-1/2 pointer-events-none opacity-[0.04] lg:opacity-[0.06] flex items-center justify-center">
          <img
            src={watermarkImg}
            alt="Insignia"
            className="w-80 h-80 lg:w-[32rem] lg:h-[32rem] object-contain filter grayscale invert"
          />
        </div>
      </div>

      {/* ================= 3. NAVIGATION HEADER ================= */}
      <header className="relative z-20 w-full px-6 sm:px-12 lg:px-16 pt-7 pb-4 flex items-center justify-between border-b border-[#8C6D4F]/15 backdrop-blur-md bg-black/40">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => handleGoHome(e)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-[#EAD8C7] hover:text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#D4AF37] rounded-xs"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          aria-label="Return to Harsh Maurya's Homepage"
        >
          HARSH.
        </a>

        {/* Center Section Shortcuts */}
        <nav
          className="hidden md:flex items-center space-x-7 lg:space-x-9 text-[11px] tracking-[0.28em] font-light uppercase text-[#C4B5A5] absolute left-1/2 -translate-x-1/2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          aria-label="Main Navigation"
        >
          <a
            href="/"
            onClick={(e) => handleGoHome(e)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group py-1 transition-colors duration-300 hover:text-[#FFF5EB] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            HOME
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37]/50 transition-all duration-300 group-hover:w-full" />
          </a>
          {navItems.map((item) => (
            <a
              key={item.name}
              href={`/${item.hash}`}
              onClick={(e) => handleGoHome(e, item.hash)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group py-1 transition-colors duration-300 hover:text-[#FFF5EB] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37]/50 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Action Button */}
        <a
          href="/"
          onClick={(e) => handleGoHome(e)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group flex items-center space-x-2 text-[11px] tracking-[0.24em] font-light uppercase py-2 px-4 border border-[#8C6D4F]/50 hover:border-[#D4AF37] text-[#EAD8C7] hover:text-white transition-all duration-300 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <span>RETURN HOME</span>
          <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
            ↗
          </span>
        </a>
      </header>

      {/* ================= 4. MAIN 404 CONTENT ZONE ================= */}
      <main className="relative z-10 w-full flex-grow flex items-center px-6 sm:px-12 lg:px-20 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* ================= LEFT CONTENT (7 COLS) ================= */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Eyebrow Breadcrumb Header */}
              <motion.div variants={fadeUpVariants} className="flex items-center space-x-4 mb-6">
                <span
                  className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#D4AF37]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  00 // SYSTEM ANOMALY
                </span>
                <div className="w-20 h-[1px] bg-gradient-to-r from-[#D4AF37]/80 via-[#8C6D4F]/40 to-transparent" />
                <span className="text-[10px] font-mono tracking-widest text-[#8C6D4F] uppercase hidden sm:inline-block">
                  STATUS: 0x194
                </span>
              </motion.div>

              {/* Massive Cinematic 404 Headline */}
              <motion.div variants={fadeUpVariants} className="relative mb-5 select-none">
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.6rem] tracking-tight uppercase leading-[0.84]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {/* Line 1: 404 */}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#D5CBC0] to-[#605448] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                    404 ERROR
                  </span>

                  {/* Line 2: SIGNAL LOST */}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] drop-shadow-[0_8px_25px_rgba(201,158,93,0.35)]">
                    SIGNAL LOST.
                  </span>

                  {/* Line 3: VOID DETECTED */}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#DFBE8A] via-[#9B7640] to-[#342410] drop-shadow-[0_10px_30px_rgba(155,118,64,0.4)]">
                    VOID DETECTED.
                  </span>
                </h1>
              </motion.div>

              {/* Dynamic Path Telemetry Pill */}
              <motion.div variants={fadeUpVariants} className="mb-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-sm border border-[#8C6D4F]/40 bg-[#14100D] text-[11px] font-mono text-[#E8D7C5]">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
                  <span className="text-[#8C6D4F]">UNRESOLVED:</span>
                  <span className="text-[#F7E7C4] truncate max-w-[280px] sm:max-w-md">
                    {path || '/requested-route'}
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#8C6D4F] uppercase">
                  ERROR_CODE: 404_NOT_FOUND
                </span>
              </motion.div>

              {/* Architectural Description */}
              <motion.div
                variants={fadeUpVariants}
                className="text-xs sm:text-sm md:text-[14px] font-light text-[#B3A497] leading-[1.85] tracking-wide max-w-xl mb-9 space-y-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <p>
                  The coordinates you navigated to do not exist within this portfolio architecture.
                  The transmission route may have been decommissioned, relocated, or severed in deep space.
                </p>
                <p className="text-[#8C6D4F] text-[12px]">
                  All core systems remain online. Re-orient your navigational compass using the vectors below.
                </p>
              </motion.div>

              {/* Action Buttons Hub */}
              <motion.div
                variants={fadeUpVariants}
                className="flex flex-wrap items-center gap-4 sm:gap-5"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {/* Primary: Return Home */}
                <motion.a
                  href="/"
                  onClick={(e) => handleGoHome(e)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  className="relative inline-flex items-center space-x-3 px-6 sm:px-7 py-3.5 border border-[#8C6D4F] bg-[#120F0C]/90 hover:border-[#D4AF37] text-[#EAD8C7] hover:text-[#FFF5EB] text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.18)] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8D7C5]/40 to-transparent pointer-events-none" />
                  <span>RETURN TO HOMEPAGE</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
                    ↗
                  </span>
                </motion.a>

                {/* Secondary: Explore Works */}
                <motion.a
                  href="/#work"
                  onClick={(e) => handleGoHome(e, '#work')}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  className="relative inline-flex items-center space-x-2 px-6 sm:px-7 py-3.5 border border-[#8C6D4F]/40 hover:border-[#8C6D4F] text-[#BFA895] hover:text-[#EAD8C7] text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  <span>EXPLORE WORKS</span>
                  <span className="text-xs">↓</span>
                </motion.a>

                {/* Tertiary: Contact */}
                <motion.a
                  href="/#contact"
                  onClick={(e) => handleGoHome(e, '#contact')}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  className="relative inline-flex items-center space-x-2 px-6 sm:px-7 py-3.5 border border-[#8C6D4F]/40 hover:border-[#D4AF37] text-[#BFA895] hover:text-[#FFF5EB] text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  <span>INITIATE DISPATCH</span>
                  <span className="text-xs">↗</span>
                </motion.a>

                {/* Quaternary: Go Back */}
                <button
                  type="button"
                  onClick={handleGoBack}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="inline-flex items-center space-x-2 text-[10.5px] font-mono tracking-[0.2em] uppercase text-[#8C6D4F] hover:text-[#D4AF37] transition-colors py-2 px-1 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  <span>←</span>
                  <span>PREVIOUS VECTOR</span>
                </button>
              </motion.div>
            </motion.div>

            {/* ================= RIGHT 3D RADAR TERMINAL (5 COLS) ================= */}
            <div className="lg:col-span-5 flex items-center justify-center relative perspective-[1400px]">
              
              {/* Ambient Glow Behind Terminal */}
              <div
                className="absolute -inset-4 bg-[conic-gradient(from_0deg,#D4AF37_0%,#8C6D4F_30%,transparent_60%,#D4AF37_100%)] blur-2xl rounded-2xl opacity-20 pointer-events-none"
                aria-hidden="true"
              />

              {/* 3D Holographic Radar Card */}
              <motion.div
                ref={cardRef}
                style={
                  prefersReducedMotion
                    ? {}
                    : { rotateX, rotateY, transformStyle: 'preserve-3d' }
                }
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[420px] p-6 sm:p-7 border border-[#8C6D4F]/45 rounded-sm bg-[#0E0C0A]/90 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.98)] group hover:border-[#D4AF37]/80 transition-colors duration-500 overflow-hidden"
              >
                {/* Laser Perimeter Sweep */}
                <div className="absolute inset-0 rounded-sm pointer-events-none overflow-hidden" aria-hidden="true">
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? {}
                        : { x: ['-100%', '200%'] }
                    }
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent skew-x-12"
                  />
                </div>

                {/* Top Gold Horizon Edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />

                {/* Precision 4-Corner Gold Brackets */}
                <div className="pointer-events-none" aria-hidden="true">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                </div>

                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#8C6D4F]/25 relative z-10">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37]">
                      RADAR_TELEMETRY.SYS
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 border border-[#8C6D4F]/40 bg-[#16120E] text-[#A8988B]">
                    NODE: HARSH_OS
                  </span>
                </div>

                {/* Holographic Radar Scanner Display */}
                <div className="relative aspect-square w-full max-w-[300px] mx-auto rounded-full border border-[#8C6D4F]/30 bg-[#050403] flex items-center justify-center overflow-hidden my-4 shadow-inner">
                  
                  {/* Concentric Radar Grid Rings */}
                  <div className="absolute inset-5 rounded-full border border-[#8C6D4F]/20" />
                  <div className="absolute inset-12 rounded-full border border-[#8C6D4F]/25" />
                  <div className="absolute inset-20 rounded-full border border-[#D4AF37]/20" />
                  <div className="absolute inset-28 rounded-full border border-[#D4AF37]/35" />

                  {/* Crosshair Axes */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#8C6D4F]/20" />
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#8C6D4F]/20" />

                  {/* Compass Degrees */}
                  <span className="absolute top-2 text-[8px] font-mono text-[#8C6D4F]">000°</span>
                  <span className="absolute right-2 text-[8px] font-mono text-[#8C6D4F]">090°</span>
                  <span className="absolute bottom-2 text-[8px] font-mono text-[#8C6D4F]">180°</span>
                  <span className="absolute left-2 text-[8px] font-mono text-[#8C6D4F]">270°</span>

                  {/* Rotating Radar Sweep Arm */}
                  {!prefersReducedMotion && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 origin-center pointer-events-none"
                    >
                      <div
                        className="w-1/2 h-1/2 origin-bottom-right"
                        style={{
                          background:
                            'conic-gradient(from 180deg at 100% 100%, rgba(212,175,55,0.35) 0deg, rgba(212,175,55,0.05) 45deg, transparent 90deg)',
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Anomaly Ping Echo Blip */}
                  <div className="absolute top-1/3 right-1/4 flex items-center justify-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]" />
                    </span>
                    <span className="absolute left-4 top-0 text-[8px] font-mono text-red-400 whitespace-nowrap">
                      NULL_ROUTE
                    </span>
                  </div>

                  {/* Center Node */}
                  <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />

                  {/* Mouse Tracked Spotlight */}
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none mix-blend-overlay"
                      style={{ background: spotlightBg }}
                    />
                  )}
                </div>

                {/* Diagnostics Matrix */}
                <div className="space-y-2 pt-3 border-t border-[#8C6D4F]/25 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#8C6D4F]">// STATUS</span>
                    <span className="text-red-400">UNRESOLVED TARGET</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#8C6D4F]">// LATENCY</span>
                    <span className="text-[#F7E7C4]">INF_DISCONNECT</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#8C6D4F]">// PROTOCOL</span>
                    <span className="text-[#D4AF37]">FALLBACK_ENGAGED</span>
                  </div>
                </div>

                {/* Signature Touch */}
                <div className="pt-4 mt-3 border-t border-[#8C6D4F]/15 flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-mono text-[#8C6D4F] tracking-widest uppercase">
                    HARSH MAURYA // CRAFT
                  </span>
                  <span
                    className="text-2xl text-[#D8AB64] drop-shadow-[0_0_8px_rgba(216,171,100,0.4)]"
                    style={{ fontFamily: "'Herr Von Muellerhoff', 'Allura', cursive" }}
                  >
                    Harsh
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      {/* ================= 5. SYSTEM FOOTER ================= */}
      <footer className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-6 border-t border-[#8C6D4F]/15 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
          <span className="text-[10px] font-mono tracking-widest text-[#8C6D4F] uppercase">
            PORTFOLIO | HARSH 2026
          </span>
          <span className="text-[10px] font-mono text-[#8C6D4F]">
            © {new Date().getFullYear()} • ENGINEERED WITH PRECISION
          </span>
        </div>
      </footer>

    </div>
  );
};

export default NotFoundPage;
