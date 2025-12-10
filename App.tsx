
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import VisionMissionSection from './components/VisionMissionSection';
import ServicesSection from './components/ServicesSection';
import TeamSection from './components/TeamSection';
import LoginSection from './components/LoginSection';
import GeneralSettingsSection from './components/GeneralSettingsSection';
import PublicReportsSection from './components/PublicReportsSection';
import UserManagementSection from './components/UserManagementSection';
import ClusterSection from './components/ClusterSection';
import HomeChartsSection from './components/HomeChartsSection';
import GeoLocationSection from './components/GeoLocationSection';
import ServiceDetailSection from './components/ServiceDetailSection';
import DatabaseManagementSection from './components/DatabaseManagementSection';
import { 
  SERVICES_LIST, 
  MOCK_EMPLOYEES, 
  MOCK_REPORTS, 
  MOCK_CLUSTERS, 
  MOCK_CLUSTER_ACHIEVEMENTS,
  MOCK_VISION, 
  MOCK_MISSIONS,
  DEFAULT_GEO_INFO,
  ICON_MAP,
  DEFAULT_APP_CONFIG,
  DEFAULT_USERS,
  MOCK_SERVICE_DETAILS
} from './constants';
import { TabView, ServiceItem, Employee, AppConfig, PublicReport, User, ClusterAchievement, GeoInfo, ServiceDetailContent, ClusterItem } from './types';
import { CheckCircle2, Sparkles, ChevronRight, Layers, Settings, LogOut, Layout, FileText, Users, ChevronDown, ChevronUp, Database } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.HOME);
  const [previousTab, setPreviousTab] = useState<TabView>(TabView.HOME); // Track history for back navigation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Settings Accordion State
  const [expandedSetting, setExpandedSetting] = useState<string | null>('general');
  
  // State for content management (Lifted up)
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [vision, setVision] = useState<string>(MOCK_VISION);
  const [missions, setMissions] = useState<string[]>(MOCK_MISSIONS);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [reports, setReports] = useState<PublicReport[]>(MOCK_REPORTS);
  const [clusters, setClusters] = useState<ClusterItem[]>(MOCK_CLUSTERS);
  const [clusterAchievements, setClusterAchievements] = useState<ClusterAchievement[]>(MOCK_CLUSTER_ACHIEVEMENTS);
  const [geoInfo, setGeoInfo] = useState<GeoInfo>(DEFAULT_GEO_INFO);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [serviceDetails, setServiceDetails] = useState<{ [key: string]: ServiceDetailContent }>(MOCK_SERVICE_DETAILS);

  const handleUpdateAppConfig = (newConfig: AppConfig) => {
    setAppConfig(newConfig);
  };

  const handleUpdateVisionMission = (newVision: string, newMissions: string[]) => {
    setVision(newVision);
    setMissions(newMissions);
  };

  const handleUpdateServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
  };

  const handleUpdateTeam = (newTeam: Employee[]) => {
    setEmployees(newTeam);
  };

  const handleUpdateReports = (newReports: PublicReport[]) => {
    setReports(newReports);
  };

  const handleUpdateClusters = (newClusters: ClusterItem[]) => {
    setClusters(newClusters);
  };

  const handleUpdateClusterAchievements = (newAchievements: ClusterAchievement[]) => {
    setClusterAchievements(newAchievements);
  };

  const handleUpdateGeoInfo = (newGeoInfo: GeoInfo) => {
    setGeoInfo(newGeoInfo);
  };

  const handleUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
  };

  const handleUpdateServiceDetail = (serviceName: string, updatedContent: ServiceDetailContent) => {
    setServiceDetails({
      ...serviceDetails,
      [serviceName]: updatedContent
    });
  };

  const handleImportDatabase = (data: any) => {
     // Safety check before setting state
     if (data.appConfig) setAppConfig(data.appConfig);
     if (data.vision) setVision(data.vision);
     if (data.missions) setMissions(data.missions);
     if (data.services) setServices(data.services);
     if (data.employees) setEmployees(data.employees);
     if (data.reports) setReports(data.reports);
     if (data.users) setUsers(data.users);
     if (data.geoInfo) setGeoInfo(data.geoInfo);
     if (data.clusters) setClusters(data.clusters);
     if (data.clusterAchievements) setClusterAchievements(data.clusterAchievements);
     if (data.serviceDetails) setServiceDetails(data.serviceDetails);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentTab(TabView.HOME);
  };

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setPreviousTab(currentTab);
    setCurrentTab(TabView.SERVICE_DETAIL);
  };

  const handleBackFromService = () => {
    setCurrentTab(previousTab);
    setSelectedService(null);
  };
  
  const toggleSettingAccordion = (id: string) => {
     setExpandedSetting(expandedSetting === id ? null : id);
  };

  // Helper to find cluster ID for a service
  const findClusterId = (serviceName: string): string => {
    const cluster = clusters.find(c => c.services.includes(serviceName));
    return cluster ? cluster.id : '0';
  };

  // If not logged in, show Login Screen exclusively
  if (!isLoggedIn) {
    return <LoginSection onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case TabView.SERVICE_DETAIL:
        const currentServiceDetail = selectedService 
           ? (serviceDetails[selectedService] || serviceDetails['default'])
           : serviceDetails['default'];
           
        // Fallback for title if using default template
        if(selectedService && !serviceDetails[selectedService]) {
           currentServiceDetail.title = selectedService;
        }

        const isDetailReadOnly = false;

        return (
          <ServiceDetailSection 
            content={currentServiceDetail}
            serviceName={selectedService || 'Unknown'}
            clusterId={selectedService ? findClusterId(selectedService) : undefined}
            onBack={handleBackFromService}
            onUpdate={(updated) => selectedService && handleUpdateServiceDetail(selectedService, updated)}
            isReadOnly={isDetailReadOnly} 
            achievements={clusterAchievements}
            onUpdateAchievements={handleUpdateClusterAchievements}
          />
        );

      case TabView.SETTINGS:
        return (
          <div className="animate-fade-in pb-20">
             <div className="bg-slate-900 border-b border-slate-800 py-12 text-white relative">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-slate-800 rounded-full">
                        <Settings className="h-8 w-8 text-teal-400" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-extrabold sm:text-4xl">Pengaturan Admin</h2>
                    <p className="mt-4 text-lg text-slate-400">
                      Kelola tampilan, konten, dan pengguna sistem.
                    </p>
                  </div>
               </div>
             </div>
             
             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
                {/* 1. General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('general')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <Layout className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Konten & Tampilan Utama</span>
                       </div>
                       {expandedSetting === 'general' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'general' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <GeneralSettingsSection 
                            config={appConfig}
                            onUpdate={handleUpdateAppConfig}
                          />
                       </div>
                    )}
                </div>

                {/* 2. User Management */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('users')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <Users className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Manajemen Pengguna</span>
                       </div>
                       {expandedSetting === 'users' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'users' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <UserManagementSection 
                             users={users}
                             onUpdateUsers={handleUpdateUsers}
                             currentUser={currentUser}
                          />
                       </div>
                    )}
                </div>

                {/* 3. Vision & Mission */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('vision')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <FileText className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Visi & Misi</span>
                       </div>
                       {expandedSetting === 'vision' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'vision' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <VisionMissionSection 
                             vision={vision} 
                             missions={missions} 
                             onUpdate={handleUpdateVisionMission} 
                             isReadOnly={false} 
                          />
                       </div>
                    )}
                </div>

                {/* 4. Geography */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('geo')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <Layers className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Geografis & Wilayah</span>
                       </div>
                       {expandedSetting === 'geo' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'geo' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <GeoLocationSection 
                             data={geoInfo}
                             onUpdate={handleUpdateGeoInfo}
                             isReadOnly={false}
                          />
                       </div>
                    )}
                </div>

                {/* 5. Services */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('services')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <Settings className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Daftar Layanan</span>
                       </div>
                       {expandedSetting === 'services' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'services' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <ServicesSection 
                             data={services} 
                             onUpdate={handleUpdateServices} 
                             isReadOnly={false} 
                          />
                       </div>
                    )}
                </div>

                {/* 6. Employees */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('team')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <Users className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Data Pegawai</span>
                       </div>
                       {expandedSetting === 'team' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'team' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <TeamSection 
                             data={employees} 
                             onUpdate={handleUpdateTeam} 
                             isReadOnly={false} 
                          />
                       </div>
                    )}
                </div>

                {/* 7. Public Docs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('docs')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                             <FileText className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Laporan & Dokumen</span>
                       </div>
                       {expandedSetting === 'docs' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'docs' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <PublicReportsSection 
                             data={reports} 
                             onUpdate={handleUpdateReports} 
                             isReadOnly={false} 
                          />
                       </div>
                    )}
                </div>

                {/* 8. Database Management (Export/Import) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button 
                       onClick={() => toggleSettingAccordion('database')}
                       className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                             <Database className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-800">Manajemen Database</span>
                       </div>
                       {expandedSetting === 'database' ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {expandedSetting === 'database' && (
                       <div className="p-6 border-t border-slate-100 animate-fade-in">
                          <DatabaseManagementSection 
                             data={{
                               appConfig, vision, missions, services, employees, reports,
                               users, geoInfo, clusters, clusterAchievements, serviceDetails
                             }}
                             onImport={handleImportDatabase}
                          />
                       </div>
                    )}
                </div>

             </div>
          </div>
        );

      case TabView.CLUSTERS:
        return (
          <div className="animate-fade-in pb-20">
            {/* Header Section */}
            <div className="bg-slate-50 border-b border-slate-200 py-16">
              <div className="max-w-3xl mx-auto text-center px-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-teal-100 rounded-full">
                    <Layers className="h-8 w-8 text-teal-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Integrasi Layanan Primer (ILP)</h2>
                <p className="mt-4 text-lg text-slate-600">
                  Transformasi pelayanan kesehatan primer berdasarkan siklus hidup manusia.
                </p>
              </div>
            </div>

            {/* Clusters Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <ClusterSection 
                  clusters={clusters}
                  achievements={clusterAchievements}
                  onUpdateAchievements={handleUpdateClusterAchievements}
                  onUpdateClusters={handleUpdateClusters}
                  isReadOnly={false}
                  onServiceClick={handleServiceClick}
               />
            </div>
          </div>
        );

      case TabView.ABOUT:
        return (
          <div className="animate-fade-in pb-20">
             {/* Header Section */}
             <div className="bg-slate-50 border-b border-slate-200 py-16">
               <div className="max-w-3xl mx-auto text-center px-4">
                  <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Profil Puskesmas</h2>
                  <p className="mt-4 text-lg text-slate-600">
                    Kami hadir sebagai garda terdepan kesehatan masyarakat.
                  </p>
               </div>
             </div>

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               
               {/* Vision & Mission (Read Only) */}
               <VisionMissionSection 
                  vision={vision} 
                  missions={missions} 
                  onUpdate={handleUpdateVisionMission} 
                  isReadOnly={true}
               />

               {/* Geo Location (Read Only) */}
               <GeoLocationSection 
                  data={geoInfo} 
                  onUpdate={handleUpdateGeoInfo} 
                  isReadOnly={true}
               />

               {/* Services Section (Read Only) */}
               <ServicesSection 
                  data={services} 
                  onUpdate={handleUpdateServices} 
                  isReadOnly={true}
               />

               {/* Team Section (Read Only) */}
               <TeamSection 
                  data={employees} 
                  onUpdate={handleUpdateTeam} 
                  isReadOnly={true}
               />

               {/* Public Reports List (Read Only) */}
               <PublicReportsSection 
                  data={reports} 
                  onUpdate={handleUpdateReports} 
                  isReadOnly={true} 
               />

             </div>
          </div>
        );

      case TabView.HOME:
      default:
        return (
          <div className="animate-fade-in">
            <Hero 
              onCtaClick={() => setCurrentTab(TabView.ABOUT)} 
              config={appConfig.hero} 
              contact={appConfig.contact}
              appName={appConfig.appName}
            />

            {/* Home Charts Section (New) */}
            <HomeChartsSection 
              clusters={clusters}
              achievements={clusterAchievements}
            />
            
            {/* Featured Services Preview */}
            <div className="py-16 bg-white" id="services">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Layanan Unggulan</h2>
                  <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                    Kami menyediakan berbagai layanan kesehatan komprehensif untuk memenuhi kebutuhan keluarga Anda.
                  </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {services.map((service, idx) => {
                    // Resolve Icon component from map
                    const IconComponent = ICON_MAP[service.iconName] || ICON_MAP['Activity'];
                    return (
                      <div key={idx} className="relative p-6 bg-slate-50 rounded-lg border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-teal-100 rounded-full opacity-50 blur-xl"></div>
                        <IconComponent className="h-8 w-8 text-teal-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">{service.title}</h3>
                        <p className="mt-2 text-base text-slate-500">{service.desc}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-10 text-center">
                  <button 
                    onClick={() => setCurrentTab(TabView.ABOUT)}
                    className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700"
                  >
                    Lihat Selengkapnya <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

             {/* Simple News/Announcement Section */}
             <div className="bg-slate-900 py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                   <Sparkles className="inline-block h-8 w-8 text-yellow-400 mr-2" />
                   Info Sehat Terkini
                 </h2>
                 <p className="mt-4 text-xl text-slate-300">
                   Jadwal imunisasi massal akan dilaksanakan bulan depan. Pastikan buah hati Anda terdaftar!
                 </p>
                 <div className="mt-8">
                   <button 
                      onClick={() => setCurrentTab(TabView.CLUSTERS)}
                      className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-yellow-400 hover:bg-yellow-500 md:text-lg"
                   >
                     Cek Layanan Klaster
                   </button>
                 </div>
               </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen font-sans text-slate-900 ${appConfig.theme?.background || 'bg-slate-50'}`}>
      <Navbar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        appName={appConfig.appName}
        onLogout={handleLogout}
      />
      <main>
        {renderContent()}
      </main>
      <Footer 
        appName={appConfig.appName} 
        tagline={appConfig.tagline}
        contact={appConfig.contact}
      />
    </div>
  );
};

export default App;
