
export interface PatientVisitData {
  month: string;
  visits: number;
  bpjs: number;
  umum: number;
}

export interface DiseaseData {
  name: string;
  cases: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ServiceStats {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
}

export interface PublicReport {
  id: string;
  title: string;
  year: string;
  category: string;
  size: string;
}

export interface Achievement {
  id: string;
  programName: string;
  target: number;
  realization: number;
  unit: string;
  date: string;
}

export interface ClusterAchievement {
  id: string;
  clusterId: string;
  serviceName?: string; // Linked to specific service
  activityName?: string; // New: Linked to specific activity scope
  indicator: string;
  target: number;
  realization: number;
  unit: string;
  year: string;
  month: string; // Added month for granular tracking
  problems?: string; // New: Permasalahan
  actionPlan?: string; // New: Rencana Tindak Lanjut
}

export interface ClusterItem {
  id: string;
  name: string;
  description: string;
  services: string[];
  iconName: string; // Changed from 'any' to 'string'
}

export interface ServiceDetailContent {
  title: string;
  description: string;
  activities: string[];
  imageUrl: string;
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ServiceItem {
  title: string;
  desc: string;
  iconName: string;
}

export interface GeoInfo {
  description: string;
  imageUrl: string;
}

export interface AppConfig {
  appName: string;
  tagline: string;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  theme?: {
    background: string;
  };
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
}

export enum TabView {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  CLUSTERS = 'CLUSTERS',
  SETTINGS = 'SETTINGS',
  SERVICE_DETAIL = 'SERVICE_DETAIL'
}
