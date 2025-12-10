
import React, { useState, useEffect, useRef } from 'react';
import { Users, Edit2, Save, X, Trash2, Plus, UserCircle, Upload } from 'lucide-react';
import { Employee } from '../types';

interface TeamSectionProps {
  data: Employee[];
  onUpdate: (data: Employee[]) => void;
  isReadOnly?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({ 
  data, 
  onUpdate, 
  isReadOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempEmployees, setTempEmployees] = useState<Employee[]>([]);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setTempEmployees([...data]);
    }
  }, [data, isEditing]);

  const handleEdit = () => {
    setTempEmployees([...data]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setActiveUploadIndex(null);
  };

  const handleSave = () => {
    onUpdate(tempEmployees);
    setIsEditing(false);
    setActiveUploadIndex(null);
  };

  const handleChange = (index: number, field: keyof Employee, value: string) => {
    const newEmployees = [...tempEmployees];
    newEmployees[index] = { ...newEmployees[index], [field]: value };
    setTempEmployees(newEmployees);
  };

  const handleDelete = (index: number) => {
    const newEmployees = tempEmployees.filter((_, i) => i !== index);
    setTempEmployees(newEmployees);
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    setTempEmployees([
      ...tempEmployees,
      {
        id: newId,
        name: 'Nama Pegawai',
        role: 'Jabatan',
        photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=300&h=300'
      }
    ]);
  };

  // Upload Logic
  const triggerFileUpload = (index: number) => {
    setActiveUploadIndex(index);
    if (fileInputRef.current) {
       fileInputRef.current.value = ''; // Reset to allow re-selecting same file
       fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeUploadIndex !== null) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Harap unggah gambar di bawah 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleChange(activeUploadIndex, 'photoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayList = isEditing ? tempEmployees : data;

  return (
    <div className="mb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center">
          <Users className="mr-2 text-teal-600" /> Struktur Organisasi
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
                <Edit2 className="h-4 w-4 mr-2" /> Edit Struktur
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayList.map((employee, idx) => (
          <div key={employee.id || idx} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group flex flex-col ${isEditing ? 'ring-2 ring-teal-500/20' : ''}`}>
            {isEditing ? (
              <>
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Pegawai #{idx + 1}</span>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4 space-y-3 flex-grow">
                   {/* Preview Image in Edit Mode with Upload Overlay */}
                   <div 
                      className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-200 mb-2 relative group cursor-pointer border-2 border-slate-200 hover:border-teal-500 transition-colors"
                      onClick={() => triggerFileUpload(idx)}
                      title="Klik untuk ganti foto"
                   >
                      <img 
                        src={employee.photoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} 
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Upload className="text-white h-6 w-6" />
                      </div>
                   </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">URL Foto (atau klik foto di atas)</label>
                    <div className="flex">
                       <input
                        type="text"
                        className="w-full text-xs border-slate-300 rounded-l-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        value={employee.photoUrl}
                        onChange={(e) => handleChange(idx, 'photoUrl', e.target.value)}
                        placeholder="https://..."
                      />
                      <button 
                         type="button"
                         onClick={() => triggerFileUpload(idx)}
                         className="px-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-md text-slate-600 hover:bg-slate-200"
                      >
                         <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nama</label>
                    <input
                      type="text"
                      className="w-full text-sm font-bold border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      value={employee.name}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Jabatan</label>
                    <input
                      type="text"
                      className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      value={employee.role}
                      onChange={(e) => handleChange(idx, 'role', e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="aspect-square overflow-hidden bg-slate-100 relative">
                  {employee.photoUrl ? (
                    <img
                      src={employee.photoUrl}
                      alt={employee.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 ${employee.photoUrl ? 'hidden' : ''}`}>
                    <UserCircle className="h-20 w-20" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 line-clamp-1" title={employee.name}>{employee.name}</h4>
                  <p className="text-teal-600 text-sm line-clamp-1" title={employee.role}>{employee.role}</p>
                </div>
              </>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={handleAdd}
            className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all min-h-[300px]"
          >
            <Plus className="h-10 w-10 mb-3" />
            <span className="font-medium">Tambah Pegawai</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamSection;
