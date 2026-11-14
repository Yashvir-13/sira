import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { ScrollytellingHome } from '../components/landing/ScrollytellingHome';
import { useAuth } from '../state/AuthContext';
import { researchApi } from '../api/research';
import type { ResearchStartRequest } from '../types';

export const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartResearch = async (data: ResearchStartRequest) => {
    if (!user) {
      sessionStorage.setItem('sira_pending_concept', JSON.stringify(data));
      navigate('/login?redirect=launch');
      return;
    }

    setLoading(true);
    try {
      const response = await researchApi.startResearch(data);
      navigate(`/research/${response.research_id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col transition-colors">
      <LandingNavbar />
      <main className="flex-1">
        <ScrollytellingHome onStartResearch={handleStartResearch} isLoading={loading} />
      </main>
    </div>
  );
};
