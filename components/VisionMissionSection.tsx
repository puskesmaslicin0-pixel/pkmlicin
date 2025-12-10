import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

interface VisionMissionSectionProps {
  vision: string;
  missions: string[];
  onUpdate: (vision: string, missions: string[]) => void;
  isReadOnly?: boolean;
}

const VisionMissionSection: React.FC<VisionMissionSectionProps> = ({ 
  vision, 
  missions, 
  onUpdate, 
  isReadOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Temporary state for editing
  const [tempVision, setTempVision] = useState(vision);
  const [tempMissions, setTempMissions] = useState<string[]>([]);

  // Sync temp state when editing starts or props change
  useEffect(() => {
    if (!isEditing) {
      setTempVision(vision);
      setTempMissions([...missions]);
    }
  }, [vision, missions, isEditing]);

  const handleEdit = () => {
    setTempVision(vision);
    setTempMissions([...missions]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(tempVision, tempMissions);
    setIsEditing(false);
  };

  const handleMissionChange = (index: number, value: string) => {
    const newMissions = [...tempMissions];
    newMissions[index] = value;
    setTempMissions(newMissions);
  };

  const addMission = () => {
    setTempMissions([...tempMissions, ""]);
  };

  const removeMission = (index: number) => {
    const newMissions = tempMissions.filter((_, i) => i !== index);
    setTempMissions(newMissions);
  };

  return (
    <div className="mb-20 relative group">
      {/* Section Header with Edit Actions */}
      <div className="flex justify-between items-start mb-8">
        <div></div> {/* Spacer for layout balance */}
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
                <Edit2 className="h-4 w-4 mr-2" /> Edit Visi Misi
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Vision Section */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Building2 className="mr-2 text-teal-600"/> Visi
          </h3>
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full ${isEditing ? 'ring-2 ring-teal-500/20' : ''}`}>
            {isEditing ? (
              <textarea
                className="w-full h-full min-h-[100px] p-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-slate-600 text-lg"
                value={tempVision}
                onChange={(e) => setTempVision(e.target.value)}
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "{vision}"
              </p>
            )}
          </div>
        </div>

        {/* Mission Section */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <CheckCircle2 className="mr-2 text-teal-600"/> Misi
          </h3>
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full ${isEditing ? 'ring-2 ring-teal-500/20' : ''}`}>
            {isEditing ? (
              <div className="space-y-3">
                {tempMissions.map((mission, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      className="flex-grow p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
                      value={mission}
                      onChange={(e) => handleMissionChange(idx, e.target.value)}
                    />
                    <button 
                      onClick={() => removeMission(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addMission}
                  className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center text-sm font-medium mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Misi
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start text-slate-600">
                    <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-bold text-xs mr-3 mt-0.5">{idx + 1}</span>
                    {mission}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMissionSection;
