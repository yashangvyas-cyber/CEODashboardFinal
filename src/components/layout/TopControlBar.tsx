import React from 'react';
import { Search, Bell, Home, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.svg';

export const TopControlBar: React.FC = () => {
    return (
        <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            {/* Left Section: Logo & Breadcrumbs */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="CollabCRM" className="h-6 w-auto" />
                    <span className="text-slate-900 font-extrabold text-sm tracking-tight hidden sm:block">CollabCRM</span>
                </div>

                <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

                <nav className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Home size={10} className="text-slate-300" />
                    <ChevronRight size={10} className="text-slate-200" />
                    <span className="hover:text-indigo-600 cursor-pointer">CRM & Invoice</span>
                    <ChevronRight size={10} className="text-slate-200" />
                    <span className="text-indigo-500 italic">CEO Dashboard</span>
                </nav>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3">
                {/* Global Search */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={12} />
                    <input
                        type="text"
                        placeholder="Global Search..."
                        className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    />
                </div>

                <div className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center justify-center tracking-tighter leading-none">
                    STAGING
                </div>

                {/* Notifications */}
                <button className="relative p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded transition-colors group">
                    <Bell size={16} />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
                </button>

                {/* User Profile */}
                <button className="flex items-center justify-center h-7 w-7 bg-indigo-50 text-indigo-600 rounded font-black text-[10px] border border-indigo-100 hover:bg-indigo-100 transition-colors">
                    SU
                </button>
            </div>
        </div>
    );
};
