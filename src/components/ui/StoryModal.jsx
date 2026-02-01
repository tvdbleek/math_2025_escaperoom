import React from 'react';

const StoryModal = ({ title, text, onContinue, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-emerald-500/30 rounded-lg max-w-2xl w-full p-8 shadow-2xl relative animate-fadeIn">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-2 font-mono tracking-wider">{title}</h2>
                    <div className="h-1 w-20 bg-emerald-500/50"></div>
                </div>

                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed mb-8 font-serif text-lg">
                    {text.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 last:mb-0">{line}</p>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onContinue}
                        className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold tracking-wider transition-all hover:scale-105 shadow-lg shadow-emerald-900/50"
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;
