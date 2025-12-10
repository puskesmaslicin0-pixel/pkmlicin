
import React, { useState, useEffect } from 'react';
import { Settings, Save, X, LayoutTemplate, MapPin, ImageIcon, Palette } from 'lucide-react';
import { AppConfig } from '../types';
import { BACKGROUND_OPTIONS } from '../constants';

interface GeneralSettingsSectionProps {
  config: AppConfig;
  onUpdate: (config: AppConfig) => void;
}

const GeneralSettingsSection: React.FC<GeneralSettingsSectionProps> = ({ config, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState<AppConfig>(config);

  useEffect(() => {
    if (!isEditing) {
      setTempConfig(config);
    }
  }, [config, isEditing]);

  const handleSave = () => {
    onUpdate(tempConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateField = (section: keyof AppConfig, field: string | null, value: string) => {
    if (section === 'hero' || section === 'contact') {
      setTempConfig({
        ...tempConfig,
        [section]: {
          ...tempConfig[section],
          [field!]: value
        }
      });
    } else if (section === 'theme') {
      setTempConfig({
        ...tempConfig,
        theme: {
          ...tempConfig.theme,
          background: value
        }
      });
    } else {
      setTempConfig({
        ...tempConfig,
        [section]: value
      });
    }
  };

  return (
    <div className="mb-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <Settings className="mr-2 text-teal-600" /> Pengaturan Tampilan & Identitas
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Atur nama website, tampilan halaman utama (Hero), dan informasi kontak.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-teal-600 hover:border-teal-200 transition-colors text-sm font-medium shadow-sm"
          >
            <Settings className="h-4 w-4 mr-2" /> Edit Tampilan
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <X className="h-4 w-4 mr-2" /> Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Save className="h-4 w-4 mr-2" /> Simpan
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Brand Identity */}
          <div className="space-y-6">
            <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center">
              <LayoutTemplate className="h-4 w-4 mr-2 text-indigo-500" /> Identitas Website
            </h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Aplikasi / Puskesmas</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.appName}
                onChange={(e) => updateField('appName', null, e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slogan / Tagline</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.tagline}
                onChange={(e) => updateField('tagline', null, e.target.value)}
              />
            </div>

            <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center pt-4">
              <Palette className="h-4 w-4 mr-2 text-indigo-500" /> Tema & Latar Belakang
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {BACKGROUND_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  disabled={!isEditing}
                  onClick={() => updateField('theme', null, option.className)}
                  className={`relative p-3 rounded-lg border text-left flex items-center space-x-3 transition-all ${
                    tempConfig.theme?.background === option.className 
                      ? 'ring-2 ring-teal-500 border-teal-500' 
                      : 'border-slate-200 hover:border-teal-300'
                  } ${!isEditing ? 'opacity-75 cursor-default' : 'cursor-pointer'}`}
                >
                   <div className={`w-8 h-8 rounded-full shadow-sm border border-slate-100 ${option.className}`}></div>
                   <span className="text-xs font-medium text-slate-700">{option.label}</span>
                </button>
              ))}
            </div>

            <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center pt-4">
              <ImageIcon className="h-4 w-4 mr-2 text-indigo-500" /> Tampilan Utama (Hero)
            </h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.hero.title}
                onChange={(e) => updateField('hero', 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-judul / Deskripsi Singkat</label>
              <textarea
                rows={3}
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.hero.subtitle}
                onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Gambar Utama</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.hero.imageUrl}
                onChange={(e) => updateField('hero', 'imageUrl', e.target.value)}
              />
              {isEditing && (
                 <p className="text-xs text-slate-500 mt-1">Masukkan URL gambar valid (contoh: https://images.unsplash.com/photo...)</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-indigo-500" /> Informasi Kontak
            </h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
              <textarea
                rows={2}
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.contact.address}
                onChange={(e) => updateField('contact', 'address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.contact.phone}
                onChange={(e) => updateField('contact', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.contact.email}
                onChange={(e) => updateField('contact', 'email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jam Operasional</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm p-2.5 border"
                value={tempConfig.contact.hours}
                onChange={(e) => updateField('contact', 'hours', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsSection;
