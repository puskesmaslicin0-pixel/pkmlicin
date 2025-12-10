



import React from 'react';
import { PatientVisitData, DiseaseData, Employee, PublicReport, Achievement, ClusterItem, ServiceItem, AppConfig, User, ClusterAchievement, GeoInfo, ServiceDetailContent } from './types';
import { Activity, Users, Stethoscope, Baby, Shield, FileText, LayoutGrid, HeartPulse, Siren, Pill, Microscope, Eye } from 'lucide-react';

export const BACKGROUND_OPTIONS = [
  { id: 'clean', label: 'Clean Slate', className: 'bg-slate-50' },
  { id: 'warm', label: 'Warm Paper', className: 'bg-orange-50/50' },
  { id: 'cool', label: 'Cool Blue', className: 'bg-blue-50/50' },
  { id: 'grad-teal', label: 'Teal Gradient', className: 'bg-gradient-to-br from-teal-50 via-white to-emerald-50' },
  { id: 'grad-indigo', label: 'Indigo Gradient', className: 'bg-gradient-to-br from-indigo-50 via-white to-blue-50' },
  { id: 'grid', label: 'Modern Grid', className: 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]' },
];

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: "UPTD Puskesmas Sehat Mandiri",
  tagline: "Melayani dengan Hati, Menuju Masyarakat Sehat",
  hero: {
    title: "Profil Digital Puskesmas Sehat Mandiri",
    subtitle: "Kami menyediakan data kesehatan transparan, layanan terpadu, dan fasilitas modern untuk kesejahteraan masyarakat.",
    imageUrl: "https://picsum.photos/800/600?grayscale"
  },
  contact: {
    address: "Jl. Kesehatan No. 12, Kota Sehat",
    phone: "021-555-0199",
    email: "info@puskesmas-sehat.go.id",
    hours: "Senin - Sabtu: 07.00 - 14.00"
  },
  theme: {
    background: 'bg-slate-50'
  }
};

export const MOCK_VISIT_DATA: PatientVisitData[] = [
  { month: 'Jan', visits: 1200, bpjs: 850, umum: 350 },
  { month: 'Feb', visits: 1150, bpjs: 800, umum: 350 },
  { month: 'Mar', visits: 1300, bpjs: 950, umum: 350 },
  { month: 'Apr', visits: 1450, bpjs: 1100, umum: 350 },
  { month: 'Mei', visits: 1400, bpjs: 1050, umum: 350 },
  { month: 'Jun', visits: 1600, bpjs: 1200, umum: 400 },
];

export const MOCK_DISEASE_DATA: DiseaseData[] = [
  { name: 'ISPA', cases: 450, trend: 'up' },
  { name: 'Hipertensi', cases: 320, trend: 'stable' },
  { name: 'Diabetes Melitus', cases: 180, trend: 'up' },
  { name: 'Diare', cases: 150, trend: 'down' },
  { name: 'Gastritis', cases: 120, trend: 'stable' },
];

// Icon Mapping
export const ICON_MAP: { [key: string]: React.ElementType } = {
  'Stethoscope': Stethoscope,
  'Baby': Baby,
  'Activity': Activity,
  'Users': Users,
  'HeartPulse': HeartPulse,
  'Siren': Siren,
  'Pill': Pill,
  'Microscope': Microscope,
  'Eye': Eye,
  'Shield': Shield,
  'FileText': FileText,
  'LayoutGrid': LayoutGrid
};

export const SERVICES_LIST: ServiceItem[] = [
  { title: "Poli Umum", desc: "Pemeriksaan kesehatan dasar dan pengobatan umum.", iconName: "Stethoscope" },
  { title: "Poli KIA/KB", desc: "Kesehatan Ibu Anak dan Keluarga Berencana.", iconName: "Baby" },
  { title: "UGD 24 Jam", desc: "Penanganan gawat darurat medis siap siaga.", iconName: "Activity" },
  { title: "Konseling Gizi", desc: "Konsultasi pola makan dan gizi seimbang.", iconName: "Users" },
];

export const MOCK_VISION = "Terwujudnya Masyarakat Kecamatan Sehat yang Mandiri dan Berkeadilan.";
export const MOCK_MISSIONS = [
  "Meningkatkan pelayanan kesehatan yang bermutu dan terjangkau.",
  "Mendorong kemandirian masyarakat untuk hidup sehat.",
  "Meningkatkan tata kelola puskesmas yang akuntabel."
];

export const DEFAULT_GEO_INFO: GeoInfo = {
  description: "Wilayah kerja UPTD Puskesmas Sehat Mandiri mencakup area seluas 45 km² yang terdiri dari dataran rendah dan perbukitan. Secara administratif, wilayah ini meliputi 5 Desa dan 2 Kelurahan dengan total populasi sekitar 35.000 jiwa. Batas wilayah sebelah utara berbatasan dengan Kecamatan Maju, sebelah selatan dengan Sungai Besar, sebelah timur dengan Kabupaten Tetangga, dan sebelah barat dengan Kecamatan Jaya.",
  imageUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1000&h=600"
};

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Dr. Budi Santoso, M.Kes', role: 'Kepala Puskesmas', photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: '2', name: 'Dr. Siti Aminah', role: 'Dokter Umum', photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: '3', name: 'Ns. Ahmad Rizki, S.Kep', role: 'Koordinator Perawat', photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: '4', name: 'Bidan Ratna Sari, Str.Keb', role: 'Koordinator KIA', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' },
];

export const MOCK_REPORTS: PublicReport[] = [
  { id: '1', title: "Profil Kesehatan Puskesmas 2023", year: "2023", category: "Laporan Tahunan", size: "4.2 MB" },
  { id: '2', title: "Laporan Akuntabilitas Kinerja (LAKIP)", year: "2023", category: "Kinerja", size: "2.1 MB" },
  { id: '3', title: "Hasil Survei Kepuasan Masyarakat", year: "2024", category: "Survei", size: "1.5 MB" },
  { id: '4', title: "Rencana Strategis (Renstra) 2022-2027", year: "2022", category: "Perencanaan", size: "5.8 MB" },
  { id: '5', title: "Laporan Keuangan Semester I 2024", year: "2024", category: "Keuangan", size: "1.8 MB" },
  { id: '6', title: "Standar Pelayanan Publik", year: "2024", category: "Regulasi", size: "0.9 MB" },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', programName: 'Imunisasi Dasar Lengkap (IDL)', target: 100, realization: 92, unit: '%', date: '2023-12-31' },
  { id: '2', programName: 'Pelayanan Ibu Hamil (K4)', target: 100, realization: 95, unit: '%', date: '2023-12-31' },
  { id: '3', programName: 'Screening Kesehatan Usia Produktif', target: 1500, realization: 1200, unit: 'Orang', date: '2023-12-31' },
  { id: '4', programName: 'Kunjungan Rumah PIS-PK', target: 500, realization: 480, unit: 'KK', date: '2023-12-31' },
];

export const MOCK_CLUSTERS: ClusterItem[] = [
  {
    id: '1',
    name: 'Klaster 1: Manajemen',
    description: 'Menangani ketatausahaan, kepegawaian, dan manajemen mutu puskesmas.',
    services: ['Manajemen Puskesmas', 'Ketatausahaan & Kepegawaian', 'Manajemen Keuangan', 'Sistem Informasi Puskesmas'],
    iconName: 'FileText'
  },
  {
    id: '2',
    name: 'Klaster 2: Ibu & Anak',
    description: 'Pelayanan kesehatan komprehensif untuk ibu, anak, dan remaja.',
    services: ['Ibu Hamil, Bersalin & Nifas', 'Bayi & Balita (MTBS)', 'Anak Usia Sekolah & Remaja (PKPR)', 'Imunisasi'],
    iconName: 'Baby'
  },
  {
    id: '3',
    name: 'Klaster 3: Usia Dewasa & Lansia',
    description: 'Skrining dan pengobatan penyakit menular & tidak menular serta kesehatan lansia.',
    services: ['Kesehatan Usia Produktif', 'Kesehatan Lansia', 'Skrining PTM (Penyakit Tidak Menular)', 'Pelayanan Jiwa', 'Kesehatan Gigi & Mulut'],
    iconName: 'Users'
  },
  {
    id: '4',
    name: 'Klaster 4: Penanggulangan Penyakit',
    description: 'Upaya pencegahan penyakit menular dan penyehatan lingkungan.',
    services: ['Pencegahan & Pengendalian Penyakit (P2P)', 'Penyehatan Lingkungan (Kesling)', 'Surveilans Epidemiologi'],
    iconName: 'Shield'
  },
  {
    id: '5',
    name: 'Lintas Klaster',
    description: 'Layanan penunjang medis dan kegawatdaruratan.',
    services: ['Unit Gawat Darurat (UGD)', 'Rawat Inap', 'Laboratorium', 'Kefarmasian'],
    iconName: 'LayoutGrid'
  },
];

export const MOCK_CLUSTER_ACHIEVEMENTS: ClusterAchievement[] = [
  // Jan 2024
  { 
    id: '1', 
    clusterId: '2', 
    serviceName: 'Ibu Hamil, Bersalin & Nifas', 
    activityName: 'Pemeriksaan kehamilan rutin (ANC Terpadu)',
    indicator: 'Kunjungan K1', 
    target: 100, 
    realization: 98, 
    unit: '%', 
    year: '2024', 
    month: 'Januari',
    problems: 'Beberapa ibu hamil masih enggan periksa dini',
    actionPlan: 'Penyuluhan door-to-door oleh kader'
  },
  { 
    id: '2', 
    clusterId: '2', 
    serviceName: 'Imunisasi', 
    activityName: 'Imunisasi',
    indicator: 'IDL', 
    target: 95, 
    realization: 92, 
    unit: '%', 
    year: '2024', 
    month: 'Januari' 
  },
  { 
    id: '3', 
    clusterId: '3', 
    serviceName: 'Kesehatan Usia Produktif', 
    activityName: 'Skrining PTM (Penyakit Tidak Menular)',
    indicator: 'Skrining PTM', 
    target: 100, 
    realization: 85, 
    unit: '%', 
    year: '2024', 
    month: 'Januari', 
    problems: 'Kurangnya partisipasi warga bekerja', 
    actionPlan: 'Jadwal skrining di akhir pekan' 
  },
  { 
    id: '4', 
    clusterId: '4', 
    serviceName: 'Penyehatan Lingkungan (Kesling)', 
    indicator: 'Bebas Jentik', 
    target: 100, 
    realization: 80, 
    unit: '%', 
    year: '2024', 
    month: 'Januari' 
  },
  
  // Feb 2024
  { id: '5', clusterId: '2', serviceName: 'Ibu Hamil, Bersalin & Nifas', activityName: 'Pemeriksaan kehamilan rutin (ANC Terpadu)', indicator: 'Kunjungan K1', target: 100, realization: 99, unit: '%', year: '2024', month: 'Februari' },
  { id: '6', clusterId: '2', serviceName: 'Imunisasi', indicator: 'IDL', target: 95, realization: 94, unit: '%', year: '2024', month: 'Februari' },
  { id: '7', clusterId: '3', serviceName: 'Kesehatan Usia Produktif', indicator: 'Skrining PTM', target: 100, realization: 88, unit: '%', year: '2024', month: 'Februari' },
  { id: '8', clusterId: '4', serviceName: 'Penyehatan Lingkungan (Kesling)', indicator: 'Bebas Jentik', target: 100, realization: 82, unit: '%', year: '2024', month: 'Februari' },

  // Mar 2024
  { id: '9', clusterId: '2', serviceName: 'Ibu Hamil, Bersalin & Nifas', indicator: 'Kunjungan K1', target: 100, realization: 95, unit: '%', year: '2024', month: 'Maret' },
  { id: '10', clusterId: '3', serviceName: 'Kesehatan Usia Produktif', indicator: 'Skrining PTM', target: 100, realization: 90, unit: '%', year: '2024', month: 'Maret' },
  { id: '11', clusterId: '4', serviceName: 'Penyehatan Lingkungan (Kesling)', indicator: 'Bebas Jentik', target: 100, realization: 88, unit: '%', year: '2024', month: 'Maret' },
  
  // Apr 2024
  { id: '12', clusterId: '2', serviceName: 'Ibu Hamil, Bersalin & Nifas', indicator: 'Kunjungan K1', target: 100, realization: 92, unit: '%', year: '2024', month: 'April' },
  { id: '13', clusterId: '3', serviceName: 'Kesehatan Usia Produktif', indicator: 'Skrining PTM', target: 100, realization: 92, unit: '%', year: '2024', month: 'April' },
  { id: '14', clusterId: '4', serviceName: 'Penyehatan Lingkungan (Kesling)', indicator: 'Bebas Jentik', target: 100, realization: 90, unit: '%', year: '2024', month: 'April' },

  // 2023 Sample
  { id: '15', clusterId: '2', serviceName: 'Ibu Hamil, Bersalin & Nifas', indicator: 'Kunjungan K1', target: 100, realization: 85, unit: '%', year: '2023', month: 'Desember' },
];

export const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin'
  }
];

// Mapping of detailed content for each service
export const MOCK_SERVICE_DETAILS: { [key: string]: ServiceDetailContent } = {
  'Ketatausahaan & Kepegawaian': {
    title: 'Ketatausahaan & Kepegawaian',
    description: 'Unit Tata Usaha bertanggung jawab atas penyelenggaraan administrasi umum, administrasi kepegawaian, dan perencanaan yang mendukung kelancaran operasional seluruh pelayanan di Puskesmas. Layanan ini menjadi tulang punggung manajemen internal puskesmas.',
    activities: [
      'Pengelolaan surat masuk dan surat keluar',
      'Administrasi data kepegawaian (Kenaikan Pangkat, Gaji Berkala, Cuti)',
      'Pengelolaan arsip dan dokumen dinas',
      'Penyusunan perencanaan tingkat puskesmas (PTP)',
      'Pelayanan administrasi tamu dan rapat dinas'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000&h=600'
  },
  'Ibu Hamil, Bersalin & Nifas': {
    title: 'Ibu Hamil, Bersalin & Nifas',
    description: 'Pelayanan komprehensif yang ditujukan untuk menjaga kesehatan ibu mulai dari masa kehamilan, proses persalinan yang aman, hingga masa nifas. Kami berkomitmen menurunkan Angka Kematian Ibu (AKI) melalui pemantauan intensif.',
    activities: [
      'Pemeriksaan kehamilan rutin (ANC Terpadu)',
      'Kelas Ibu Hamil',
      'Pelayanan persalinan 24 jam',
      'Kunjungan nifas dan neonatus',
      'Konseling KB pasca persalinan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=1000&h=600'
  },
  // Default fallback for items without specific data
  'default': {
    title: 'Detail Layanan',
    description: 'Informasi detail mengenai layanan ini sedang dalam proses pembaruan. Silakan hubungi petugas kami untuk informasi lebih lanjut mengenai prosedur dan jadwal pelayanan.',
    activities: [
      'Pelayanan sesuai standar operasional prosedur',
      'Konsultasi dengan tenaga medis profesional',
      'Pencatatan rekam medis digital'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000&h=600'
  }
};
