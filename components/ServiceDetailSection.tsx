



import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Edit2, Save, X, Plus, Trash2, Activity, Target, Check } from 'lucide-react';
import { ServiceDetailContent, ClusterAchievement } from '../types';

interface ServiceDetailSectionProps {
  content: ServiceDetailContent;
  serviceName: string; // Passed to link achievements
  clusterId?: string; // Need cluster ID to associate new achievements
  onBack: () => void;
  onUpdate: (updatedContent: ServiceDetailContent) => void;
  isReadOnly?: boolean;
  
  // Props for Achievements
  achievements: ClusterAchievement[];
  onUpdateAchievements: (achievements: ClusterAchievement[]) => void;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const ServiceDetailSection: React.FC<ServiceDetailSectionProps> = ({ 
  content, 
  serviceName,
  clusterId,
  onBack, 
  onUpdate,
  isReadOnly = false,
  achievements,
  onUpdateAchievements
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState<ServiceDetailContent>(content);
  
  // Activity Selection State for Filtering
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // Achievement Form State
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [newAch, setNewAch] = useState<Partial<ClusterAchievement>>({
      indicator: '', target: 0, realization: 0, unit: '%', year: currentYear, month: currentMonth, problems: '', actionPlan: '', activityName: ''
  });

  // Achievement Editing State
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [editAch, setEditAch] = useState<Partial<ClusterAchievement>>({});

  useEffect(() => {
    if (!isEditing) {
      setTempContent(content);
    }
  }, [content, isEditing]);

  const handleEdit = () => {
    setTempContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(tempContent);
    setIsEditing(false);
  };

  // Content Updates
  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...tempContent.activities];
    newActivities[index] = value;
    setTempContent({ ...tempContent, activities: newActivities });
  };

  const addActivity = () => {
    setTempContent({ ...tempContent, activities: [...tempContent.activities, ""] });
  };

  const removeActivity = (index: number) => {
    setTempContent({ ...tempContent, activities: tempContent.activities.filter((_, i) => i !== index) });
  };

  // Filter Logic
  const handleActivityClick = (activity: string) => {
    // Toggle selection
    if (selectedActivity === activity) {
      setSelectedActivity(null);
    } else {
      setSelectedActivity(activity);
    }
  };

  // Achievement Logic
  const serviceAchievements = achievements.filter(a => a.serviceName === serviceName);
  
  // Apply Filter based on Selected Activity
  const filteredAchievements = selectedActivity 
    ? serviceAchievements.filter(a => a.activityName === selectedActivity)
    : serviceAchievements;

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // Sort by Year descending
    if (b.year !== a.year) return b.year.localeCompare(a.year);
    // Sort by Month index
    return MONTHS.indexOf(b.month || '') - MONTHS.indexOf(a.month || '');
  });

  const handleAddAchievement = () => {
    if (!newAch.indicator || !newAch.target) return;

    const newAchievementItem: ClusterAchievement = {
      id: Date.now().toString(),
      clusterId: clusterId || '0', // Default if not found
      serviceName: serviceName,
      activityName: newAch.activityName || '', // Save link to activity
      indicator: newAch.indicator || '',
      target: Number(newAch.target) || 0,
      realization: Number(newAch.realization) || 0,
      unit: newAch.unit || '%',
      year: newAch.year || currentYear,
      month: newAch.month || currentMonth,
      problems: newAch.problems || '',
      actionPlan: newAch.actionPlan || ''
    };

    onUpdateAchievements([...achievements, newAchievementItem]);
    setNewAch({ indicator: '', target: 0, realization: 0, unit: '%', year: currentYear, month: currentMonth, problems: '', actionPlan: '', activityName: '' });
  };

  const handleDeleteAchievement = (id: string) => {
    if(confirm('Hapus indikator kinerja ini?')) {
      onUpdateAchievements(achievements.filter(a => a.id !== id));
    }
  };

  const handleStartEditAchievement = (ach: ClusterAchievement) => {
    setEditingAchievementId(ach.id);
    setEditAch({ ...ach });
  };

  const handleCancelEditAchievement = () => {
    setEditingAchievementId(null);
    setEditAch({});
  };

  const handleSaveEditAchievement = () => {
    if (!editAch.indicator || editAch.target === undefined) return;

    const updatedList = achievements.map(a => 
      a.id === editingAchievementId ? { ...a, ...editAch } as ClusterAchievement : a
    );
    
    onUpdateAchievements(updatedList);
    setEditingAchievementId(null);
    setEditAch({});
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="flex items-center text-slate-600 hover:text-teal-600 transition-colors font-medium mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Kembali
            </button>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 truncate max-w-md">
              {isEditing ? (
                  <input 
                    type="text" 
                    className="border-b border-slate-300 focus:border-teal-500 outline-none bg-transparent w-full"
                    value={tempContent.title}
                    onChange={(e) => setTempContent({...tempContent, title: e.target.value})}
                  />
              ) : content.title}
            </h1>
          </div>

          {!isReadOnly && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <X className="h-4 w-4 mr-2" /> Batal
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <Save className="h-4 w-4 mr-2" /> Simpan
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEdit}
                  className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-teal-600 hover:border-teal-200 transition-colors text-sm font-medium shadow-sm"
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Layanan
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Main Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 w-full bg-slate-100 group">
             {isEditing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6">
                   <p className="text-sm font-semibold text-slate-500 mb-2">URL Gambar Hero</p>
                   <input 
                      type="text" 
                      className="w-full max-w-lg p-2 border border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 text-sm"
                      value={tempContent.imageUrl}
                      onChange={(e) => setTempContent({...tempContent, imageUrl: e.target.value})}
                      placeholder="https://..."
                   />
                </div>
             ) : (
               <>
                 <img 
                   src={content.imageUrl} 
                   alt={content.title} 
                   className="w-full h-full object-cover"
                   onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000&h=600")}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 text-white">
                   <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-600/90 text-sm font-medium backdrop-blur-sm mb-2">
                     <FileText className="h-4 w-4 mr-2" />
                     Layanan Terintegrasi
                   </div>
                 </div>
               </>
             )}
          </div>

          <div className="p-8 md:p-10">
            {/* Description */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Deskripsi Layanan</h3>
              {isEditing ? (
                <textarea 
                  className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-slate-600 leading-relaxed"
                  value={tempContent.description}
                  onChange={(e) => setTempContent({...tempContent, description: e.target.value})}
                />
              ) : (
                <div className="prose prose-lg text-slate-600 max-w-none">
                  <p className="leading-relaxed whitespace-pre-line">{content.description}</p>
                </div>
              )}
            </div>

            {/* Activities / Scope */}
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 flex items-center">
                     <CheckCircle2 className="h-6 w-6 text-teal-600 mr-3" />
                     Lingkup Kegiatan & Pelayanan
                   </h3>
                   <p className="text-sm text-slate-500 mt-2 ml-9">
                      Klik salah satu item di bawah untuk memfilter indikator kinerja terkait.
                   </p>
                </div>
                {selectedActivity && (
                   <button 
                     onClick={() => setSelectedActivity(null)}
                     className="text-xs bg-white border border-slate-300 px-3 py-1 rounded-full shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
                   >
                     Tampilkan Semua
                   </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {(isEditing ? tempContent.activities : content.activities).map((activity, idx) => {
                  const isSelected = selectedActivity === activity;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => !isEditing && handleActivityChange && handleActivityClick(activity)}
                      className={`flex items-start p-4 rounded-lg border transition-all relative group cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-50 border-teal-500 shadow-md ring-1 ring-teal-500' 
                          : 'bg-white border-slate-200 shadow-sm hover:border-teal-300'
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-600'
                      }`}>
                        {idx + 1}
                      </div>
                      
                      {isEditing ? (
                        <div className="flex-grow flex items-center" onClick={(e) => e.stopPropagation()}>
                           <input 
                              type="text" 
                              className="w-full border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 text-sm p-1"
                              value={activity}
                              onChange={(e) => handleActivityChange(idx, e.target.value)}
                           />
                           <button onClick={() => removeActivity(idx)} className="ml-2 text-red-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      ) : (
                        <span className={`font-medium ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>{activity}</span>
                      )}
                      
                      {isSelected && (
                         <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-teal-600" />
                         </div>
                      )}
                    </div>
                  );
                })}
                
                {isEditing && (
                  <button 
                    onClick={addActivity}
                    className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Tambah Kegiatan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicators Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
            <div className="flex items-center mb-6 border-b border-slate-100 pb-4 justify-between">
              <div className="flex items-center">
                 <div className="p-2 bg-teal-50 rounded-lg mr-3">
                    <Target className="h-6 w-6 text-teal-600" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-900">Indikator Kinerja & Target</h3>
                   <p className="text-sm text-slate-500">
                     {selectedActivity ? `Menampilkan indikator untuk: "${selectedActivity}"` : "Monitoring seluruh capaian layanan."}
                   </p>
                 </div>
              </div>
            </div>

            {sortedAchievements.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Periode</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Indikator</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Lingkup Kegiatan</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Target</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Realisasi</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Capaian</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase min-w-[150px]">Permasalahan</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase min-w-[150px]">Tindak Lanjut</th>
                        {!isReadOnly && <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sortedAchievements.map((ach) => {
                        const percent = ach.target > 0 ? Math.round((ach.realization / ach.target) * 100) : 0;
                        let colorClass = 'text-red-600 bg-red-50';
                        if (percent >= 80) colorClass = 'text-green-600 bg-green-50';
                        else if (percent >= 50) colorClass = 'text-yellow-600 bg-yellow-50';

                        const isEditingRow = editingAchievementId === ach.id;

                        if (isEditingRow) {
                           return (
                              <tr key={ach.id} className="bg-teal-50/50">
                                <td className="px-4 py-3 align-top">
                                   <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                                      <select
                                          className="w-full text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                          value={editAch.month}
                                          onChange={(e) => setEditAch({...editAch, month: e.target.value})}
                                      >
                                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                      </select>
                                      <select
                                          className="w-20 text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                          value={editAch.year}
                                          onChange={(e) => setEditAch({...editAch, year: e.target.value})}
                                      >
                                          <option value="2023">2023</option>
                                          <option value="2024">2024</option>
                                          <option value="2025">2025</option>
                                      </select>
                                   </div>
                                </td>
                                <td className="px-4 py-3 align-top">
                                   <input 
                                      type="text" 
                                      className="w-full text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                      value={editAch.indicator}
                                      onChange={(e) => setEditAch({...editAch, indicator: e.target.value})}
                                   />
                                </td>
                                <td className="px-4 py-3 align-top">
                                   <select
                                     className="w-full text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                     value={editAch.activityName || ''}
                                     onChange={(e) => setEditAch({...editAch, activityName: e.target.value})}
                                   >
                                      <option value="">- Pilih Kegiatan -</option>
                                      {content.activities.map((act, i) => (
                                         <option key={i} value={act}>{act}</option>
                                      ))}
                                   </select>
                                </td>
                                <td className="px-4 py-3 align-top">
                                   <input 
                                      type="number" 
                                      className="w-full text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                      value={editAch.target}
                                      onChange={(e) => setEditAch({...editAch, target: Number(e.target.value)})}
                                   />
                                </td>
                                <td className="px-4 py-3 align-top">
                                   <div className="flex">
                                      <input 
                                          type="number" 
                                          className="w-full text-xs border-slate-300 rounded-l focus:ring-teal-500 focus:border-teal-500"
                                          value={editAch.realization}
                                          onChange={(e) => setEditAch({...editAch, realization: Number(e.target.value)})}
                                      />
                                      <select 
                                         className="text-xs border-l-0 border-slate-300 rounded-r bg-white focus:ring-teal-500 focus:border-teal-500"
                                         value={editAch.unit}
                                         onChange={(e) => setEditAch({...editAch, unit: e.target.value})}
                                       >
                                          <option value="%">%</option>
                                          <option value="Orang">Org</option>
                                          <option value="KK">KK</option>
                                       </select>
                                   </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-400 italic align-middle">
                                   Auto
                                </td>
                                <td className="px-4 py-3 align-top">
                                   <textarea 
                                      className="w-full text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                      rows={2}
                                      value={editAch.problems || ''}
                                      onChange={(e) => setEditAch({...editAch, problems: e.target.value})}
                                   />
                                </td>
                                <td className="px-4 py-3 align-top">
                                   <textarea 
                                      className="w-full text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                                      rows={2}
                                      value={editAch.actionPlan || ''}
                                      onChange={(e) => setEditAch({...editAch, actionPlan: e.target.value})}
                                   />
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap align-top">
                                   <div className="flex justify-end space-x-1">
                                      <button onClick={handleSaveEditAchievement} className="text-green-600 hover:text-green-800 p-1" title="Simpan">
                                        <Check className="h-4 w-4" />
                                      </button>
                                      <button onClick={handleCancelEditAchievement} className="text-slate-400 hover:text-slate-600 p-1" title="Batal">
                                        <X className="h-4 w-4" />
                                      </button>
                                   </div>
                                </td>
                              </tr>
                           );
                        }

                        return (
                          <tr key={ach.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-700">
                              {ach.month ? ach.month : ''} {ach.year}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{ach.indicator}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                               {ach.activityName ? (
                                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 block truncate max-w-[150px]" title={ach.activityName}>
                                     {ach.activityName}
                                  </span>
                               ) : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">{ach.target} {ach.unit}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{ach.realization} {ach.unit}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${colorClass}`}>
                                {percent}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                               {ach.problems || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                               {ach.actionPlan || '-'}
                            </td>
                            {!isReadOnly && (
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex justify-end space-x-1">
                                   <button 
                                      onClick={() => handleStartEditAchievement(ach)} 
                                      className="text-indigo-400 hover:text-indigo-600 p-1"
                                      title="Edit"
                                   >
                                      <Edit2 className="h-4 w-4" />
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteAchievement(ach.id)} 
                                      className="text-slate-400 hover:text-red-500 p-1"
                                      title="Hapus"
                                   >
                                      <Trash2 className="h-4 w-4" />
                                   </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Activity className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 italic">
                     {selectedActivity ? "Tidak ada indikator untuk kegiatan ini." : "Belum ada data indikator kinerja untuk layanan ini."}
                  </p>
                  {selectedActivity && (
                     <button onClick={() => setSelectedActivity(null)} className="text-teal-600 text-sm font-bold mt-2 hover:underline">
                        Tampilkan Semua
                     </button>
                  )}
                </div>
            )}

            {/* Add New Indicator Form (Admin Only) */}
            {!isReadOnly && !editingAchievementId && (
                <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-teal-100">
                  <h5 className="text-sm font-bold text-teal-800 mb-4 flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Tambah Indikator Baru
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                     <div className="md:col-span-2">
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nama Indikator</label>
                       <input 
                         type="text" 
                         className="w-full text-sm border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                         placeholder="Contoh: Cakupan Pasien"
                         value={newAch.indicator}
                         onChange={(e) => setNewAch({...newAch, indicator: e.target.value})}
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Lingkup Kegiatan (Opsional)</label>
                       <select
                         className="w-full text-sm border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                         value={newAch.activityName || ''}
                         onChange={(e) => setNewAch({...newAch, activityName: e.target.value})}
                       >
                          <option value="">- Pilih Kegiatan Terkait -</option>
                          {content.activities.map((act, i) => (
                             <option key={i} value={act}>{act}</option>
                          ))}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target</label>
                       <input 
                         type="number" 
                         className="w-full text-sm border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                         value={newAch.target}
                         onChange={(e) => setNewAch({...newAch, target: Number(e.target.value)})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Realisasi</label>
                       <div className="flex">
                         <input 
                           type="number" 
                           className="w-full text-sm border-slate-300 rounded-l-lg focus:ring-teal-500 focus:border-teal-500"
                           value={newAch.realization}
                           onChange={(e) => setNewAch({...newAch, realization: Number(e.target.value)})}
                         />
                         <select 
                           className="text-sm border-l-0 border-slate-300 rounded-r-lg bg-slate-100 focus:ring-teal-500 focus:border-teal-500"
                           value={newAch.unit}
                           onChange={(e) => setNewAch({...newAch, unit: e.target.value})}
                         >
                            <option value="%">%</option>
                            <option value="Orang">Org</option>
                            <option value="KK">KK</option>
                         </select>
                       </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Periode</label>
                        <div className="flex space-x-1">
                          <select
                            className="w-full text-xs border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            value={newAch.month}
                            onChange={(e) => setNewAch({...newAch, month: e.target.value})}
                          >
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select
                            className="w-20 text-xs border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            value={newAch.year}
                            onChange={(e) => setNewAch({...newAch, year: e.target.value})}
                          >
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                          </select>
                        </div>
                    </div>
                    
                    {/* New Fields: Problems & Action Plan */}
                    <div className="md:col-span-3">
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Permasalahan</label>
                       <textarea 
                         className="w-full text-sm border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                         rows={2}
                         placeholder="Deskripsi masalah jika target tidak tercapai..."
                         value={newAch.problems || ''}
                         onChange={(e) => setNewAch({...newAch, problems: e.target.value})}
                       />
                    </div>
                    <div className="md:col-span-3">
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rencana Tindak Lanjut</label>
                       <textarea 
                         className="w-full text-sm border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                         rows={2}
                         placeholder="Langkah perbaikan yang akan dilakukan..."
                         value={newAch.actionPlan || ''}
                         onChange={(e) => setNewAch({...newAch, actionPlan: e.target.value})}
                       />
                    </div>

                    <div className="md:col-span-6 flex justify-end mt-2">
                      <button 
                        onClick={handleAddAchievement}
                        className="px-6 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 shadow-sm transition-colors"
                      >
                        Tambah Indikator
                      </button>
                    </div>
                  </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailSection;
