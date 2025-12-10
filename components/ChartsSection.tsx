import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { PatientVisitData, DiseaseData } from '../types';

interface ChartsSectionProps {
  visitData: PatientVisitData[];
  diseaseData: DiseaseData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ visitData, diseaseData }) => {
  return (
    <div className="space-y-8">
      {/* Patient Visits Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Tren Kunjungan Pasien</h3>
          <p className="text-sm text-slate-500">Perbandingan pasien BPJS vs Umum (6 Bulan Terakhir)</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={visitData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="bpjs" name="BPJS" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="umum" name="Umum" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disease Top 5 Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-bold text-slate-800">5 Besar Penyakit</h3>
            <p className="text-sm text-slate-500">Jumlah kasus terlaporkan bulan ini</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={diseaseData}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fill: '#334155', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
              <Bar dataKey="cases" name="Jumlah Kasus" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;