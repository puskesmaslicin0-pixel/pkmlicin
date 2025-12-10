
import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, ArrowRight, Edit2, Plus, Trash2, X, Save, ChevronDown } from 'lucide-react';
import { ClusterItem, ClusterAchievement } from '../types';
import { ICON_MAP } from '../constants';

interface ClusterSectionProps {
  clusters: ClusterItem[];
  achievements: ClusterAchievement[]; 
  onUpdateAchievements: (achievements: ClusterAchievement[]) => void;
  onUpdateClusters?: (clusters: ClusterItem[]) => void;
  isReadOnly?: boolean;
  onServiceClick?: (serviceName: string) => void;
}

const ClusterSection: React.FC<ClusterSectionProps> = ({ 
  clusters, 
  onUpdateClusters,
  onServiceClick,
  isReadOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempClusters, setTempClusters] = useState<ClusterItem[]>(clusters);
  // State to track which accordion item is open
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setTempClusters([...clusters]);
    }
  }, [clusters, isEditing]);

  const handleEdit = () => {
    setTempClusters([...clusters]);
    setIsEditing(true);
    // Expand the first one by default when editing starts for better UX
    if (clusters.length > 0) {
      setExpandedId(clusters[0].id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setExpandedId(null);
  };

  const handleSave = () => {
    if (onUpdateClusters) {
      onUpdateClusters(tempClusters);
    }
    setIsEditing(false);
  };

  const handleClusterChange = (index: number, field: keyof ClusterItem, value: any) => {
    const newClusters = [...tempClusters];
    newClusters[index] = { ...newClusters[index], [field]: value };
    setTempClusters(newClusters);
  };

  const handleDeleteCluster = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion
    if(confirm('Hapus klaster ini? Semua data terkait mungkin akan hilang.')) {
      const newClusters = tempClusters.filter((_, i) => i !== index);
      setTempClusters(newClusters);
      if (expandedId === tempClusters[index].id) {
        setExpandedId(null);
      }
    }
  };

  const handleAddCluster = () => {
    const newId = Date.now().toString();
    const newCluster = {
      id: newId,
      name: 'Klaster Baru',
      description: 'Deskripsi klaster baru...',
      services: ['Layanan Baru'],
      iconName: 'FileText'
    };
    setTempClusters([...tempClusters, newCluster]);
    setExpandedId(newId); // Automatically open the new cluster
  };

  const handleServiceListChange = (clusterIndex: number, serviceIndex: number, value: string) => {
    const newClusters = [...tempClusters];
    const newServices = [...newClusters[clusterIndex].services];
    newServices[serviceIndex] = value;
    newClusters[clusterIndex].services = newServices;
    setTempClusters(newClusters);
  };

  const addService = (clusterIndex: number) => {
    const newClusters = [...tempClusters];
    if (!newClusters[clusterIndex].services) {
        newClusters[clusterIndex].services = [];
    }
    newClusters[clusterIndex].services.push("Layanan Baru");
    setTempClusters(newClusters);
  };

  const removeService = (clusterIndex: number, serviceIndex: number) => {
    const newClusters = [...tempClusters];
    newClusters[clusterIndex].services = newClusters[clusterIndex].services.filter((_, i) => i !== serviceIndex);
    setTempClusters(newClusters);
  };

  const toggleAccordion = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = ICON_MAP[iconName] || Layers;
    return <IconComponent className={className} />;
  };

  const displayList = isEditing ? tempClusters : clusters;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      {!isReadOnly && (
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <div className="flex space-x-2">
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
            </div>
          ) : (
            <button 
              onClick={handleEdit}
              className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-teal-600 hover:border-teal-200 transition-colors text-sm font-medium shadow-sm"
            >
              <Edit2 className="h-4 w-4 mr-2" /> Edit Klaster
            </button>
          )}
        </div>
      )}

      {displayList.map((cluster, clusterIdx) => {
        const isExpanded = expandedId === cluster.id;
        
        return (
          <div 
            key={cluster.id} 
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isExpanded ? 'border-teal-200 ring-1 ring-teal-100' : 'border-slate-200 hover:border-teal-200'}`}
          >
            {/* Accordion Header */}
            <div 
              onClick={() => toggleAccordion(cluster.id)}
              className={`p-4 md:p-6 cursor-pointer flex items-center justify-between ${isExpanded ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
            >
              <div className="flex items-center space-x-4 flex-grow">
                 <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isExpanded ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                    {renderIcon(cluster.iconName, "h-6 w-6")}
                 </div>
                 
                 <div className="flex-grow">
                    {isEditing ? (
                       <div className="flex flex-col md:flex-row md:items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <select 
                            className="text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 w-32"
                            value={cluster.iconName}
                            onChange={(e) => handleClusterChange(clusterIdx, 'iconName', e.target.value)}
                          >
                             {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                          </select>
                          <input 
                            type="text" 
                            className="text-lg font-bold border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 w-full md:w-auto"
                            value={cluster.name}
                            onChange={(e) => handleClusterChange(clusterIdx, 'name', e.target.value)}
                          />
                       </div>
                    ) : (
                       <h3 className={`text-lg font-bold ${isExpanded ? 'text-teal-900' : 'text-slate-900'}`}>
                         {cluster.name}
                       </h3>
                    )}
                    {!isExpanded && !isEditing && (
                       <p className="text-sm text-slate-500 truncate max-w-md hidden md:block">
                          {cluster.description}
                       </p>
                    )}
                 </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                 {isEditing && (
                    <button 
                      onClick={(e) => handleDeleteCluster(clusterIdx, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Hapus Klaster"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                 )}
                 <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-6 w-6 text-slate-400" />
                 </div>
              </div>
            </div>

            {/* Accordion Body */}
            {isExpanded && (
              <div className="flex flex-col md:flex-row animate-fade-in">
                {/* Left: Cluster Info */}
                <div className="p-6 md:w-2/5 bg-slate-50/50 border-r border-slate-100 flex flex-col">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Deskripsi</h4>
                  {isEditing ? (
                     <textarea 
                        className="w-full h-32 p-3 border border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-600 leading-relaxed"
                        value={cluster.description}
                        onChange={(e) => handleClusterChange(clusterIdx, 'description', e.target.value)}
                     />
                  ) : (
                    <p className="text-slate-600 leading-relaxed flex-grow">
                      {cluster.description}
                    </p>
                  )}
                </div>

                {/* Right: Services List */}
                <div className="p-6 md:w-3/5 bg-white">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                     Layanan Tersedia
                   </h4>
                   <ul className="grid grid-cols-1 gap-3">
                      {cluster.services.map((service, serviceIdx) => (
                        <li key={serviceIdx}>
                          {isEditing ? (
                            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                               <div className="p-1.5 bg-white rounded border border-slate-200 text-slate-400">
                                  <Edit2 className="h-4 w-4" />
                               </div>
                               <input 
                                  type="text" 
                                  className="w-full text-sm border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 font-medium"
                                  value={service}
                                  onChange={(e) => handleServiceListChange(clusterIdx, serviceIdx, e.target.value)}
                                  placeholder="Nama Layanan"
                               />
                               <button 
                                 onClick={() => removeService(clusterIdx, serviceIdx)} 
                                 className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                 title="Hapus Layanan"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => onServiceClick && onServiceClick(service)}
                              className={`flex items-start p-3 w-full text-left rounded-lg group border border-slate-100 transition-all ${
                                isReadOnly 
                                  ? 'hover:bg-teal-50 hover:border-teal-200 shadow-sm hover:shadow' 
                                  : 'hover:bg-indigo-50 hover:border-indigo-100 bg-slate-50'
                              }`}
                            >
                              {isReadOnly ? (
                                <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Edit2 className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-grow flex justify-between items-center">
                                 <span className={`font-medium ${isReadOnly ? 'text-slate-700 group-hover:text-teal-700' : 'text-slate-800 group-hover:text-indigo-800'}`}>
                                   {service}
                                 </span>
                                 <span className={`text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity ${isReadOnly ? 'text-teal-600' : 'text-indigo-500 font-medium'}`}>
                                   {isReadOnly ? (
                                     <>Lihat <ArrowRight className="h-3 w-3 ml-1" /></>
                                   ) : (
                                     <>Edit <Edit2 className="h-3 w-3 ml-1" /></>
                                   )}
                                 </span>
                              </div>
                            </button>
                          )}
                        </li>
                      ))}
                   </ul>

                   {/* Add Service Button (Only in Edit Mode) */}
                   {isEditing && (
                     <button
                        onClick={() => addService(clusterIdx)}
                        className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all flex items-center justify-center text-sm font-bold"
                     >
                        <Plus className="h-4 w-4 mr-2" /> Tambah Layanan
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {isEditing && (
        <button
          onClick={handleAddCluster}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-center text-slate-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="font-medium">Tambah Klaster Baru</span>
        </button>
      )}
    </div>
  );
};

export default ClusterSection;
