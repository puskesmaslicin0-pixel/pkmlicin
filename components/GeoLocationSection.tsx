
import React, { useState, useEffect, useRef } from 'react';
import { Map, Edit2, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
import { GeoInfo } from '../types';

interface GeoLocationSectionProps {
  data: GeoInfo;
  onUpdate: (data: GeoInfo) => void;
  isReadOnly?: boolean;
}

const GeoLocationSection: React.FC<GeoLocationSectionProps> = ({ 
  data, 
  onUpdate, 
  isReadOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<GeoInfo>(data);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setTempData(data);
    }
  }, [data, isEditing]);

  const handleEdit = () => {
    setTempData(data);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to roughly 2MB for browser performance in this demo)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Harap unggah gambar di bawah 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center">
          <Map className="mr-2 text-teal-600"/> Letak Geografis & Wilayah Kerja
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
                <Edit2 className="h-4 w-4 mr-2" /> Edit Info
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="md:flex">
          {/* Description Column */}
          <div className="p-6 md:w-1/2 flex flex-col">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
              Deskripsi Wilayah
            </h4>
            {isEditing ? (
              <textarea
                className="w-full h-64 p-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-slate-600 leading-relaxed resize-none"
                value={tempData.description}
                onChange={(e) => setTempData({...tempData, description: e.target.value})}
                placeholder="Deskripsikan letak geografis, batas wilayah, dan demografi..."
              />
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {data.description}
              </p>
            )}
          </div>

          {/* Map Image Column */}
          <div className="md:w-1/2 bg-slate-50 border-l border-slate-100">
             <div className="h-full min-h-[300px] relative group">
                {isEditing ? (
                  <div className="p-6 flex flex-col h-full justify-center space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL Gambar / Peta</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
                          value={tempData.imageUrl}
                          onChange={(e) => setTempData({...tempData, imageUrl: e.target.value})}
                          placeholder="https://..."
                        />
                     </div>
                     
                     <div className="text-center text-xs text-slate-400 font-medium">- ATAU -</div>

                     <div 
                        onClick={triggerFileInput}
                        className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl bg-white p-6 flex flex-col items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-colors"
                     >
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm font-medium text-slate-600">Unggah Foto (Maks 2MB)</span>
                        <input 
                           type="file" 
                           ref={fileInputRef}
                           onChange={handleFileChange}
                           accept="image/*"
                           className="hidden"
                        />
                     </div>
                  </div>
                ) : (
                  <>
                    <img 
                      src={data.imageUrl} 
                      alt="Peta Wilayah Kerja" 
                      className="w-full h-full object-cover min-h-[300px]"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Peta+Tidak+Tersedia")}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <p className="text-white font-medium flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" /> Peta Wilayah Kerja
                      </p>
                    </div>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoLocationSection;
