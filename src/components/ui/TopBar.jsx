import React from 'react';

const TopBar = ({ timeRemaining, formatTime, onHintClick, onAdminClick }) => {
    const isLowTime = timeRemaining < 300; // Red alert when < 5 mins

    return (
        <div className="w-full h-full bg-black/90 border-b border-white/10 flex items-center justify-between px-6">
            <div className="text-white font-mono text-xl tracking-widest">
                {/* Title Removed to declutter corner */}
            </div>

            <div className={`font-mono text-3xl font-bold tracking-wider ${isLowTime ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                {formatTime(timeRemaining)}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onAdminClick}
                    className="bg-red-900/20 hover:bg-red-900/50 text-red-500 hover:text-red-200 border border-red-900/50 px-3 py-1 text-xs font-bold font-mono rounded transition-colors uppercase tracking-widest"
                >
                    🔒 ADMIN
                </button>

                <button
                    onClick={onHintClick}
                    className="px-4 py-2 border border-white/20 rounded text-sm text-gray-300 hover:bg-white/10 transition-colors active:bg-white/20"
                >
                    HINT (3)
                </button>
            </div>
        </div>
    );
};

export default TopBar;
