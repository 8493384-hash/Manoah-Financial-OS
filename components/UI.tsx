import React from 'react';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';

export const NavItemButton = ({ icon: Icon, label, onClick, active, subItem }: any) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-start gap-4 px-6 py-4 transition-all duration-300 text-sm font-medium rounded-r-2xl mb-1 border-r-4
        ${active 
          ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-indigo-500 shadow-md translate-x-2' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 border-transparent'
        }
        ${subItem ? 'pl-10 text-xs' : ''}
      `}
    >
      <Icon size={subItem ? 16 : 20} className={`z-10 transition-transform group-hover:scale-110 ${active ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      <span className={`z-10 ${active ? 'font-bold tracking-wide' : ''}`}>{label}</span>
    </button>
);

export const StatCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-${color}-50/50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          {Icon ? <Icon size={24} /> : null}
        </div>
        {trend && (
          <div className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend === 'up' ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
            <span>2.5%</span>
          </div>
        )}
      </div>
      <div>
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{title}</span>
        <span className="text-3xl font-black text-slate-800 tracking-tight">{value}</span>
        {subtext && <span className="text-xs text-slate-400 mt-2 block font-medium flex items-center gap-1"><Clock size={12}/> {subtext}</span>}
      </div>
    </div>
  </div>
);