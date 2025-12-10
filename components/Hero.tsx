
import React from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { AppConfig } from '../types';

interface HeroProps {
  onCtaClick: () => void;
  config: AppConfig['hero'];
  contact: AppConfig['contact'];
  appName: string;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick, config, contact, appName }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{config.title}</span>{' '}
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {config.subtitle}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onCtaClick}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg transition-all"
                  >
                    Lihat Profil & Data
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#services"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 md:py-4 md:text-lg transition-all"
                  >
                    Layanan Kami
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 gap-4 sm:grid-cols-3">
               <div className="flex items-center text-slate-600">
                  <Clock className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{contact.hours}</span>
               </div>
               <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{contact.address}</span>
               </div>
               <div className="flex items-center text-slate-600">
                  <Phone className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{contact.phone}</span>
               </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={config.imageUrl}
          alt="Puskesmas Building"
          onError={(e) => (e.currentTarget.src = "https://picsum.photos/800/600?grayscale")}
        />
        <div className="absolute inset-0 bg-teal-900 opacity-10 lg:hidden"></div>
      </div>
    </div>
  );
};

export default Hero;
