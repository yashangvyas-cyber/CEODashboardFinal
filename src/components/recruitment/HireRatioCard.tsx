import React from 'react';

interface Props {
    hireRatio?: number;
}

const HireRatioCard: React.FC<Props> = ({ hireRatio = 9 }) => {
    return (
        <div className="bg-indigo-600 rounded-xl shadow-sm text-white relative overflow-hidden group p-6 aspect-square flex flex-col items-center justify-center text-center">
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3">Overall Hire Ratio</div>
                <div className="text-6xl font-black tracking-tighter mb-1">{hireRatio}%</div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Success Rate</p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-500 delay-100" />
        </div>
    );
};

export default HireRatioCard;
