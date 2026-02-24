import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface Props {
    content: string;
}

const InfoTooltip: React.FC<Props> = ({ content }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const iconRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top - 8, // 8px spacing above icon
                left: rect.left + rect.width / 2
            });
        }
    };

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible]);

    return (
        <div className="inline-flex items-center ml-1.5">
            <div
                ref={iconRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help flex items-center justify-center p-0.5"
            >
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
            </div>
            {isVisible && (
                <div
                    style={{
                        position: 'fixed',
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                        transform: 'translate(-50%, -100%)'
                    }}
                    className="w-56 p-2.5 bg-[#1e293b] text-white text-[11px] leading-relaxed font-medium rounded-lg shadow-2xl z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
                >
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[5px] border-transparent border-t-[#1e293b]" />
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
