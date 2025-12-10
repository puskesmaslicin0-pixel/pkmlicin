
import React from 'react';
import { AppConfig } from '../types';

interface FooterProps {
  appName: string;
  tagline: string;
  contact: AppConfig['contact'];
}

const Footer: React.FC<FooterProps> = ({ appName, tagline, contact }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">{appName}</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            {tagline}
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-400 transition-colors">Profil</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Layanan</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Jadwal Dokter</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Laporan Tahunan</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Kontak Darurat</h4>
          <p className="text-sm text-slate-400 mb-2">Hubungi Kami:</p>
          <p className="text-2xl font-bold text-white mb-4">{contact.phone}</p>
          <p className="text-xs text-slate-500">
            {contact.address}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Email: {contact.email}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} {appName}. All rights reserved. Built with React & Gemini.
      </div>
    </footer>
  );
};

export default Footer;
