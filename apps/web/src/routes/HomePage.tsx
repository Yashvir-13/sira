import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollytellingHome } from '../components/landing/ScrollytellingHome';
import { researchApi } from '../api/research';
import type { ResearchStartRequest } from '../types';

export const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartResearch = async (data: ResearchStartRequest) => {
    setLoading(true);
    try {
      const response = await researchApi.startResearch(data);
      navigate(`/research/${response.research_id}`);
    } finally {
      setLoading(false);
    }
  };

  return <ScrollytellingHome onStartResearch={handleStartResearch} isLoading={loading} />;
};
