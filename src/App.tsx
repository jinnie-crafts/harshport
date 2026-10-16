
import { useState, useEffect, useCallback } from 'react';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { NotFoundPage } from './components/NotFoundPage';

function isHomeRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized === '/' || normalized === '/index.html';
}

function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateHome = useCallback((hash?: string) => {
    const targetUrl = hash ? `/${hash}` : '/';
    window.history.pushState({}, '', targetUrl);
    setCurrentPath('/');

    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  if (!isHomeRoute(currentPath)) {
    return (
      <NotFoundPage
        onNavigateHome={handleNavigateHome}
        currentPath={currentPath + (typeof window !== 'undefined' ? window.location.search : '')}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-[#E8DFD8] selection:bg-[#cbb59d] selection:text-black">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}

export default App;