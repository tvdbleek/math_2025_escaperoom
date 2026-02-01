import { useState, useEffect } from 'react';

const INITIAL_TIME = 60 * 60; // 60 minutes in seconds

export const useGameState = () => {
    const [gameState, setGameState] = useState({
        currentLevel: 0, // 0 = Intro, 1 = Safe, 2 = Switches, 3 = Code, 4 = Flashlight, 5 = End
        inventory: [],
        timeRemaining: INITIAL_TIME,
        gameStatus: 'intro', // intro, playing, won, lost
        history: [], // For narrative log if needed
    });

    const [isPaused, setIsPaused] = useState(false);

    // Timer logic
    useEffect(() => {
        let timer;
        if (gameState.gameStatus === 'playing' && !isPaused) {
            timer = setInterval(() => {
                setGameState(prev => {
                    if (prev.timeRemaining <= 0) {
                        return { ...prev, gameStatus: 'lost' };
                    }
                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState.gameStatus, isPaused]);

    const startGame = () => {
        setGameState(prev => ({ ...prev, gameStatus: 'playing', currentLevel: 1 }));
    };

    const addToInventory = (item) => {
        setGameState(prev => {
            if (prev.inventory.includes(item)) return prev;
            return { ...prev, inventory: [...prev.inventory, item] };
        });
    };

    const advanceLevel = () => {
        setGameState(prev => ({
            ...prev,
            currentLevel: prev.currentLevel + 1
        }));
    };

    const previousLevel = () => {
        setGameState(prev => ({
            ...prev,
            currentLevel: Math.max(1, prev.currentLevel - 1)
        }));
    };

    const toggleTimer = () => {
        setIsPaused(prev => !prev);
    };

    const finishGame = () => {
        setGameState(prev => ({ ...prev, gameStatus: 'won' }));
    };

    const penalizeTime = (seconds) => {
        setGameState(prev => ({
            ...prev,
            timeRemaining: Math.max(0, prev.timeRemaining - seconds)
        }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return {
        gameState: { ...gameState, isPaused },
        startGame,
        addToInventory,
        advanceLevel,
        previousLevel,
        toggleTimer,
        finishGame,
        penalizeTime,
        formatTime
    };
};
