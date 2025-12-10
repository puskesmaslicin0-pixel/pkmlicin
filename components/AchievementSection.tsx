import React, { useState } from 'react';
import { Plus, Trash2, Target, TrendingUp } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementSectionProps {
  initialData: Achievement[];
}

const AchievementSection: React.FC<AchievementSectionProps> = ({ initialData }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialData);
  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>({
    programName: '',
    target: 0,
    realization: 0,
    unit: '%',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (achievements.length + 1).toString() + Date.now();
    setAchievements([...achievements, { ...formData, id: newId }]);
    setFormData({
      programName: '',
      target: 0,
      realization: 0,
      unit: '%',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  const calculatePercentage = (realization: number, target: number) => {
    if (target === 0) return 0;
    return Math.round((realization / target) * 100);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <Target className="mr-2 h-5 w-5 text-teal-600" />
          Capaian Kinerja Program
        </h3>
        <p className="text-sm text-slate-500">Input dan monitoring realisasi target program puskesmas.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-200">
        <div className="flex items-center mb-4 text-sm font-semibold text-slate-700">
          <Plus className="h-4 w-4 mr-2" />
          Input Data Baru
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Nama Program</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2.5 border"
              placeholder="Contoh: Imunisasi Dasar Lengkap"
              value={formData.programName}
              onChange={e => setFormData({...formData, programName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target</label>
            <input
              type="number"
              required
              min="0"
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2.5 border"
              value={formData.target}
              onChange={e => setFormData({...formData, target: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Realisasi</label>
            <input
              type="number"
              required
              min="0"
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2.5 border"
              value={formData.realization}
              onChange={e => setFormData({...formData, realization: Number(e.target.value)})}
            />
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-700 mb-1">Satuan</label>
             <select
               className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2.5 border"
               value={formData.unit}
               onChange={e => setFormData({...formData, unit: e.target.value})}
             >
                <option value="%">%</option>
                <option value="Orang">Orang</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Dokumen">Dokumen</option>
                <option value="KK">KK</option>
             </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
           <button
             type="submit"
             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors shadow-sm"
           >
             <Plus className="h-4 w-4 mr-2" />
             Tambah Capaian
           </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Realisasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capaian (%)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {achievements.map((item) => {
              const percentage = calculatePercentage(item.realization, item.target);
              let statusColor = 'text-red-600 bg-red-50';
              if (percentage >= 80) statusColor = 'text-green-600 bg-green-50';
              else if (percentage >= 50) statusColor = 'text-yellow-600 bg-yellow-50';

              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.programName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.target} {item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.realization} {item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
                      {percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {achievements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 italic">
                  Belum ada data capaian. Silakan input data baru di atas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AchievementSection;