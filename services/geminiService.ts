import { GoogleGenAI, Type } from "@google/genai";
import { PatientVisitData, DiseaseData } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize the client outside the function to reuse it if possible, 
// though we usually create instances as needed in stateless contexts.
const ai = new GoogleGenAI({ apiKey });

export const analyzeHealthData = async (
  visitData: PatientVisitData[], 
  diseaseData: DiseaseData[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Mohon konfigurasi API Key untuk menggunakan fitur analisis AI.";
  }

  try {
    const dataContext = `
      Data Kunjungan Pasien (6 bulan terakhir): ${JSON.stringify(visitData)}
      Data 5 Penyakit Terbanyak: ${JSON.stringify(diseaseData)}
    `;

    const prompt = `
      Bertindaklah sebagai Konsultan Kesehatan Masyarakat Senior untuk Puskesmas di Indonesia.
      
      Analisis data berikut ini dan berikan "Laporan Eksekutif" singkat dalam bahasa Indonesia.
      
      Struktur Laporan:
      1. **Ringkasan Tren**: Apa yang terjadi dengan kunjungan pasien? Apakah ada lonjakan?
      2. **Analisis Penyakit**: Soroti penyakit dengan tren 'up' (naik). Berikan konteks kemungkinan penyebab (misal: ISPA sering naik saat pancaroba).
      3. **Rekomendasi Strategis**: 3 poin tindakan preventif atau promotif yang harus dilakukan kepala Puskesmas minggu ini.
      
      Data:
      ${dataContext}
      
      Gunakan format Markdown yang rapi. Jangan gunakan jargon medis yang terlalu rumit, tapi tetap profesional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "Maaf, tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungkan ke layanan AI. Silakan coba lagi nanti.";
  }
};
