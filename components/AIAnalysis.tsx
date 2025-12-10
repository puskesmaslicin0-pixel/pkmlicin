import React, { useState } from 'react';
import { Sparkles, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { analyzeHealthData } from '../services/geminiService';
import { PatientVisitData, DiseaseData } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  visitData: PatientVisitData[];
  diseaseData: DiseaseData[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ visitData, diseaseData }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeHealthData(visitData, diseaseData);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menghasilkan analisis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl overflow-hidden shadow-xl text-white">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Analisis Cerdas AI</h2>
              <p className="text-indigo-200 text-sm">Asisten Virtual Kepala Puskesmas</p>
            </div>
          </div>
          <button
            onClick={handleGenerateAnalysis}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              loading 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>{analysis ? 'Perbarui Analisis' : 'Buat Laporan'}</span>
              </>
            )}
          </button>
        </div>

        <div className="min-h-[200px] bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          {!analysis && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-center max-w-md">
                Klik tombol "Buat Laporan" untuk meminta AI menganalisis data kunjungan dan tren penyakit secara otomatis.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              <div className="h-32 bg-slate-700 rounded w-full mt-6"></div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center text-red-400 py-10">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="prose prose-invert prose-sm max-w-none">
                {/* We render simple markdown. Note: minimal renderer usually okay, 
                    but just displaying text with whitespace pre-wrap is safer if no markdown lib. 
                    However, instructions allow popular libs. I'll stick to simple whitespace rendering 
                    to avoid needing 'react-markdown' dependency if not strictly necessary, 
                    but better UX is using a simple parser or just CSS whitespace.
                    Let's use CSS whitespace-pre-wrap for simplicity and robustness.
                */}
               <div className="whitespace-pre-wrap font-light leading-relaxed text-slate-200">
                 {analysis}
               </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center text-xs text-slate-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Analisis dibuat oleh AI (Gemini 2.5 Flash) berdasarkan data statistik di atas. Selalu verifikasi dengan data rekam medis aktual.</span>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;