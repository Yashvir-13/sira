export type UserRole = 'member' | 'admin';

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  is_totp_verified: boolean;
  created_at: string;
}

export interface SignupStep1Request {
  email: string;
  password: string;
  confirm_password: string;
}

export interface SignupStep1Response {
  email: string;
  qrCode: string;
  totp_secret: string;
  message: string;
}

export interface SignupStep2Request {
  email: string;
  code: string;
}

export interface SigninRequest {
  email: string;
  password: string;
  code: string;
}

export interface SigninResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export type ResearchStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface MarketSizeMetric {
  value?: string;
  numeric: number;
  description?: string;
}

export interface MarketSize {
  tam?: MarketSizeMetric;
  sam?: MarketSizeMetric;
  som?: MarketSizeMetric;
  cagr?: string;
  unit?: string;
}

export interface Competitor {
  name: string;
  url: string;
  threat_level: 'High' | 'Medium' | 'Low' | string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  differentiation: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CustomerPainPoint {
  pain: string;
  severity: 'High' | 'Medium' | 'Low' | string;
  current_workaround?: string;
}

export interface KeyRisk {
  risk: string;
  mitigation: string;
}

export interface Citation {
  title: string;
  url: string;
  relevant_claim: string;
}

export interface ReportData {
  verdict: string;
  viability_score: number;
  summary: string;
  market_size?: MarketSize;
  competitors?: Competitor[];
  swot?: SwotAnalysis;
  customer_pain_points?: CustomerPainPoint[];
  key_risks?: KeyRisk[];
  citations?: Citation[];
}

export interface ResearchItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: ResearchStatus;
  current_step?: string | null;
  progress: number;
  error_message?: string | null;
  data?: ReportData | null;
  created_at: string;
}

export interface ResearchStartRequest {
  title: string;
  description: string;
}

export interface ResearchStartResponse {
  research_id: string;
  status: string;
  message: string;
}
