import React, { useState } from 'react';

const Level5 = ({ onComplete, onFail }) => {
    const [code, setCode] = useState(['', '', '', '']);
    const [shake, setShake] = useState(false);

    const correctCode = ['4', '9', '2', '5']; // The Meta Code

    const handleInput = (num) => {
        const nextIndex = code.findIndex(d => d === '');
        if (nextIndex !== -1) {
            const newCode = [...code];
            newCode[nextIndex] = num;
            setCode(newCode);

            // Auto-check removed for manual button
        }
    };

    const handleBackspace = () => {
        const filledIndices = code.map((d, i) => d !== '' ? i : -1).filter(i => i !== -1);
        if (filledIndices.length > 0) {
            const lastIndex = filledIndices[filledIndices.length - 1];
            const newCode = [...code];
            newCode[lastIndex] = '';
            setCode(newCode);
        }
    };

    const checkCode = () => {
        const entered = code.join('');
        const expected = correctCode.join('');

        console.log(`Checking code. Entered: "${entered}", Expected: "${expected}"`);

        if (entered === expected) {
            onComplete();
        } else {
            setShake(true);
            if (onFail) {
                // Show them what they entered so they know if they clicked wrong
                onFail(10, `FOUT! CODE: ${entered} IS ONJUIST.`);
            }
            setTimeout(() => {
                setShake(false);
                setCode(['', '', '', '']);
            }, 1000); // 1s wait to read
        }
    };

    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/assets/bunker_door.png')] bg-cover bg-center opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

            {/* Content */}
            <div className="relative z-10 max-w-md w-full bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl border-4 border-gray-700 shadow-2xl">
                <h2 className="text-3xl font-black text-gray-200 text-center mb-2 uppercase tracking-widest">Toegang Bunker</h2>
                <p className="text-gray-400 text-center mb-8 font-mono text-sm">VOER DE 4 CIJFERS IN DIE JE HEBT VERZAMELD</p>

                {/* Display */}
                <div className={`flex justify-center gap-4 mb-8 ${shake ? 'animate-shake' : ''}`}>
                    {code.map((digit, i) => (
                        <div key={i} className={`w-14 h-20 bg-black border-2 flex items-center justify-center text-4xl font-mono rounded shadow-inner transition-all ${digit ? 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-gray-800 text-gray-700'}`}>
                            {digit}
                        </div>
                    ))}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleInput(num.toString())}
                            className="h-16 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg text-2xl font-bold text-white shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => handleInput('0')}
                        className="col-start-2 h-16 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg text-2xl font-bold text-white shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        className="col-start-3 h-16 bg-red-900/50 hover:bg-red-800/50 active:bg-red-800 rounded-lg text-xl font-bold text-red-200 shadow-lg border-b-4 border-red-950 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
                    >
                        ⌫
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    onClick={checkCode}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-2xl font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2 transition-all"
                >
                    OPEN BUNKER
                </button>
            </div>
        </div>
    );
};

export default Level5;
