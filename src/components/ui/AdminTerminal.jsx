import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const AdminTerminal = ({ isOpen, onClose, onSkipLevel, onPreviousLevel, onToggleTimer, isTimerPaused, currentLevel, nightVision, onToggleNightVision, noClip, onToggleNoClip, levelDebugData }) => {
    const [inputCode, setInputCode] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState(false);

    // Hardcoded answers for the cheat sheet
    const CHEAT_SHEET = {
        1: "STAP 1 ANTWOORDEN: 24, 288, -80, 5, 120, 11000, 1000000, 2965, 4080, 8, 100, 40, 300, 440, 10, 5050, 3, 11, 3, 8:(3-(8:3)), 1, 52, 1111, 12345679, 24. | ACCESS CODE: 7259 | FREQ: 95 | SAFE: 1945 | META DIGIT: 4",
        2: "Antwoord: Volgorde 🌟(1) -> 🔥(2) -> 🌙(3) -> 🌲(4) | META DIGIT: 9",
        3: "Antwoord: 36 (2x12 + 5x3 - 3x1) | META DIGIT: 2",
        4: "Puzzels: 1) 14m, 2) 7.5/13.3m, 3) 25.8°, 4) 4.4m | DEUR CODE: 8294 | META DIGIT: 5",
        5: "EINDCODE: 4925 (Verzameld uit vorige levels)"
    };

    // Keyboard Input Support
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key >= '0' && e.key <= '9') {
                handleKeypadClick(e.key);
            } else if (e.key === 'Backspace') {
                setInputCode(prev => prev.slice(0, -1));
            } else if (e.key === 'Enter') {
                handleSubmit();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, inputCode]); // Depend on inputCode to ensure latest state access if needed (though functional update handles it)

    // Mini Map Rendering
    React.useEffect(() => {
        if (!isOpen || currentLevel !== 4 || !levelDebugData) return;
        const canvas = document.getElementById('admin-mini-map');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        // Draw Walls
        ctx.fillStyle = '#22c55e'; // Green
        levelDebugData.walls.forEach(wall => {
            // Walls are in % (0-100)
            ctx.fillRect(
                (wall.x / 100) * w,
                (wall.y / 100) * h,
                (wall.w / 100) * w,
                (wall.h / 100) * h
            );
        });

        // Draw Targets
        ctx.fillStyle = 'red';
        levelDebugData.targets.forEach(target => {
            const tx = (target.x / 100) * w;
            const ty = (target.y / 100) * h;
            ctx.beginPath();
            ctx.arc(tx, ty, 5, 0, Math.PI * 2);
            ctx.fill();
            // Label
            ctx.fillStyle = 'white';
            ctx.font = '10px monospace';
            ctx.fillText(target.digit, tx + 6, ty + 6);
            ctx.fillStyle = 'red';
        });

    }, [isOpen, currentLevel, levelDebugData]);

    const handleKeypadClick = (num) => {
        if (inputCode.length < 4) {
            console.log("Inputting:", inputCode + num);
            setInputCode(prev => prev + num);
        }
    };

    const handleClear = () => {
        setInputCode("");
        setError(false);
    };

    const handleSubmit = () => {
        console.log("Submitting code:", inputCode);
        if (inputCode === "5834") {
            setIsUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setInputCode("");
            setTimeout(() => setError(false), 500);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
            style={{ zIndex: 99999, backgroundColor: 'black' }}
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="relative z-50 bg-gray-900 border-2 border-red-500 rounded-lg shadow-[0_0_100px_rgba(220,38,38,0.8)] w-full max-w-md overflow-hidden font-mono max-h-[90vh] overflow-y-auto animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-red-900/30 p-6 border-b border-red-500/50 flex justify-between items-center sticky top-0 backdrop-blur-xl z-20">
                    <h2 className="text-red-500 font-black text-2xl tracking-widest flex items-center gap-3">
                        <span className="animate-pulse">🔒</span> ADMIN
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 transition-colors text-4xl leading-none font-bold"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!isUnlocked ? (
                        <div className="flex flex-col gap-6">
                            <div className="text-red-400 text-sm mb-2 text-center uppercase tracking-widest">
                                Enter Access Code
                            </div>

                            {/* Display */}
                            <div className={`bg-black border-2 ${error ? 'border-red-600 animate-shake' : 'border-gray-700'} h-12 flex items-center justify-center text-white text-2xl tracking-[0.5em] rounded mb-2`}>
                                {inputCode.padEnd(4, '•')}
                            </div>

                            {/* Keypad */}
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleKeypadClick(num.toString())}
                                        className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded text-xl font-bold transition-colors active:bg-gray-600 border border-gray-700"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button onClick={handleClear} className="bg-red-900/50 hover:bg-red-800 text-red-200 p-4 rounded font-bold border border-red-800 transition-colors">C</button>
                                <button onClick={() => handleKeypadClick('0')} className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded text-xl font-bold border border-gray-700">0</button>
                                <button onClick={handleSubmit} className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 p-4 rounded font-bold border border-emerald-800 transition-colors">OK</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="text-green-500 text-xs border-b border-green-900/50 pb-2 mb-2">
                                ACCESS GRANTED. WELCOME, ADMIN.
                            </div>

                            <div className="space-y-4">
                                {/* Global Access QR (New) */}
                                <div className="bg-gray-800/50 p-4 rounded border border-gray-700 flex flex-col items-center">
                                    <h3 className="text-gray-400 text-xs uppercase mb-3">Global Access Link</h3>
                                    <div className="bg-white p-2 rounded-lg mb-2">
                                        <QRCode value="https://math-escaperoom-2025.loca.lt" size={128} />
                                    </div>
                                    <p className="text-[10px] text-gray-500 break-all text-center">https://math-escaperoom-2025.loca.lt</p>
                                </div>

                                {/* Navigation Controls */}
                                <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                                    <h3 className="text-gray-400 text-xs uppercase mb-2">Level Navigation</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={onPreviousLevel}
                                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-bold text-sm transition-all"
                                        >
                                            ⬅️ PREVIOUS
                                        </button>
                                        <button
                                            onClick={() => {
                                                onSkipLevel();
                                                onClose();
                                            }}
                                            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black py-2 rounded font-bold text-sm shadow-lg hover:shadow-yellow-500/20 transition-all"
                                        >
                                            SKIP ➡️
                                        </button>
                                    </div>
                                    <div className="mt-2 text-center text-xs text-gray-500">Current Level: {currentLevel}</div>
                                </div>

                                {/* Timer Control */}
                                <div className="bg-gray-800/50 p-4 rounded border border-gray-700 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-gray-400 text-xs uppercase">Game Timer</h3>
                                        <button
                                            onClick={onToggleTimer}
                                            className={`px-4 py-2 rounded font-bold text-sm transition-all w-32 ${isTimerPaused ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                                        >
                                            {isTimerPaused ? "RESUME ▶" : "PAUSE ⏸"}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                                        <h3 className="text-gray-400 text-xs uppercase">No Clip (Ghost)</h3>
                                        <button
                                            onClick={onToggleNoClip}
                                            className={`px-4 py-2 rounded font-bold text-sm transition-all w-32 ${noClip ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-700 text-gray-400'}`}
                                        >
                                            {noClip ? "ACTIVE 👻" : "OFF 🧱"}
                                        </button>
                                    </div>
                                </div>

                                {/* Level Specific Controls */}
                                {currentLevel === 4 && (
                                    <div className="bg-gray-800/50 p-4 rounded border border-gray-700 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-gray-400 text-xs uppercase">Level 4: Night Vision</h3>
                                            <button
                                                onClick={onToggleNightVision}
                                                className={`px-4 py-2 rounded font-bold text-sm transition-all w-32 ${nightVision ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                                            >
                                                {nightVision ? "ON 👁️" : "OFF 🌑"}
                                            </button>
                                        </div>
                                        {/* Mini Map */}
                                        {levelDebugData && (
                                            <div className="flex flex-col items-center">
                                                <h3 className="text-gray-500 text-[10px] uppercase mb-1 w-full text-left">Generated Map</h3>
                                                <canvas
                                                    id="admin-mini-map"
                                                    width={300}
                                                    height={300}
                                                    className="border border-green-500/30 rounded bg-black w-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Answer Sheet */}
                                <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                                    <h3 className="text-gray-400 text-xs uppercase mb-2">Intel Database</h3>
                                    <div className="bg-black p-3 rounded border border-gray-800 text-green-400 text-sm mb-3 font-mono">
                                        {CHEAT_SHEET[currentLevel] || "No data available for this level."}
                                    </div>
                                    <button
                                        className="block w-full bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 py-2 rounded border border-blue-800 transition-all text-sm cursor-not-allowed opacity-70"
                                        title="Full document offline"
                                    >
                                        📄 FULL ANSWER SHEET (OFFLINE)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTerminal;
