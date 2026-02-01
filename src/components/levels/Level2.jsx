import React, { useState } from 'react';

const SYMBOLS = [
    { id: 'star', icon: '🌟', label: 'Ster' },
    { id: 'fire', icon: '🔥', label: 'Vuur' },
    { id: 'moon', icon: '🌙', label: 'Maan' },
    { id: 'tree', icon: '🌲', label: 'Boom' },
    { id: 'sun', icon: '☀️', label: 'Zon' },
    { id: 'water', icon: '💧', label: 'Water' },
    { id: 'wind', icon: '💨', label: 'Wind' },
    { id: 'earth', icon: '🌍', label: 'Aarde' },
    { id: 'lightning', icon: '⚡', label: 'Bliksem' },
    { id: 'snow', icon: '❄️', label: 'Sneeuw' },
    { id: 'flower', icon: '🌸', label: 'Bloem' },
    { id: 'leaf', icon: '🍂', label: 'Blad' },
    { id: 'rock', icon: '🪨', label: 'Steen' },
    { id: 'mountain', icon: '🏔️', label: 'Berg' },
    { id: 'cloud', icon: '☁️', label: 'Wolk' },
    { id: 'rainbow', icon: '🌈', label: 'Regenboog' }
];

// Target Sequence: Ster, Vuur, Maan, Boom (4 steps)
const TARGET_SEQUENCE = ['star', 'fire', 'moon', 'tree'];

// Fisher-Yates shuffle
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const Level2 = ({ onComplete, onFail }) => {
    const [history, setHistory] = useState([]);
    const [gridSymbols] = useState(() => shuffleArray(SYMBOLS)); // Shuffle once on mount
    const [shake, setShake] = useState(false);

    const handleSymbolClick = (id) => {
        const newHistory = [...history, id];
        setHistory(newHistory);

        // Check Progress
        const isCorrectSoFar = newHistory.every((val, idx) => val === TARGET_SEQUENCE[idx]);

        if (!isCorrectSoFar) {
            setShake(true);
            setHistory([]);
            if (onFail) onFail(5, "Brute Force Fout! (-5 seconden)"); // 5 seconds penalty
            setTimeout(() => setShake(false), 500);
        } else if (newHistory.length === TARGET_SEQUENCE.length) {
            onComplete();
        }
    };

    return (
        <div className="w-full h-full relative flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-orange-950/20" />

            {/* The Wall */}
            <div className="relative z-10 flex flex-col items-center gap-8 p-4 max-w-6xl w-full">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-4 tracking-[0.5em] uppercase drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse">BRUTE FORCE</h2>
                    <p className="text-gray-500 font-mono text-sm tracking-widest">"4 SLEUTELS. MILJARDEN COMBINATIES. VIND DE ORDE."</p>
                </div>

                <div className={`grid grid-cols-4 gap-4 p-8 bg-black/80 border-2 border-red-900/50 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)] backdrop-blur-md ${shake ? 'animate-shake' : ''}`}>
                    {gridSymbols.map((symbol) => (
                        <button
                            key={symbol.id}
                            onClick={() => handleSymbolClick(symbol.id)}
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-4xl md:text-5xl border-2 transition-all active:scale-90 shadow-lg ${history.includes(symbol.id)
                                ? 'bg-red-500 text-white border-white scale-110 shadow-[0_0_20px_white]'
                                : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:text-gray-200 hover:border-red-500/50 hover:bg-red-900/10'
                                }`}
                        >
                            {symbol.icon}
                        </button>
                    ))}
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-4">
                    {TARGET_SEQUENCE.map((_, i) => (
                        <div
                            key={i}
                            className={`w-12 h-2 rounded-full transition-all duration-500 ${i < history.length ? 'bg-red-600 shadow-[0_0_15px_red]' : 'bg-gray-900 border border-gray-800'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Level2;
