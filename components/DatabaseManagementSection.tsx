
import React, { useRef, useState } from 'react';
import { Database, Download, Upload, AlertTriangle, CheckCircle2, FileJson, Loader2, FileCode } from 'lucide-react';
import { AppConfig, Employee, PublicReport, ClusterItem, ClusterAchievement, ServiceItem, User, GeoInfo, ServiceDetailContent } from '../types';

interface FullDatabase {
  appConfig: AppConfig;
  vision: string;
  missions: string[];
  services: ServiceItem[];
  employees: Employee[];
  reports: PublicReport[];
  users: User[];
  geoInfo: GeoInfo;
  clusters: ClusterItem[];
  clusterAchievements: ClusterAchievement[];
  serviceDetails: Record<string, ServiceDetailContent>;
  exportedAt: string;
  version: string;
}

interface DatabaseManagementSectionProps {
  // Current State Data
  data: {
    appConfig: AppConfig;
    vision: string;
    missions: string[];
    services: ServiceItem[];
    employees: Employee[];
    reports: PublicReport[];
    users: User[];
    geoInfo: GeoInfo;
    clusters: ClusterItem[];
    clusterAchievements: ClusterAchievement[];
    serviceDetails: Record<string, ServiceDetailContent>;
  };
  onImport: (data: any) => void;
}

const DatabaseManagementSection: React.FC<DatabaseManagementSectionProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExportJSON = () => {
    const exportData: FullDatabase = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `puskesmas-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const escapeSql = (str: string | undefined | null) => {
    if (str === undefined || str === null) return 'NULL';
    // Escape single quotes and handle newlines
    return `'${String(str).replace(/'/g, "''").replace(/\n/g, "\\n")}'`;
  };

  const handleExportSQL = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    let sql = `-- Puskesmas Digital Profiler SQL Dump\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;
    sql += `BEGIN TRANSACTION;\n\n`;

    // 1. App Configuration & Meta Data
    sql += `-- Table: app_settings\n`;
    sql += `CREATE TABLE IF NOT EXISTS app_settings (key VARCHAR(255) PRIMARY KEY, value TEXT, section VARCHAR(50));\n`;
    
    // App Config
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('appName', ${escapeSql(data.appConfig.appName)}, 'config');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('tagline', ${escapeSql(data.appConfig.tagline)}, 'config');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('hero_title', ${escapeSql(data.appConfig.hero.title)}, 'hero');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('hero_subtitle', ${escapeSql(data.appConfig.hero.subtitle)}, 'hero');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('hero_image', ${escapeSql(data.appConfig.hero.imageUrl)}, 'hero');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('contact_address', ${escapeSql(data.appConfig.contact.address)}, 'contact');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('contact_phone', ${escapeSql(data.appConfig.contact.phone)}, 'contact');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('contact_email', ${escapeSql(data.appConfig.contact.email)}, 'contact');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('contact_hours', ${escapeSql(data.appConfig.contact.hours)}, 'contact');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('theme_bg', ${escapeSql(data.appConfig.theme?.background)}, 'theme');\n`;
    
    // Vision & Geo
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('vision', ${escapeSql(data.vision)}, 'profile');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('geo_desc', ${escapeSql(data.geoInfo.description)}, 'geo');\n`;
    sql += `INSERT INTO app_settings (key, value, section) VALUES ('geo_image', ${escapeSql(data.geoInfo.imageUrl)}, 'geo');\n`;

    // Missions
    sql += `\n-- Table: missions\n`;
    sql += `CREATE TABLE IF NOT EXISTS missions (id INTEGER PRIMARY KEY AUTOINCREMENT, statement TEXT);\n`;
    data.missions.forEach(m => {
        sql += `INSERT INTO missions (statement) VALUES (${escapeSql(m)});\n`;
    });

    // 2. Users
    sql += `\n-- Table: users\n`;
    sql += `CREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, username VARCHAR(50), password VARCHAR(255), name VARCHAR(100), role VARCHAR(20));\n`;
    data.users.forEach(u => {
        sql += `INSERT INTO users (id, username, password, name, role) VALUES (${escapeSql(u.id)}, ${escapeSql(u.username)}, ${escapeSql(u.password)}, ${escapeSql(u.name)}, ${escapeSql(u.role)});\n`;
    });

    // 3. Employees
    sql += `\n-- Table: employees\n`;
    sql += `CREATE TABLE IF NOT EXISTS employees (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), role VARCHAR(100), photo_url TEXT);\n`;
    data.employees.forEach(e => {
        sql += `INSERT INTO employees (id, name, role, photo_url) VALUES (${escapeSql(e.id)}, ${escapeSql(e.name)}, ${escapeSql(e.role)}, ${escapeSql(e.photoUrl)});\n`;
    });

    // 4. Services (General List)
    sql += `\n-- Table: services\n`;
    sql += `CREATE TABLE IF NOT EXISTS services (title VARCHAR(100), description TEXT, icon_name VARCHAR(50));\n`;
    data.services.forEach(s => {
        sql += `INSERT INTO services (title, description, icon_name) VALUES (${escapeSql(s.title)}, ${escapeSql(s.desc)}, ${escapeSql(s.iconName)});\n`;
    });

    // 5. Clusters
    sql += `\n-- Table: clusters\n`;
    sql += `CREATE TABLE IF NOT EXISTS clusters (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), description TEXT, icon_name VARCHAR(50));\n`;
    
    // 6. Cluster Services (Relational)
    sql += `\n-- Table: cluster_services\n`;
    sql += `CREATE TABLE IF NOT EXISTS cluster_services (cluster_id VARCHAR(50), service_name VARCHAR(100));\n`;

    data.clusters.forEach(c => {
        sql += `INSERT INTO clusters (id, name, description, icon_name) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.description)}, ${escapeSql(c.iconName)});\n`;
        c.services.forEach(s => {
            sql += `INSERT INTO cluster_services (cluster_id, service_name) VALUES (${escapeSql(c.id)}, ${escapeSql(s)});\n`;
        });
    });

    // 7. Cluster Achievements / Indicators
    sql += `\n-- Table: cluster_achievements\n`;
    sql += `CREATE TABLE IF NOT EXISTS cluster_achievements (
      id VARCHAR(50) PRIMARY KEY, 
      cluster_id VARCHAR(50), 
      service_name VARCHAR(100), 
      activity_name VARCHAR(100), 
      indicator VARCHAR(255), 
      target DECIMAL(10,2), 
      realization DECIMAL(10,2), 
      unit VARCHAR(20), 
      year VARCHAR(4), 
      month VARCHAR(20), 
      problems TEXT, 
      action_plan TEXT
    );\n`;
    data.clusterAchievements.forEach(a => {
        sql += `INSERT INTO cluster_achievements VALUES (
          ${escapeSql(a.id)}, ${escapeSql(a.clusterId)}, ${escapeSql(a.serviceName)}, ${escapeSql(a.activityName)}, 
          ${escapeSql(a.indicator)}, ${a.target}, ${a.realization}, ${escapeSql(a.unit)}, 
          ${escapeSql(a.year)}, ${escapeSql(a.month)}, ${escapeSql(a.problems)}, ${escapeSql(a.actionPlan)}
        );\n`;
    });

    // 8. Public Reports
    sql += `\n-- Table: public_reports\n`;
    sql += `CREATE TABLE IF NOT EXISTS public_reports (id VARCHAR(50) PRIMARY KEY, title VARCHAR(255), year VARCHAR(4), category VARCHAR(50), size VARCHAR(20));\n`;
    data.reports.forEach(r => {
        sql += `INSERT INTO public_reports (id, title, year, category, size) VALUES (${escapeSql(r.id)}, ${escapeSql(r.title)}, ${escapeSql(r.year)}, ${escapeSql(r.category)}, ${escapeSql(r.size)});\n`;
    });

    // 9. Service Details (Detailed Content)
    sql += `\n-- Table: service_details\n`;
    sql += `CREATE TABLE IF NOT EXISTS service_details (service_key VARCHAR(100) PRIMARY KEY, title VARCHAR(255), description TEXT, image_url TEXT);\n`;
    
    // 10. Service Activities (Relational)
    sql += `\n-- Table: service_detail_activities\n`;
    sql += `CREATE TABLE IF NOT EXISTS service_detail_activities (service_key VARCHAR(100), activity_name TEXT);\n`;

    Object.entries(data.serviceDetails).forEach(([key, content]) => {
        sql += `INSERT INTO service_details (service_key, title, description, image_url) VALUES (${escapeSql(key)}, ${escapeSql(content.title)}, ${escapeSql(content.description)}, ${escapeSql(content.imageUrl)});\n`;
        content.activities.forEach(act => {
             sql += `INSERT INTO service_detail_activities (service_key, activity_name) VALUES (${escapeSql(key)}, ${escapeSql(act)});\n`;
        });
    });

    sql += `\nCOMMIT;\n`;

    // Trigger Download
    const blob = new Blob([sql], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `puskesmas-dump-${dateStr}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('loading');
    setStatusMessage('Membaca file database...');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsedData = JSON.parse(result);

        // Basic validation
        if (!parsedData.appConfig || !parsedData.version) {
           throw new Error("Format file tidak valid. Pastikan file adalah hasil export JSON dari aplikasi ini.");
        }

        setStatusMessage('Memulihkan data...');
        setTimeout(() => {
           onImport(parsedData);
           setImportStatus('success');
           setStatusMessage(`Berhasil memulihkan database dari tanggal ${new Date(parsedData.exportedAt).toLocaleDateString()}.`);
           
           setTimeout(() => {
             setImportStatus('idle');
             setStatusMessage('');
           }, 5000);
        }, 800);

      } catch (err) {
        console.error(err);
        setImportStatus('error');
        setStatusMessage('Gagal memproses file. Pastikan menggunakan file backup JSON (bukan SQL).');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-20">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <Database className="mr-2 text-teal-600" /> Manajemen Database
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Backup dan Restore seluruh data aplikasi (Konten, Pengaturan, User, dan Capaian).
        </p>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
           {/* EXPORT SECTION */}
           <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col">
              <div className="flex items-center mb-4">
                 <div className="p-3 bg-teal-100 rounded-full mr-4 text-teal-600">
                    <Download className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Ekspor Data (Backup)</h4>
                    <p className="text-xs text-slate-500">Pilih format file backup yang diinginkan.</p>
                 </div>
              </div>
              <div className="flex-grow space-y-3 mb-6">
                 <p className="text-sm text-slate-600 leading-relaxed">
                    Gunakan <strong>JSON</strong> untuk backup & restore di aplikasi ini. Gunakan <strong>SQL</strong> untuk migrasi ke database eksternal (MySQL/PostgreSQL).
                 </p>
              </div>
              <div className="space-y-3">
                 <button 
                   onClick={handleExportJSON}
                   className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm flex items-center justify-center transition-colors"
                 >
                    <FileJson className="h-5 w-5 mr-2" /> Download Backup (.json)
                 </button>
                 <button 
                   onClick={handleExportSQL}
                   className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold shadow-sm flex items-center justify-center transition-colors"
                 >
                    <FileCode className="h-5 w-5 mr-2" /> Download Ekspor SQL (.sql)
                 </button>
              </div>
           </div>

           {/* IMPORT SECTION */}
           <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col">
              <div className="flex items-center mb-4">
                 <div className="p-3 bg-indigo-100 rounded-full mr-4 text-indigo-600">
                    <Upload className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Impor Data (Restore)</h4>
                    <p className="text-xs text-slate-500">Pulihkan data dari file backup sebelumnya.</p>
                 </div>
              </div>
              
              <div className="flex-grow">
                 <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                    <p className="text-xs text-yellow-700">
                       <strong>Perhatian:</strong> Proses ini akan menimpa seluruh data saat ini. Hanya mendukung file format <strong>.json</strong>.
                    </p>
                 </div>
              </div>

              <input 
                 type="file" 
                 accept=".json" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={handleFileChange}
              />

              <button 
                onClick={triggerImport}
                disabled={importStatus === 'loading'}
                className="w-full py-3 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 rounded-lg font-bold shadow-sm flex items-center justify-center transition-all"
              >
                 {importStatus === 'loading' ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin text-indigo-600" />
                 ) : (
                    <Upload className="h-5 w-5 mr-2" />
                 )}
                 {importStatus === 'loading' ? 'Memproses...' : 'Upload File JSON'}
              </button>

              {/* Status Feedback */}
              {importStatus === 'success' && (
                 <div className="mt-3 flex items-center text-xs font-bold text-green-600 animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    {statusMessage}
                 </div>
              )}
              {importStatus === 'error' && (
                 <div className="mt-3 flex items-center text-xs font-bold text-red-600 animate-fade-in">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    {statusMessage}
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagementSection;
