import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import TopBar from './ui/TopBar';
import Inventory from './ui/Inventory';
import StoryModal from './ui/StoryModal';
import AdminTerminal from './ui/AdminTerminal';

// Levels
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import Level4 from './levels/Level4';
import Level5 from './levels/Level5';

const LevelIntro = ({ onStart }) => {
    const [step, setStep] = useState('title'); // 'title' or 'story'

    if (step === 'title') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 relative bg-black">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-40 bg-[url('/assets/radio_bg.png')] bg-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="relative z-10 flex flex-col items-center max-w-2xl">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
                        DE <span className="text-red-700">VERZETSCODE</span>
                    </h1>
                    <div className="text-gray-300 text-xl mb-16 leading-relaxed bg-black/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                        <p className="mb-4 font-bold text-white text-2xl">Winter 1943. De geheime zender.</p>
                        <p>Jullie missie: herstel het radiocontact en kraak de Enigma-code voordat de peilwagen arriveert.</p>
                    </div>
                    <button
                        onClick={() => setStep('story1')}
                        className="group relative px-12 py-6 bg-red-700 hover:bg-red-600 text-white text-3xl font-black rounded-2xl shadow-[0_15px_60px_rgba(185,28,28,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-4 cursor-pointer"
                    >
                        <span className="animate-pulse">START MISSIE</span>
                        <span className="text-4xl">➡️</span>
                    </button>
                </div>
            </div>
        );
    }

    // Story Screen PART 1
    if (step === 'story1') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 relative bg-black animate-fadeIn">
                <div className="max-w-4xl text-left space-y-6 leading-relaxed text-gray-300 font-serif text-lg md:text-xl overflow-y-auto max-h-[80vh] p-4 custom-scrollbar">
                    <p>
                        "Anna," zei Paul, "de boodschap moet naar de groep in het boshuis. Maar we kunnen niemand vertrouwen, en we mogen geen sporen achterlaten. Kun je het doen?" Anna knikte. Ze wist wat hij bedoelde. Ze had een manier gevonden om geheime boodschappen door te geven via een alledaags object: boeken. De planken in haar huis waren volgestouwd met literatuur en andere teksten. Paul gaf haar een klein, versleten boek. Het was een oud exemplaar van <em>De Avonturen van Sherlock Holmes</em>, een onschuldige keuze die niemand zou verdenken. Dit boek heb ik zien staan in het boshuis. De pagina's waren al wat verweerd door de tijd, maar Anna wist precies wat ze moest doen.
                    </p>
                    <p>
                        Ze opende het boek bij een willekeurige pagina en keek naar de tekst. Ze had eerder al een systeem bedacht, gebaseerd op een eenvoudige cijfersleutel: de eerste letters van de woorden op een bepaalde regel van en bepaalde bladzijde zouden samen de geheime boodschap vormen. Ze had haar vriendin Betty al geleerd hoe ze het bericht konden lezen zonder dat iemand anders het doorhad. Nadat Anne het bericht gemaakt had, bracht Paul het snel naar de buurvrouw. De buurvrouw bracht het bericht vervolgens naar het boshuis. Hier ontving Betty en begon het bericht al snel te vertalen. De tekening op het bericht verwees duidelijk naar het juiste boek. "Ik begin," fluisterde Betty. 41-27-03 stond als eerste code op papier. Ze bladerde snel naar bladzijde 41 van haar boek en schoof met haar vinger naar regel 27. Het derde woord was daar “zijn”. De “z” dacht ze. En ging door naar de volgende code. Ze schreef de letters snel op een klein stukje papier.
                    </p>

                    <div className="pt-8 flex justify-center w-full">
                        <button
                            onClick={() => setStep('story2')}
                            className="px-12 py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            VERDER ➡️
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Story Screen PART 2
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 relative bg-black animate-fadeIn">
            <div className="max-w-4xl text-left space-y-6 leading-relaxed text-gray-300 font-serif text-lg md:text-xl overflow-y-auto max-h-[80vh] p-4 custom-scrollbar">
                <p>
                    Het was een koude winteravond in 1943. De stad was in de ban van de Duitse bezetting, en overal heerste angst. In het kleine, verlaten huis aan de rand van de stad zaten twee mensen, fluisterend in de schemering. De ene was Anna, een jonge vrouw die deel uitmaakte van het verzet, en de andere was haar goede vriend, Paul. Paul had net een belangrijke informatiebron verloren. Ze moesten snel reageren, maar de risico’s waren groot. Ze keken naar elkaar, beide wetend dat het leven van hun medestrijders op het spel stond.
                </p>
                <p className="text-emerald-400 font-bold border-l-4 border-emerald-500 pl-4 my-6">
                    Het bericht kwam langzaam tot leven: ze moesten onmiddellijk vluchten naar een geheime bunker diep in het bos. Maar de route was niet zonder gevaar; ze moesten eerst een reeks missies voltooien om de locatie veilig te kunnen betreden.
                </p>

                <div className="pt-8 flex justify-center w-full">
                    <button
                        onClick={onStart}
                        className="px-12 py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        START LEVEL 1 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

const Game = () => {
    const {
        gameState,
        startGame,
        addToInventory,
        advanceLevel,
        finishGame,
        penalizeTime,
        formatTime,
        previousLevel,
        toggleTimer
    } = useGameState();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', text: '' });
    const [errorEffect, setErrorEffect] = useState(false);
    const [nightVision, setNightVision] = useState(false); // New Admin Feature
    const [noClip, setNoClip] = useState(false); // New Admin Feature: No Clip (Phase through walls)
    const [levelDebugData, setLevelDebugData] = useState(null); // Map Data for Admin
    const [adminOpen, setAdminOpen] = useState(false);

    const handleStart = () => {
        startGame();
        showStory("Level 1: Het Radiostation", "Het verzet probeert contact te leggen.\n'De zender is kapot', zegt Anna. 'Repareer de stroom en vind de frequentie.'");
    };

    const showStory = (title, text) => {
        setModalContent({ title, text });
        setModalOpen(true);
    };

    const handleError = (penaltySeconds = 60, customMessage = null) => {
        setErrorEffect(true);
        penalizeTime(penaltySeconds);

        // Format message based on penalty
        const text = customMessage || `Verkeerde code! De klok telt sneller af... (-${penaltySeconds < 60 ? penaltySeconds + ' seconden' : (penaltySeconds / 60) + ' minuut'})`;

        showStory("FOUT!", text);
        setTimeout(() => setErrorEffect(false), 500);
    };

    const handleHint = () => {
        const hints = {
            1: "Elk antwoord is het begin van de volgende som. Maak de hele ketting af.",
            2: "De volgorde staat ergens op een kaart geschreven...",
            3: "Let op de rekenvolgorde: Ker keer gaat voor Plus en Min.",
            4: "De duisternis verbergt 4 geheimen in de uithoeken van de kaart."
        };
        showStory("HINT", hints[gameState.currentLevel] || "Zoek goed!");
    };

    const handleInventoryClick = (item) => {
        const descriptions = {
            'map': "Een kaart met symbolen: 🌲=3, 🌟=1, 🔥=??",
            'key': "Een zware ijzeren sleutel.",
            'flashlight': "Een sterke UV-zaklamp.",
            'note': "Een document met wiskundige formules."
        };
        showStory(item.toUpperCase(), descriptions[item] || "Een nuttig voorwerp.");
    };

    const navigateToLevel = (levelId) => {
        switch (levelId) {
            case 1:
                addToInventory('map');
                showStory("Level 1 Voltooid", "Terwijl de sneeuw onder hun laarzen kraakte en de Duitse patrouilles in de verte te horen waren, stuitten ze op de eerste hindernis: een metalen kistje verborgen onder de wortels van een oude eik. Er zat geen slot op, maar er stonden sommen in het metaal gekrast. Met bevroren vingers kraakten ze de codes: 144 / 12 + (5 x 4) werd 32, en (9 x 9) - 17 werd 64. Deze getallen gaven de juiste coördinaten aan om niet in een hinderlaag te lopen.");
                break;
            case 2:
                addToInventory('key');
                showStory("Level 2 Voltooid", "Daarna moesten ze de \"goede plaatjes\" verzamelen. In holle boomstammen langs het pad lagen verschillende houten fiches. Alleen de plaatjes die overeenkwamen met de verborgen aanwijzingen uit het Sherlock Holmes-boek waren de juiste: de pijp, het vergrootglas en de viool. Met deze fiches op zak haastten ze zich verder naar de bunker.");
                break;
            case 3:
                addToInventory('flashlight');
                showStory("Level Voltooid", "De kist springt open! Je pakt de zaklamp. In de kist staat gekrast: 2");
                break;
            case 4:
                showStory("Bunkerdeur Gevonden", "Vlak voor de massieve betonnen muur hield Paul de groep tegen. \"De hoofdgrendel zit op slot! We moeten de vier cijfers zoeken die hier in het bos verstopt zijn.\" De groep verspreidde zich koortsachtig. Anna vond een 8 achter een wegwijzer; Betty vond een 2 onder een bemoste steen bij de beek; Paul ontdekte een 9 in een vogelhuisje en het laatste papiertje met een 4 zat verborgen onder de voerbak van een jagershut.\n\nEindelijk stonden ze voor de loodzware ijzeren deur. Anna plaatste de houten plaatjes in de uitsparingen en Paul hield zijn adem in. Hij voerde de eerste code van de bunker in die ze in het bos hadden verzameld: 8 - 2 - 9 - 4.\n\nEr klonk een zwaar, mechanisch geluid van raderen die in elkaar grepen. Maar de deur bewoog nog niet...... er is nog een slot");
                break;
            case 5:
                console.log("GAME WON! Triggering finishGame...");
                finishGame();
                return;
            default: break;
        }
        advanceLevel();
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-black text-white font-sans overflow-hidden select-none">
            {/* Top Bar (Fixed) */}
            <div className="h-16 flex-shrink-0 z-50 border-b border-white/10 shadow-lg">
                <TopBar
                    timeRemaining={gameState.timeRemaining}
                    formatTime={formatTime}
                    onHintClick={handleHint}
                    onAdminClick={() => setAdminOpen(true)}
                />
            </div>

            {/* Game Screen (Flexible) */}
            <main className="flex-1 relative min-h-0 bg-[#0a0a0a] shadow-inner">
                {/* Error Flash Effect (Red Ring / Vignette) */}

                {/* 1. INTRO */}
                {gameState.gameStatus === 'intro' && <LevelIntro onStart={handleStart} />}

                {/* 2. PLAYING - Only show levels if playing */}
                {gameState.gameStatus === 'playing' && (
                    <>
                        {gameState.currentLevel === 1 && <Level1 onComplete={() => navigateToLevel(1)} onFail={handleError} />}
                        {gameState.currentLevel === 2 && <Level2 onComplete={() => navigateToLevel(2)} onFail={handleError} />}
                        {gameState.currentLevel === 3 && <Level3 onComplete={() => navigateToLevel(3)} onFail={handleError} />}
                        {gameState.currentLevel === 4 && <Level4 onComplete={() => navigateToLevel(4)} onFail={handleError} nightVision={nightVision} noClip={noClip} onLevelData={setLevelDebugData} />}
                        {gameState.currentLevel === 5 && <Level5 onComplete={() => navigateToLevel(5)} onFail={handleError} />}
                    </>
                )}

                {/* 3. WON SCREEN - Exclusive View */}
                {gameState.gameStatus === 'won' && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black',
                            zIndex: 9999,
                            textAlign: 'center'
                        }}
                        className="animate-fadeIn text-white"
                    >
                        <h2 className="text-7xl font-black text-emerald-500 mb-8 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)] tracking-tighter">BUNKER GEKRAAKT!</h2>
                        <div className="text-xl text-gray-300 max-w-2xl space-y-4 px-6 text-center leading-relaxed">
                            <p>Achter het eerste paneel schoof een tweede metalen plaat weg, die een laatste, geheimzinnig slot onthulde. Dit slot had geen cijfers, maar vier draaischijven met vreemde symbolen. Paul herinnerde zich een verborgen aanwijzing uit het boek. "De volgorde van de plaatjes!" fluisterde hij. Hij draaide aan de schijven tot ze precies overeenkwamen met de posities van de pijp, het vergrootglas en de viool.</p>
                            <p>Met een laatste, luide KLIK schoot de hoofdgrendel weg. De loodzware deur zwaaide eindelijk open en onthulde de duisternis van de bunker. Ze doken naar binnen, vlak voordat het zoeklicht van de vijand hun spoor zou kruisen. De bunker was gekraakt; ze waren binnen.</p>
                        </div>
                        <button onClick={() => window.location.reload()} className="mt-8 px-12 py-4 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all border-b-4 border-emerald-950 active:border-b-0 active:translate-y-1">Opnieuw Spelen</button>
                    </div>
                )}

                {/* 4. LOST SCREEN - Exclusive View */}
                {gameState.gameStatus === 'lost' && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black',
                            zIndex: 9999,
                            textAlign: 'center'
                        }}
                        className="animate-fadeIn text-white"
                    >
                        <h2 className="text-9xl font-black text-red-600 mb-8 drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse">VERLOREN</h2>
                        <p className="text-3xl text-gray-300 mb-12 font-bold tracking-widest">DE TIJD IS OM</p>
                        <p className="text-xl text-gray-500 mb-16 max-w-2xl">De vijand heeft het signaal uitgepeild. De missie is mislukt.</p>
                        <button onClick={() => window.location.reload()} className="px-16 py-6 bg-red-700 hover:bg-red-600 text-white text-3xl font-black rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.5)] border-4 border-red-900">
                            OPNIEUW
                        </button>
                    </div>
                )}
            </main>

            {/* Inventory (Fixed) */}
            <div className="h-24 md:h-32 flex-shrink-0 z-50 border-t border-white/10">
                <Inventory items={gameState.inventory} onItemClick={handleInventoryClick} />
            </div>

            <StoryModal
                isOpen={modalOpen}
                title={modalContent.title}
                text={modalContent.text}
                onContinue={() => setModalOpen(false)}
            />

            {/* Copyright Footer (Bottom Right) */}
            <div className="absolute bottom-1 right-2 z-[60] text-[10px] text-gray-500 font-mono tracking-widest opacity-50 pointer-events-none">
                © {new Date().getFullYear()} TIM VAN DEN BLEEKEN
            </div>

            {/* Admin Terminal Overlay (Top Level) */}
            <AdminTerminal
                isOpen={adminOpen}
                onClose={() => setAdminOpen(false)}
                onSkipLevel={() => {
                    advanceLevel();
                    setAdminOpen(false);
                }}
                onPreviousLevel={() => {
                    previousLevel();
                    setAdminOpen(false);
                }}
                onToggleTimer={toggleTimer}
                isTimerPaused={gameState.isPaused}
                currentLevel={gameState.currentLevel}
                nightVision={nightVision}
                onToggleNightVision={() => setNightVision(!nightVision)}
                noClip={noClip}
                onToggleNoClip={() => setNoClip(!noClip)}
                levelDebugData={levelDebugData}
            />
            {/* Error Flash Effect (Global Red Ring / Vignette) */}
            {errorEffect && (
                <div className="fixed inset-0 z-[9000] pointer-events-none animate-pulse shadow-[inset_0_0_150px_50px_rgba(220,38,38,0.95)] border-[20px] border-red-600/60" />
            )}
        </div>
    );
};

export default Game;
