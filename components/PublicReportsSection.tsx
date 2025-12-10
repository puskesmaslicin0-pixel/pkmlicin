
import React, { useState, useEffect } from 'react';
import { FileText, Download, FileBarChart, Edit2, Save, X, Trash2, Plus } from 'lucide-react';
import { PublicReport } from '../types';

interface PublicReportsSectionProps {
  data: PublicReport[];
  onUpdate: (data: PublicReport[]) => void;
  isReadOnly?: boolean;
}

const PublicReportsSection: React.FC<PublicReportsSectionProps> = ({ 
  data, 
  onUpdate, 
  isReadOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<PublicReport[]>([]);

  useEffect(() => {
    if (!isEditing) {
      setTempData([...data]);
    }
  }, [data, isEditing]);

  const handleEdit = () => {
    setTempData([...data]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleChange = (index: number, field: keyof PublicReport, value: string) => {
    const newData = [...tempData];
    newData[index] = { ...newData[index], [field]: value };
    setTempData(newData);
  };

  const handleDelete = (index: number) => {
    const newData = tempData.filter((_, i) => i !== index);
    setTempData(newData);
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    setTempData([
      ...tempData,
      {
        id: newId,
        title: 'Judul Laporan Baru',
        category: 'Umum',
        year: new Date().getFullYear().toString(),
        size: '1.0 MB'
      }
    ]);
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center">
          <FileText className="mr-2 text-teal-600"/> Laporan & Dokumen Publik
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
                <Edit2 className="h-4 w-4 mr-2" /> Edit Dokumen
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul Dokumen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tahun</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ukuran</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {(isEditing ? tempData : data).map((report, idx) => (
                <tr key={report.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex items-center">
                        <FileBarChart className="flex-shrink-0 h-5 w-5 text-slate-400 mr-3" />
                        <input 
                           type="text" 
                           className="w-full text-sm border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                           value={report.title}
                           onChange={(e) => handleChange(idx, 'title', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FileBarChart className="flex-shrink-0 h-5 w-5 text-slate-400 mr-3" />
                        <span className="text-sm font-medium text-slate-900">{report.title}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                       <input 
                          type="text" 
                          className="w-24 text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                          value={report.category}
                          onChange={(e) => handleChange(idx, 'category', e.target.value)}
                       />
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                        {report.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                     {isEditing ? (
                       <input 
                          type="text" 
                          className="w-16 text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                          value={report.year}
                          onChange={(e) => handleChange(idx, 'year', e.target.value)}
                       />
                    ) : report.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                     {isEditing ? (
                       <input 
                          type="text" 
                          className="w-16 text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500"
                          value={report.size}
                          onChange={(e) => handleChange(idx, 'size', e.target.value)}
                       />
                    ) : report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isEditing ? (
                      <button onClick={() => handleDelete(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <button className="text-teal-600 hover:text-teal-900 flex items-center justify-end ml-auto">
                        <Download className="h-4 w-4 mr-1" /> Unduh
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {isEditing && (
                 <tr>
                   <td colSpan={5} className="px-6 py-4">
                     <button
                        onClick={handleAdd}
                        className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Tambah Dokumen
                      </button>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublicReportsSection;
