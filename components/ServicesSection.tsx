import React, { useState, useEffect } from 'react';
import { 
  Activity, Edit2, Save, X, Trash2, Plus
} from 'lucide-react';
import { ServiceItem } from '../types';
import { ICON_MAP } from '../constants';

interface ServicesSectionProps {
  data: ServiceItem[];
  onUpdate: (data: ServiceItem[]) => void;
  isReadOnly?: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  data, 
  onUpdate, 
  isReadOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempServices, setTempServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    if (!isEditing) {
      setTempServices([...data]);
    }
  }, [data, isEditing]);

  const handleEdit = () => {
    setTempServices([...data]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(tempServices);
    setIsEditing(false);
  };

  const handleChange = (index: number, field: keyof ServiceItem, value: string) => {
    const newServices = [...tempServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setTempServices(newServices);
  };

  const handleDelete = (index: number) => {
    const newServices = tempServices.filter((_, i) => i !== index);
    setTempServices(newServices);
  };

  const handleAdd = () => {
    setTempServices([
      ...tempServices, 
      { title: 'Layanan Baru', desc: 'Deskripsi layanan baru.', iconName: 'Activity' }
    ]);
  };

  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = ICON_MAP[iconName] || Activity;
    return <IconComponent className={className} />;
  };

  const displayList = isEditing ? tempServices : data;

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center">
          <Activity className="mr-2 text-teal-600"/> Layanan Kami
        </h3>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.map((service, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all ${isEditing ? 'ring-2 ring-teal-500/20 scale-[1.02]' : 'hover:shadow-md'}`}>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                     {renderIcon(service.iconName, "h-6 w-6 text-slate-500")}
                  </div>
                  <button 
                    onClick={() => handleDelete(idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Hapus Layanan"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Ikon</label>
                  <select
                    className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={service.iconName}
                    onChange={(e) => handleChange(idx, 'iconName', e.target.value)}
                  >
                    {Object.keys(ICON_MAP).map(iconKey => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Layanan</label>
                  <input
                    type="text"
                    className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 font-bold"
                    value={service.title}
                    onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={service.desc}
                    onChange={(e) => handleChange(idx, 'desc', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="h-12 w-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                  {renderIcon(service.iconName, "h-6 w-6 text-teal-600")}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{service.title}</h4>
                <p className="text-slate-600 text-sm">{service.desc}</p>
              </>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={handleAdd}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all min-h-[280px]"
          >
            <Plus className="h-10 w-10 mb-3" />
            <span className="font-medium">Tambah Layanan Baru</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
