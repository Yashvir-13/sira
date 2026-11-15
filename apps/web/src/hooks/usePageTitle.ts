import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'SIRA — Autonomous Startup Research',
  '/new': 'New Research Studio | SIRA',
  '/history': 'Dossier Archive | SIRA',
  '/login': 'Sign In | SIRA',
  '/signup': 'Create Account | SIRA',
  '/admin': 'Admin Console | SIRA',
};

export function usePageTitle(customTitle?: string) {
  const location = useLocation();

  useEffect(() => {
    if (customTitle) {
      document.title = customTitle.includes('SIRA') ? customTitle : `${customTitle} | SIRA`;
      return;
    }

    const matchedTitle = ROUTE_TITLES[location.pathname];
    if (matchedTitle) {
      document.title = matchedTitle;
    } else if (location.pathname.startsWith('/research/')) {
      document.title = 'Research Dossier | SIRA';
    } else {
      document.title = 'SIRA — Autonomous Startup Research';
    }
  }, [location.pathname, customTitle]);
}
