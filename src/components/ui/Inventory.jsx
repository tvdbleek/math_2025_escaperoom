import React from 'react';

const ITEM_ICONS = {
    'map': '🗺️',
    'key': '🔑',
    'flashlight': '🔦',
    'note': '📄'
};

const Inventory = ({ items, onItemClick }) => {
    return (
        <div className="w-full h-full bg-gray-900/95 border-t border-white/30 flex items-center justify-center gap-6 relative shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="absolute top-1 left-4 text-xs text-gray-400 uppercase tracking-widest font-bold">
                INVENTORY
            </div>

            {items && items.length > 0 ? (
                items.map((item, index) => (
                    <button
                        key={index}
                        className="w-20 h-20 bg-white/10 border-2 border-white/20 rounded-xl flex items-center justify-center text-5xl hover:bg-white/20 hover:border-white/50 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg"
                        title={item}
                        onClick={() => onItemClick && onItemClick(item)}
                    >
                        {ITEM_ICONS[item] || '❓'}
                    </button>
                ))
            ) : (
                <div className="text-gray-500 text-lg italic font-mono opacity-50 select-none">
                    - Leeg -
                </div>
            )}
        </div>
    );
};

export default Inventory;
