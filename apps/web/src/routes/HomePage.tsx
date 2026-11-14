import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IdeaInputForm } from '../components/research/IdeaInputForm';
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

  return (
    <div className="space-y-8">
      <IdeaInputForm onSubmit={handleStartResearch} isLoading={loading} />
    </div>
  );
};
