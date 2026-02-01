import React, { useState, useEffect } from 'react';

// Level 1: The Resistance Radio (Enigma)
const Level1 = ({ onComplete, onFail }) => {
    // Phases: 'circuit' -> 'radio' -> 'safe'
    const [phase, setPhase] = useState('circuit');
    const [shake, setShake] = useState(false);

    // --- PHASE 1: ALGORITHM (The "Chain of Verification") ---
    // User must verify every single step to ensure system integrity.
    // 25 Steps. 25 Inputs.
    // Final Answer (1025) is GIVEN.


    // 25 Independent Math Questions.
    // SECRET CODE: 7 - 2 - 5 - 9
    // Hidden in steps: 3, 9, 15, 21

    const REAL_STEPS = [
        { id: 1, txt: "60 : 5 x (7 - 5) =", total: 24, hidden: true },
        { id: 2, txt: "48 : 2 x (9 + 3) =", total: 288, hidden: true },
        { id: 3, txt: "10 - 10 x 10 + 10 =", total: -80, hidden: true, secretDigit: 7 }, // SECRET 1
        { id: 4, txt: "1 + 1 + 1 + 1 + 1 x 0 + 1 =", total: 5, hidden: true },
        { id: 5, txt: "50 : 0,5 + 20 =", total: 120, hidden: true },
        { id: 6, txt: "125 x 88 =", total: 11000, hidden: true },
        { id: 7, txt: "999 x 999 + 1999 =", total: 1000000, hidden: true },
        { id: 8, txt: "10.000 - 1234 - 2345 - 3456 =", total: 2965, hidden: true },
        { id: 9, txt: "15 x 16 x 17 =", total: 4080, hidden: true, secretDigit: 2 }, // SECRET 2
        { id: 10, txt: "1024 : 16 : 4 : 2 =", total: 8, hidden: true },
        { id: 11, txt: "0,125 x 800 =", total: 100, hidden: true },
        { id: 12, txt: "1 : 0,25 : 0,5 : 0,2 =", total: 40, hidden: true },
        { id: 13, txt: "33,33 procent van 600 + 12,5 procent van 800 =", total: 300, hidden: true },
        { id: 14, txt: "0,75 x 440 + 0,25 x 440 =", total: 440, hidden: true },
        { id: 15, txt: "(0,2 x 0,5) : 0,01 =", total: 10, hidden: true, secretDigit: 5 }, // SECRET 3
        { id: 16, txt: "Tel alle getallen van 1 tot en met 100 bij elkaar op =", total: 5050, hidden: true },
        { id: 17, txt: "Als 3 katten 3 muizen vangen in 3 minuten, hoeveel minuten hebben 100 katten dan nodig om 100 muizen te vangen?", total: 3, hidden: true },
        { id: 18, txt: "Een klok slaat 6 keer in 5 seconden. Hoeveel seconden duurt het voordat de klok 12 keer heeft geslagen?", total: 11, hidden: true },
        { id: 19, txt: "Wat is de uitkomst van de helft van 2 + 2?", total: 3, hidden: true },
        { id: 20, txt: "Gebruik de getallen 3, 3, 8 en 8 precies eenmaal om met +, -, x en : het getal 24 te maken", answer: "8 : (3 - (8 : 3))", hidden: true },
        { id: 21, txt: "(12 x 12) - (11 x 13) =", total: 1, hidden: true, secretDigit: 9 }, // SECRET 4
        { id: 22, txt: "1 + 2 - 3 + 4 - 5 + 6 - 7 tot en met + 100 =", total: 52, hidden: true },
        { id: 23, txt: "123 x 9 + 4 =", total: 1111, hidden: true },
        { id: 24, txt: "111.111.111 : 9 =", total: 12345679, hidden: true },
        { id: 25, txt: "Wat is de uitkomst van 2 tot de macht 10 - 1000?", total: 24, hidden: true },
    ];

    const [inputs, setInputs] = useState({});
    const [validationState, setValidationState] = useState({}); // { [id]: 'correct' | 'wrong' }
    const [accessCode, setAccessCode] = useState("");

    const handleChainInput = (id, val) => {
        setInputs(prev => ({ ...prev, [id]: val }));
        // Clear validation for this step on edit
        setValidationState(prev => ({ ...prev, [id]: undefined }));
    };

    const checkChain = () => {
        let newValidation = {};

        REAL_STEPS.forEach(step => {
            const inputValStr = (inputs[step.id] || "").trim();
            const inputValNum = parseFloat(inputValStr);

            if (step.answer) {
                // Exact string match (ignoring spaces/case if needed, but strict for now)
                if (inputValStr.replace(/\s/g, '') === step.answer.replace(/\s/g, '')) {
                    newValidation[step.id] = 'correct';
                } else {
                    newValidation[step.id] = 'wrong';
                }
            } else {
                // Numeric check
                const validTotal = step.total;
                if (isNaN(inputValNum)) {
                    newValidation[step.id] = 'wrong';
                } else if (Math.abs(inputValNum - validTotal) < 0.1) {
                    newValidation[step.id] = 'correct';
                } else {
                    newValidation[step.id] = 'wrong';
                }
            }
        });

        setValidationState(newValidation);
    };

    const handleAccessCodeSubmit = () => {
        if (accessCode === "7259") {
            setPhase('radio');
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setAccessCode("");
            if (onFail) onFail();
        }
    };

    const [freqInput, setFreqInput] = useState("");
    const [receivedMsg, setReceivedMsg] = useState("");
    const [showDoc, setShowDoc] = useState(false);
    const [safeCode, setSafeCode] = useState("");

    // --- PHASE 2: RADIO (Frequency) ---
    // Math Problem:
    // Stelsel van vergelijkingen:
    // I.  5x + 2y = 180
    // II. y = x + 20
    //
    // Substitute II in I:
    // 5x + 2(x + 20) = 180
    // 5x + 2x + 40 = 180
    // 7x = 140 => x = 20
    // y = 20 + 20 = 40
    //
    // Freq = x + y + 35 = 20 + 40 + 35 = 95 MHz.

    const handleTune = () => {
        if (freqInput === "95" || freqInput === "95.0") {
            setReceivedMsg("CODE: 1945"); // The Safe Code
        } else {
            setReceivedMsg("RUIS...");
            setTimeout(() => setReceivedMsg(""), 1000);
        }
    };


    // --- PHASE 3: SAFE ---
    const checkSafe = () => {
        if (safeCode === "1945") {
            onComplete();
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            if (onFail) onFail();
        }
    };

    // ---------------- RENDER ----------------

    if (phase === 'circuit') {
        return (
            <div className="w-full h-full bg-gray-950 text-emerald-400 font-mono p-4 flex flex-col items-center relative overflow-auto">
                <h2 className="text-3xl font-black mb-6 text-emerald-600 border-b-4 border-emerald-900 pb-2 uppercase tracking-widest sticky top-0 bg-gray-950 z-20 w-full text-center shadow-lg">
                    System Integrity Chain
                </h2>

                <div className="w-full max-w-4xl bg-black border-4 border-emerald-600 p-8 rounded-xl shadow-2xl mb-32 relative max-h-[60vh] overflow-y-auto custom-scrollbar">

                    <div className="mt-8 flex flex-col gap-2 font-mono text-xl md:text-2xl text-emerald-400 font-bold tracking-wide">

                        {REAL_STEPS.map((step) => {
                            return (
                                <div key={step.id} className={`flex items-center gap-4 border-b border-emerald-900/30 pb-2 transition-colors px-2 rounded ${validationState[step.id] === 'correct' ? 'bg-emerald-900/20' : validationState[step.id] === 'wrong' ? 'bg-red-900/20' : 'hover:bg-emerald-900/10'}`}>
                                    <span className="text-gray-600 w-8 text-right text-sm">{String(step.id).padStart(2, '0')}</span>

                                    {/* Question Text */}
                                    <span className="text-emerald-500 font-bold text-xl md:text-2xl min-w-[300px] text-right">{step.txt}</span>

                                    {/* Input for the RESULT */}
                                    <div className="min-w-[100px] text-center">
                                        <input
                                            type="text"
                                            value={inputs[step.id] || ''}
                                            onChange={(e) => handleChainInput(step.id, e.target.value)}
                                            placeholder="?"
                                            className={`bg-gray-900 border-b-2 ${validationState[step.id] === 'correct' ? 'border-emerald-500 text-emerald-400' : validationState[step.id] === 'wrong' ? 'border-red-500 text-red-500' : inputs[step.id] ? 'border-emerald-500 text-emerald-400' : 'border-red-900 text-red-500'} w-32 px-2 py-1 text-center outline-none focus:border-white transition-all`}
                                        />
                                    </div>

                                    <span className="flex-1 text-right pr-4">
                                        {validationState[step.id] === 'correct' && (
                                            <span className="text-emerald-400 font-bold">✅</span>
                                        )}
                                        {validationState[step.id] === 'wrong' && (
                                            <span className="text-red-500 font-bold">❌</span>
                                        )}

                                        {/* Reveal Secret Digit if Correct */}
                                        {validationState[step.id] === 'correct' && step.secretDigit && (
                                            <span className="ml-4 bg-amber-500 text-black px-2 rounded font-black animate-pulse shadow-[0_0_10px_orange]">
                                                SECRET: {step.secretDigit}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Validation & Access Code Footer */}
                <div className="fixed bottom-0 w-full max-w-6xl bg-gray-900 border-t-4 border-emerald-800 p-6 z-30 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] flex items-center justify-between gap-8">

                    <button
                        onClick={checkChain}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 text-xl font-bold rounded-xl border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
                    >
                        CHECK ANSWERS
                    </button>

                    <div className="flex items-center gap-4 bg-black p-4 rounded-xl border-2 border-emerald-900/50">
                        <span className="text-amber-500 font-black uppercase text-sm tracking-widest w-32 text-right">ENTER<br />ACCESS CODE:</span>
                        <div className={`flex items-center gap-2 ${shake ? 'animate-shake' : ''}`}>
                            <input
                                type="text"
                                maxLength={4}
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="----"
                                className="bg-gray-800 text-emerald-400 text-4xl w-48 text-center font-mono py-2 rounded border border-gray-600 focus:border-emerald-500 outline-none tracking-[1rem]"
                            />
                            <button
                                onClick={handleAccessCodeSubmit}
                                className="bg-amber-600 hover:bg-amber-500 text-white h-16 w-16 rounded-lg font-black text-2xl flex items-center justify-center border-b-4 border-amber-800 active:border-b-0 active:translate-y-1"
                            >
                                ➜
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'radio') {
        return (
            <div className="w-full h-full bg-[#1a1a1a] flex flex-col items-center justify-end pb-12 relative p-6">

                {/* Top Bar with Document Toggle */}
                <div className="absolute top-0 right-0 p-2 z-20">
                    <button
                        onClick={() => setShowDoc(!showDoc)}
                        className="bg-[#f0e6d2] text-[#3e3e3e] px-6 py-3 rounded shadow-xl font-serif font-bold hover:bg-white transform -rotate-2 hover:rotate-0 transition-all border-4 border-[#d4c5a5]"
                    >
                        {showDoc ? "Sluit Document ✕" : "📄 Bekijk Geheime Code"}
                    </button>
                </div>

                {/* The Radio Interface */}
                <div className="bg-[#2a2a2a] p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-t-2 border-gray-600 border-b-8 border-black w-full max-w-4xl flex flex-col gap-8 relative overflow-hidden">
                    {/* Speaker Grill */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-32 h-64 flex flex-col gap-2 opacity-30">
                        {[...Array(20)].map((_, i) => <div key={i} className="w-full h-1 bg-black rounded-full" />)}
                    </div>

                    {/* Display */}
                    <div className="bg-[#0f172a] rounded-lg border-4 border-gray-700 h-32 flex items-center justify-center relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
                        <span className={`font-mono text-5xl tracking-widest ${receivedMsg.includes("CODE") ? 'text-green-400 animate-pulse' : 'text-green-900/50'}`}>
                            {receivedMsg || "NO SIGNAL"}
                        </span>
                    </div>

                    {/* Controls (Input instead of Slider) */}
                    <div className="flex items-center justify-center gap-12 pl-40">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                            <span className="text-xs text-gray-500 font-bold uppercase">Power</span>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={freqInput}
                                    onChange={(e) => setFreqInput(e.target.value)}
                                    placeholder="00.0"
                                    className="w-48 h-16 bg-black text-amber-500 font-mono text-4xl text-center rounded-lg border-2 border-gray-600 focus:border-amber-500 outline-none"
                                />
                                <button
                                    onClick={handleTune}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 rounded-lg font-bold shadow-lg active:scale-95"
                                >
                                    TUNE
                                </button>
                            </div>
                            <div className="font-mono text-sm text-gray-500">VOER FREQUENTIE IN (MHz)</div>
                        </div>

                        <button
                            onClick={() => setPhase('safe')}
                            className="w-24 h-24 rounded-full border-4 border-gray-600 bg-gray-800 shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all"
                        >
                            <span className="text-2xl">🔐</span>
                        </button>
                    </div>
                </div>

                {/* The Secret Document Overlay (Harder Math) */}
                {showDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 animate-fadeIn transition-all pointer-events-auto" onClick={() => setShowDoc(false)}>
                        <div className="max-w-2xl w-full text-center space-y-8 bg-black p-12 rounded-3xl border-2 border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.4)]" onClick={e => e.stopPropagation()}>
                            <h3 className="text-4xl font-black text-emerald-500 tracking-tighter uppercase mb-8">Frequentie Protocol</h3>

                            <div className="space-y-6 text-2xl font-mono text-emerald-100">
                                <p className="text-gray-400 italic">"Vind de kruising van de artillerie-lijnen."</p>

                                <div className="bg-black/50 p-8 rounded-2xl border border-emerald-900/50 space-y-4">
                                    <p className="text-amber-500 text-sm uppercase tracking-widest mb-4 font-bold">Stelsel van Vergelijkingen:</p>
                                    <p className="text-3xl tracking-[0.2em]">I: &nbsp; 5x + 2y = 180</p>
                                    <p className="text-3xl tracking-[0.2em]">II: &nbsp;y = x + 20</p>
                                    <div className="w-16 h-1 bg-emerald-900 mx-auto my-6" />
                                    <p className="text-4xl font-black text-white glow-text">Freq = X + Y + 35 (MHz)</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowDoc(false)}
                                className="mt-8 px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all"
                            >
                                SLUITEN
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- SAFE STATE ---
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center">
            <div className={`bg-gray-800 p-12 rounded-3xl border-4 border-gray-600 flex flex-col items-center gap-8 ${shake ? 'animate-shake' : ''}`}>
                <h2 className="text-4xl text-white font-bold tracking-widest">DE KLUIS</h2>
                <input
                    type="text"
                    value={safeCode}
                    maxLength={4}
                    onChange={(e) => setSafeCode(e.target.value)}
                    className="bg-black text-emerald-500 font-mono text-6xl text-center w-64 h-24 border-4 border-emerald-900 rounded-xl focus:border-emerald-500 outline-none shadow-[inset_0_0_20px_rgba(0,0,0,1)]"
                    placeholder="----"
                />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button
                            key={n}
                            onClick={() => setSafeCode(prev => (prev + n).slice(0, 4))}
                            className="w-20 h-20 bg-gray-700 text-white text-3xl font-bold rounded shadow hover:bg-gray-600 active:scale-95"
                        >
                            {n}
                        </button>
                    ))}
                    <button onClick={() => setSafeCode("")} className="col-span-3 bg-red-900 text-white h-16 rounded font-bold hover:bg-red-800">RESET</button>
                </div>
                <button
                    onClick={checkSafe}
                    className="w-full py-4 bg-emerald-700 text-white text-2xl font-bold rounded shadow-xl hover:bg-emerald-600 active:scale-95 transition-all"
                >
                    OPENEN
                </button>
                <button
                    onClick={() => setPhase('radio')}
                    className="text-gray-500 hover:text-white underline mt-4"
                >
                    Terug naar Radio
                </button>
            </div>
        </div>
    );
};

export default Level1;
