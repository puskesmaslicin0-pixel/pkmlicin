
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, LabelList
} from 'recharts';
import { Filter, TrendingUp, Table as TableIcon, Layers, Target, Calendar } from 'lucide-react';
import { ClusterItem, ClusterAchievement } from '../types';
import { ICON_MAP } from '../constants';

interface HomeChartsSectionProps {
  clusters: ClusterItem[];
  achievements: ClusterAchievement[];
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const COLORS = ['#0d9488', '#ec4899', '#f59e0b', '#6366f1', '#10b981', '#ef4444', '#8b5cf6', '#14b8a6'];

const HomeChartsSection: React.FC<HomeChartsSectionProps> = ({ clusters, achievements }) => {
  // Extract available years from data
  const years = useMemo(() => {
    const uniqueYears = [...new Set(achievements.map(a => a.year))];
    return uniqueYears.sort((a: string, b: string) => b.localeCompare(a));
  }, [achievements]);

  const [selectedYear, setSelectedYear] = useState<string>(years[0] || new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('all');
  const [selectedIndicator, setSelectedIndicator] = useState<string>('all');

  // Reset indicator when cluster or year changes to avoid invalid selections
  useEffect(() => {
    setSelectedIndicator('all');
  }, [selectedClusterId, selectedYear, selectedMonth]);

  // Determine Drill-Down Mode
  // If a specific Cluster is selected BUT "All Indicators" is selected, we drill down to show Indicators.
  const isDrillDown = selectedClusterId !== 'all' && selectedIndicator === 'all';

  // Filter clusters based on selection
  const filteredClusters = useMemo(() => {
    if (selectedClusterId === 'all') return clusters;
    return clusters.filter(c => c.id === selectedClusterId);
  }, [clusters, selectedClusterId]);

  // Get available indicators based on current selection
  const availableIndicators = useMemo(() => {
    let relevant = achievements.filter(a => a.year === selectedYear);
    
    if (selectedMonth !== 'all') {
      relevant = relevant.filter(a => a.month === selectedMonth);
    }

    if (selectedClusterId !== 'all') {
      relevant = relevant.filter(a => a.clusterId === selectedClusterId);
    }
    const unique = [...new Set(relevant.map(a => a.indicator))];
    return unique.sort();
  }, [achievements, selectedYear, selectedMonth, selectedClusterId]);

  // 1. Prepare Line Chart Data (Trend View - Used when Month == 'all')
  const lineChartData = useMemo(() => {
    if (selectedMonth !== 'all') return [];

    return MONTHS.map(month => {
      const dataPoint: any = { month: month.substring(0, 3) };

      if (isDrillDown) {
        // DRILL DOWN: Show lines for each Indicator in the selected cluster
        availableIndicators.forEach(ind => {
           const item = achievements.find(
             a => a.clusterId === selectedClusterId && 
                  a.year === selectedYear && 
                  a.month === month && 
                  a.indicator === ind
           );
           
           if (item && item.target > 0) {
              const p = (item.realization / item.target) * 100;
              dataPoint[ind] = Math.round(p > 100 ? 100 : p);
           } else {
              dataPoint[ind] = null;
           }
        });
      } else {
        // STANDARD: Show lines for each Cluster
        filteredClusters.forEach(cluster => {
          let clusterItems = achievements.filter(
            a => a.clusterId === cluster.id && a.year === selectedYear && a.month === month
          );

          if (selectedIndicator !== 'all') {
            clusterItems = clusterItems.filter(a => a.indicator === selectedIndicator);
          }

          if (clusterItems.length > 0) {
            const totalPercentage = clusterItems.reduce((acc, curr) => {
              if (curr.target === 0) return acc;
              const rawPercent = (curr.realization / curr.target) * 100;
              const percent = rawPercent > 100 ? 100 : rawPercent;
              return acc + percent;
            }, 0);
            dataPoint[cluster.name.split(':')[0]] = Math.round(totalPercentage / clusterItems.length);
          } else {
            dataPoint[cluster.name.split(':')[0]] = null;
          }
        });
      }
      return dataPoint;
    });
  }, [filteredClusters, achievements, selectedYear, selectedIndicator, selectedMonth, isDrillDown, availableIndicators, selectedClusterId]);

  // 2. Prepare Bar Chart Data (Snapshot View - Used when Month != 'all')
  const barChartData = useMemo(() => {
    if (selectedMonth === 'all') return [];

    if (isDrillDown) {
      // DRILL DOWN: Bars are Indicators
      return availableIndicators.map((ind, index) => {
        const item = achievements.find(
          a => a.clusterId === selectedClusterId &&
               a.year === selectedYear &&
               a.month === selectedMonth &&
               a.indicator === ind
        );
        
        let val = 0;
        if (item && item.target > 0) {
           const p = (item.realization / item.target) * 100;
           val = Math.round(p > 100 ? 100 : p);
        }

        return {
          name: ind,
          fullName: ind,
          value: val,
          color: COLORS[index % COLORS.length]
        };
      });
    } else {
      // STANDARD: Bars are Clusters
      return filteredClusters.map((cluster, index) => {
        let clusterItems = achievements.filter(
          a => a.clusterId === cluster.id && a.year === selectedYear && a.month === selectedMonth
        );

        if (selectedIndicator !== 'all') {
          clusterItems = clusterItems.filter(a => a.indicator === selectedIndicator);
        }

        let avg = 0;
        if (clusterItems.length > 0) {
          const total = clusterItems.reduce((acc, curr) => {
             if (curr.target === 0) return acc;
             let p = (curr.realization / curr.target) * 100;
             return acc + (p > 100 ? 100 : p);
          }, 0);
          avg = Math.round(total / clusterItems.length);
        }

        // Use consistent cluster color
        const originalIndex = clusters.findIndex(c => c.id === cluster.id);
        
        return {
          name: cluster.name.split(':')[0],
          fullName: cluster.name,
          value: avg,
          color: COLORS[originalIndex % COLORS.length]
        };
      });
    }
  }, [filteredClusters, clusters, achievements, selectedYear, selectedMonth, selectedIndicator, isDrillDown, availableIndicators, selectedClusterId]);

  // 3. Prepare Table Data
  const tableData = useMemo(() => {
    if (isDrillDown) {
       // DRILL DOWN: Rows are Indicators
       return availableIndicators.map((ind, index) => {
          // Get all records for this indicator (across selected timeframe)
          let relevantItems = achievements.filter(
             a => a.clusterId === selectedClusterId && a.year === selectedYear && a.indicator === ind
          );
          
          if (selectedMonth !== 'all') {
             relevantItems = relevantItems.filter(a => a.month === selectedMonth);
          }

          if (relevantItems.length === 0) return null;

          // Calculate Average for this Indicator
          const totalPercent = relevantItems.reduce((acc, curr) => {
            if (curr.target === 0) return acc;
            let p = (curr.realization / curr.target) * 100;
            return acc + (p > 100 ? 100 : p); 
          }, 0);

          const avgScore = totalPercent / relevantItems.length;

          // Aggregate text fields (Problems & Action Plans)
          const problems = [...new Set(relevantItems.map(i => i.problems).filter(p => p && p.trim() !== ''))];
          const actionPlans = [...new Set(relevantItems.map(i => i.actionPlan).filter(p => p && p.trim() !== ''))];

          return {
             id: ind,
             name: ind,
             iconName: 'Target', // Indicator icon
             avgScore: avgScore,
             gap: 100 - avgScore,
             count: relevantItems.length,
             color: COLORS[index % COLORS.length], // Match chart color
             problems: problems,
             actionPlans: actionPlans
          };
       }).filter(Boolean); // Remove nulls
    } else {
       // STANDARD: Rows are Clusters
       return filteredClusters.map((cluster, index) => {
        let clusterItems = achievements.filter(
          a => a.clusterId === cluster.id && a.year === selectedYear
        );

        if (selectedMonth !== 'all') {
          clusterItems = clusterItems.filter(a => a.month === selectedMonth);
        }

        if (selectedIndicator !== 'all') {
          clusterItems = clusterItems.filter(a => a.indicator === selectedIndicator);
        }

        if (clusterItems.length === 0) {
          return { 
            id: cluster.id,
            name: cluster.name, 
            iconName: cluster.iconName,
            avgScore: 0, 
            gap: 100, 
            count: 0,
            color: '#cbd5e1',
            problems: [],
            actionPlans: []
          };
        }

        const totalPercent = clusterItems.reduce((acc, curr) => {
          if (curr.target === 0) return acc;
          let p = (curr.realization / curr.target) * 100;
          return acc + (p > 100 ? 100 : p); 
        }, 0);

        const avgScore = totalPercent / clusterItems.length;
        
        // Find original index for consistent color
        const originalIndex = clusters.findIndex(c => c.id === cluster.id);

        // Aggregate text fields for the Cluster summary
        const problems = [...new Set(clusterItems.map(i => i.problems).filter(p => p && p.trim() !== ''))];
        const actionPlans = [...new Set(clusterItems.map(i => i.actionPlan).filter(p => p && p.trim() !== ''))];

        return {
          id: cluster.id,
          name: cluster.name,
          iconName: cluster.iconName,
          avgScore: avgScore,
          gap: 100 - avgScore,
          count: clusterItems.length,
          color: COLORS[originalIndex % COLORS.length],
          problems: problems,
          actionPlans: actionPlans
        };
      });
    }
  }, [filteredClusters, achievements, selectedYear, selectedMonth, selectedIndicator, isDrillDown, availableIndicators, selectedClusterId, clusters]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
             entry.value !== null && (
              <p key={index} style={{ color: entry.color || entry.payload.color }} className="flex justify-between w-48 space-x-4">
                <span className="truncate">{entry.name}:</span>
                <span className="font-bold">{entry.value}%</span>
              </p>
             )
          ))}
        </div>
      );
    }
    return null;
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || Layers;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="bg-white py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 mb-2">
               <TrendingUp className="h-5 w-5" />
               <span className="text-sm font-bold uppercase tracking-wider">Dashboard Kinerja</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Grafik & Analisis Capaian (ILP)</h2>
            <p className="mt-2 text-slate-600">
              Monitoring kinerja integrasi layanan primer tahun {selectedYear}.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Cluster Filter */}
            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <Layers className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-600 mr-2 whitespace-nowrap">Klaster:</span>
              <select
                value={selectedClusterId}
                onChange={(e) => setSelectedClusterId(e.target.value)}
                className="bg-transparent text-sm font-bold text-teal-700 border-none focus:ring-0 cursor-pointer py-0 pl-0 pr-8 max-w-[150px] sm:max-w-xs truncate"
              >
                <option value="all">Semua Klaster</option>
                {clusters.map(cluster => (
                   <option key={cluster.id} value={cluster.id}>{cluster.name.split(':')[0]}</option>
                ))}
              </select>
            </div>

            {/* Indicator Filter */}
            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <Target className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-600 mr-2 whitespace-nowrap">Indikator:</span>
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="bg-transparent text-sm font-bold text-teal-700 border-none focus:ring-0 cursor-pointer py-0 pl-0 pr-8 max-w-[180px] sm:max-w-xs truncate"
                disabled={availableIndicators.length === 0}
              >
                <option value="all">Semua Indikator</option>
                {availableIndicators.map(ind => (
                   <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <Calendar className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-600 mr-2">Bulan:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-sm font-bold text-teal-700 border-none focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
              >
                <option value="all">Semua Bulan</option>
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <Filter className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-600 mr-2">Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-sm font-bold text-teal-700 border-none focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
              >
                {years.length > 0 ? (
                  years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                ) : (
                  <option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Display */}
        <div className="bg-slate-50 rounded-xl p-4 md:p-6 border border-slate-100 shadow-inner h-[400px] mb-12 relative">
          
          {/* Context Label */}
          <div className="absolute top-4 left-6 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded border border-slate-200 text-xs text-slate-500 pointer-events-none">
             {isDrillDown 
                ? `Analisis Indikator (Detail Klaster) - ${selectedMonth === 'all' ? 'Tren' : selectedMonth}` 
                : `Perbandingan Klaster - ${selectedMonth === 'all' ? 'Tren' : selectedMonth}`}
          </div>

          <ResponsiveContainer width="100%" height="100%">
            {selectedMonth === 'all' ? (
              // LINE CHART (Trend)
              <LineChart
                data={lineChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                {isDrillDown 
                   ? availableIndicators.map((ind, index) => (
                      <Line
                        key={ind}
                        type="monotone"
                        dataKey={ind}
                        name={ind}
                        stroke={COLORS[index % COLORS.length]} 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                        label={{ position: 'top', dy: -5, fill: COLORS[index % COLORS.length], fontSize: 10, fontWeight: 'bold', formatter: (val: number) => `${val}%` }}
                      />
                   ))
                   : filteredClusters.map((cluster, index) => (
                      <Line
                        key={cluster.id}
                        type="monotone"
                        dataKey={cluster.name.split(':')[0]}
                        name={cluster.name.split(':')[0]}
                        stroke={COLORS[clusters.findIndex(c => c.id === cluster.id) % COLORS.length]} 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                        label={{ position: 'top', dy: -5, fill: COLORS[clusters.findIndex(c => c.id === cluster.id) % COLORS.length], fontSize: 10, fontWeight: 'bold', formatter: (val: number) => `${val}%` }}
                      />
                   ))
                }
              </LineChart>
            ) : (
              // BAR CHART (Snapshot)
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0}
                 />
                 <YAxis 
                    tick={{ fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false}
                    unit="%"
                    domain={[0, 100]}
                 />
                 <Tooltip content={<CustomTooltip />} />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
                 <Bar dataKey="value" name="Capaian (%)" radius={[4, 4, 0, 0]} barSize={60}>
                    <LabelList 
                        dataKey="value" 
                        position="top" 
                        formatter={(value: number) => `${value}%`}
                        style={{ fill: '#475569', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Table Analysis */}
        <div className="mt-12">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TableIcon className="h-6 w-6 text-teal-600" />
                <h3 className="text-xl font-bold text-slate-900">
                   {isDrillDown ? 'Analisis Detail Indikator' : 'Tabel Capaian & Kesenjangan (Gap)'}
                </h3>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-slate-500 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Mode: {isDrillDown ? 'Detail Klaster' : 'Ringkasan Klaster'} | Data: {selectedMonth === 'all' ? `Rata-rata Tahun ${selectedYear}` : `${selectedMonth} ${selectedYear}`}
              </div>
           </div>
           
           <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-slate-300">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-slate-900 sm:pl-6 min-w-[200px]">
                       {isDrillDown ? 'Nama Indikator' : 'Klaster'}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-slate-900">Jml Data</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-slate-900">Capaian</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-slate-900">Gap</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-slate-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-slate-900 min-w-[200px]">Permasalahan</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-slate-900 min-w-[200px]">Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {tableData && tableData.length > 0 ? (
                    tableData.map((row: any) => {
                      const score = Math.round(row.avgScore);
                      const gap = Math.round(row.gap);
                      
                      let statusBadge = <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Optimal</span>;
                      let barColor = "bg-teal-600";
                      
                      if (score < 50) {
                        statusBadge = <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Kritis</span>;
                        barColor = "bg-red-500";
                      } else if (score < 80) {
                        statusBadge = <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Perlu Peningkatan</span>;
                        barColor = "bg-yellow-500";
                      }

                      if (row.count === 0) {
                         statusBadge = <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">Tidak Ada Data</span>;
                         barColor = "bg-slate-300";
                      }

                      return (
                        <tr key={row.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                             <div className="flex items-center">
                                {/* Color synced icon */}
                                <div 
                                  className="h-8 w-8 rounded-full flex items-center justify-center mr-3 text-white shadow-sm flex-shrink-0"
                                  style={{ backgroundColor: row.color }}
                                >
                                   {renderIcon(row.iconName)}
                                </div>
                                <span className="whitespace-normal">{row.name}</span>
                             </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-center">
                            {row.count}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 align-middle">
                             <div className="flex items-center">
                                <span className="w-8 text-right font-bold mr-2">{score}%</span>
                                <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                   <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
                                </div>
                             </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                             <span className={`font-bold ${gap > 20 ? 'text-red-600' : 'text-slate-600'}`}>
                                {gap > 0 ? `-${gap}%` : '0%'}
                             </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-center">
                             {statusBadge}
                          </td>
                          <td className="px-3 py-4 text-xs text-slate-600 align-top">
                             {row.problems && row.problems.length > 0 ? (
                               <ul className="list-disc pl-4 space-y-1">
                                 {row.problems.map((p: string, idx: number) => (
                                    <li key={idx} className="whitespace-normal">{p}</li>
                                 ))}
                               </ul>
                             ) : <span className="text-slate-400">-</span>}
                          </td>
                          <td className="px-3 py-4 text-xs text-slate-600 align-top">
                             {row.actionPlans && row.actionPlans.length > 0 ? (
                               <ul className="list-disc pl-4 space-y-1">
                                 {row.actionPlans.map((p: string, idx: number) => (
                                    <li key={idx} className="whitespace-normal">{p}</li>
                                 ))}
                               </ul>
                             ) : <span className="text-slate-400">-</span>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                       <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                          Tidak ada data yang tersedia untuk filter ini.
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
           <div className="mt-2 text-xs text-slate-400 italic">
             * Drill-Down: Pilih "Klaster" spesifik di atas untuk melihat detail indikator dalam tabel dan grafik.
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomeChartsSection;
