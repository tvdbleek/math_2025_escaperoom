import React, { useState } from 'react';

const Level3 = ({ onComplete, onFail }) => {
    const [inputValue, setInputValue] = useState("");
    const [shake, setShake] = useState(false);

    // Riddle Logic:
    // 6 8 2: One correct, right place (2 is correct/right place)
    // 6 1 4: One correct, wrong place (4 is correct/wrong place)
    // 2 0 6: Two correct, wrong place (2 and 0 are correct/wrong place)
    // 7 3 8: Nothing correct
    // 3 8 0: One correct, wrong place (0 is correct/wrong place)
    //
    // Solution: 0 4 2
    // Math Check: (0 + 4 + 2) * 5 = 6 * 5 = 30

    const handleCheck = () => {
        // Normalize: remove spaces, lowercase, standardise 'x'
        const cleanInput = inputValue.replace(/\s+/g, '').toLowerCase().replace('×', 'x').replace('*', 'x');

        // Expected Answer: (0 + 4 + 2) x 5 = 30
        // Normalized: (0+4+2)x5=30
        if (cleanInput === "(0+4+2)x5=30") {
            onComplete();
        } else {
            setShake(true);
            if (onFail) onFail(10, "FOUT! GEBRUIK HET FORMAAT: (x+y+z)x5=30");
            setTimeout(() => {
                setShake(false);
                setInputValue("");
            }, 1000);
        }
    };

    return (
        <div className="w-full h-full relative flex flex-col items-center justify-center bg-gray-900 overflow-hidden text-emerald-500 font-mono">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

            <div className="relative z-10 max-w-4xl w-full p-8 flex flex-col gap-8 animate-fadeIn">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-black mb-2 tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">DATALEK GEVONDEN</h2>
                    <p className="text-xl text-gray-400 border-b border-gray-700 pb-4 inline-block">ONTSLEUTEL DE BEVEILIGING</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Clues Panel */}
                    <div className="bg-black/50 border border-emerald-900/50 p-8 rounded-xl backdrop-blur-sm shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-emerald-400 border-b border-emerald-900/50 pb-2">LOGBOEK:</h3>
                        <div className="space-y-4 font-mono text-lg">
                            <div className="flex gap-4">
                                <span className="font-bold text-white bg-gray-800 px-2 rounded">6 8 2</span>
                                <span className="text-gray-400">Eén cijfer correct & juiste plek.</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="font-bold text-white bg-gray-800 px-2 rounded">6 1 4</span>
                                <span className="text-gray-400">Eén cijfer correct, verkeerde plek.</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="font-bold text-white bg-gray-800 px-2 rounded">2 0 6</span>
                                <span className="text-gray-400">Twee cijfers correct, verkeerde plek.</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="font-bold text-white bg-gray-800 px-2 rounded">7 3 8</span>
                                <span className="text-gray-400">Niets is correct.</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="font-bold text-white bg-gray-800 px-2 rounded">3 8 0</span>
                                <span className="text-gray-400">Eén cijfer correct, verkeerde plek.</span>
                            </div>
                        </div>
                    </div>

                    {/* Interaction Panel */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-amber-900/20 border border-amber-700/50 p-6 rounded-xl text-center">
                            <h3 className="text-amber-500 font-bold text-xl mb-4">DE WISKUNDIGE CHECK</h3>
                            <p className="text-gray-300 mb-4">
                                "Je hebt drie cijfers gevonden? <br />
                                Laat x, y en z de cijfers zijn."
                            </p>
                            <div className="text-3xl font-black text-white bg-black/40 p-4 rounded-lg inline-block border border-amber-900/50">
                                (x + y + z) × 5 = 30
                            </div>
                            <p className="text-sm text-gray-500 mt-4 italic">
                                Voer de VOLLEDIGE berekening in (bijv: (1+2+3)x5=30)
                            </p>
                        </div>

                        {/* Input */}
                        <div className={`flex gap-3 ${shake ? 'animate-shake' : ''}`}>
                            <input
                                type="text"
                                maxLength={30}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="(x+y+z) x 5 = 30"
                                className="flex-1 bg-black border-2 border-emerald-700 h-16 rounded text-center text-2xl font-mono text-white outline-none focus:border-emerald-400 transition-all placeholder:text-gray-800"
                            />
                            <button
                                onClick={handleCheck}
                                className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 h-16 rounded font-bold text-xl shadow-lg transition-all active:scale-95 border border-emerald-500"
                            >
                                ENTER
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Level3;
