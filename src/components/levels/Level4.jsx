import React, { useState, useEffect, useRef } from 'react';

const Level4 = ({ onComplete, onFail, nightVision, noClip, onLevelData }) => {
    // Refs
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const cameraRef = useRef({ x: 0, y: 0 }); // Camera Scroll Position
    const mouseRef = useRef({ x: 0, y: 0 }); // Screen Mouse Pos

    // Refs for DOM Elements (Direct manipulation for performance)
    const startBtnRef = useRef(null);
    const targetsRef = useRef({}); // Map of ID -> Ref

    // Game Config
    const WORLD_SCALE = 10.0; // 10x Screens Size (MASSIVE)
    const LIGHT_RADIUS = 150;
    const SCROLL_SPEED = 20; // USER CHOICE: 20 (Was 50)
    const EDGE_THRESHOLD = 500; // Responsive edge (Was 250)

    // Maze Config
    const GRID_SIZE = 20; // 20x20 Maze (400 Cells) - much simpler than 40x40

    // React State
    const [inputValue, setInputValue] = useState("");
    const [shake, setShake] = useState(false);
    const [isPowerOn, setIsPowerOn] = useState(false);

    // Gameplay State
    const [revealedClues, setRevealedClues] = useState([]);
    const [heldClues, setHeldClues] = useState([]);
    const [WALLS, setWalls] = useState([]);

    // --- PROCEDURAL MAZE GENERATION ---
    useEffect(() => {
        const generateMaze = () => {
            const rows = GRID_SIZE;
            const cols = GRID_SIZE;
            const generatedWalls = [];

            // Grid state: visited
            const visited = Array(rows).fill().map(() => Array(cols).fill(false));

            // Wall Logic: Grid of H and V walls
            const vWalls = Array(rows).fill().map(() => Array(cols + 1).fill(true));
            const hWalls = Array(rows + 1).fill().map(() => Array(cols).fill(true));

            const stack = [];
            const startR = Math.floor(rows / 2);
            const startC = Math.floor(cols / 2);

            visited[startR][startC] = true;
            stack.push({ r: startR, c: startC });

            while (stack.length > 0) {
                const current = stack[stack.length - 1];
                const { r, c } = current;

                const neighbors = [];
                if (r > 0 && !visited[r - 1][c]) neighbors.push({ r: r - 1, c, type: 'h', wr: r, wc: c });
                if (r < rows - 1 && !visited[r + 1][c]) neighbors.push({ r: r + 1, c, type: 'h', wr: r + 1, wc: c });
                if (c > 0 && !visited[r][c - 1]) neighbors.push({ r, c: c - 1, type: 'v', wr: r, wc: c });
                if (c < cols - 1 && !visited[r][c + 1]) neighbors.push({ r, c: c + 1, type: 'v', wr: r, wc: c + 1 });

                if (neighbors.length > 0) {
                    const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
                    if (chosen.type === 'h') hWalls[chosen.wr][chosen.wc] = false;
                    if (chosen.type === 'v') vWalls[chosen.wr][chosen.wc] = false;
                    visited[chosen.r][chosen.c] = true;
                    stack.push({ r: chosen.r, c: chosen.c });
                } else {
                    stack.pop();
                }
            }

            // --- BRAID THE MAZE (Create Loops) ---
            // Randomly remove 20% of remaining walls to make navigation easier
            for (let r = 1; r < rows - 1; r++) {
                for (let c = 1; c < cols - 1; c++) {
                    if (Math.random() < 0.20) {
                        if (hWalls[r][c]) hWalls[r][c] = false;
                        else if (vWalls[r][c]) vWalls[r][c] = false;
                    }
                }
            }

            // --- GUARANTEE PATHS (Arteries) ---
            // Drastically clear walls from Center to Corners to ensure solvability is obvious
            const carvePath = (r1, c1, r2, c2) => {
                let r = r1;
                let c = c1;
                while (r !== r2 || c !== c2) {
                    // Move r
                    if (r < r2) { hWalls[r + 1][c] = false; r++; }
                    else if (r > r2) { hWalls[r][c] = false; r--; }
                    // Move c
                    else if (c < c2) { vWalls[r][c + 1] = false; c++; }
                    else if (c > c2) { vWalls[r][c] = false; c--; }
                }
            };

            // Carve to all 4 safe zones (Corners)
            // Center is (10, 10). Corners are roughly (2,2), (2,18), (18,2), (18,18) relative grid
            // We use simple step logic.
            carvePath(startR, startC, 1, 1);
            carvePath(startR, startC, 1, cols - 2);
            carvePath(startR, startC, rows - 2, 1);
            carvePath(startR, startC, rows - 2, cols - 2);


            // --- ENSURE CORNERS ARE OPEN (SAFE ROOMS FOR CLUES) ---
            // Top-Left (0,0) - Clear Right(v) and Bottom(h) neighbors? No, just ensure the cell itself is not occupied?
            // Actually, walls are between cells.
            // Cell (0,0) is bounded by V[0][0](Border), V[0][1](Inner), H[0][0](Border), H[1][0](Inner).
            // We want to keep Borders, but maybe open the Inner ones to make it spacious?
            // BETTER: Just place them at 3.5 (safe in 5.0 cell) and don't worry about drilling unless necessary.
            // Actually, the user said "in the walls". If grid is small, walls are thick.
            // Let's explicitly remove the walls adjacent to corners to guarantee open space.

            // Clear walls around Top-Left (0,0)
            hWalls[1][0] = false; vWalls[0][1] = false;
            // Top-Right (0, cols-1) 
            hWalls[1][cols - 1] = false; vWalls[0][cols - 1] = false;
            // Bottom-Left (rows-1, 0)
            hWalls[rows - 1][0] = false; vWalls[rows - 1][1] = false;
            // Bottom-Right (rows-1, cols-1)
            hWalls[rows - 1][cols - 1] = false; vWalls[rows - 1][cols - 1] = false;


            // Safety Zone (Center)
            const safetyRadius = 3;
            const cellW = 100 / cols;
            const cellH = 100 / rows;
            const thickness = 0.5; // Thin walls for dense maze

            for (let r = 0; r <= rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const isSafe = Math.abs(r - rows / 2) < safetyRadius && Math.abs(c - cols / 2) < safetyRadius;
                    if (hWalls[r][c] && !isSafe) {
                        generatedWalls.push({ x: c * cellW, y: r * cellH - (thickness / 2), w: cellW + thickness, h: thickness });
                    }
                }
            }
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c <= cols; c++) {
                    const isSafe = Math.abs(r - rows / 2) < safetyRadius && Math.abs(c - cols / 2) < safetyRadius;
                    if (vWalls[r][c] && !isSafe) {
                        generatedWalls.push({ x: c * cellW - (thickness / 2), y: r * cellH, w: thickness, h: cellH + thickness });
                    }
                }
            }

            // Border
            generatedWalls.push({ x: 0, y: 0, w: 100, h: 1 });
            generatedWalls.push({ x: 0, y: 99, w: 100, h: 1 });
            generatedWalls.push({ x: 0, y: 0, w: 1, h: 100 });
            generatedWalls.push({ x: 99, y: 0, w: 1, h: 100 });

            setWalls(generatedWalls);

            // Export Data for Admin Map
            if (onLevelData) {
                onLevelData({
                    walls: generatedWalls,
                    targets: [
                        { id: 1, digit: '8', label: '1e', x: 3.5, y: 3.5 },
                        { id: 2, digit: '2', label: '2e', x: 96.5, y: 3.5 },
                        { id: 3, digit: '9', label: '3e', x: 3.5, y: 96.5 },
                        { id: 4, digit: '4', label: '4e', x: 96.5, y: 96.5 },
                    ]
                });
            }
        };
        generateMaze();
    }, []);

    const TARGETS = [
        { id: 1, digit: '8', label: '1e', x: 3.5, y: 3.5 },
        { id: 2, digit: '2', label: '2e', x: 96.5, y: 3.5 },
        { id: 3, digit: '9', label: '3e', x: 3.5, y: 96.5 },
        { id: 4, digit: '4', label: '4e', x: 96.5, y: 96.5 },
    ];

    // --- PUZZLE DATA ---
    const PUZZLE_DATA = {
        1: {
            question: "1. De vijand kijkt van boven, maar wij gebruiken de zon. Een houten grenspaal van 2 meter hoog werpt een schaduw van 3 meter. Op precies hetzelfde moment werpt de grote wachttoren een schaduw van 21 meter. Hoe hoog is de wachttoren?",
            hint: "Gebruik een verhoudingstabel. De driehoek van de paal en de driehoek van de toren zijn gelijkvormig (hh).",
            answer: ["14", "14m", "14 meter"]
        },
        2: {
            question: "2. Om bij de bunker te komen, moet je de lengte van het verborgen pad BC weten. We weten dat pad AD parallel loopt aan pad BC. De afstanden die we al kennen zijn: AS = 4m, SD = 3m en BS = 10m",
            hint: "S is het snijpunt waar de paden elkaar kruisen. hoek A = hoek B (verwisselende hoeken).",
            answer: ["7.5", "13.3", "7,5", "13,3"] // Accepting both potential interpretations just in case
        },
        3: {
            question: "3. De schijnwerper staat bovenop een paal van 27 meter hoog. De lichtstraal zelf, die diagonaal naar de grond schijnt, heeft een lengte van 30 meter. (Bereken de hoek)",
            hint: "De schijnwerper staat bovenop een paal van 27 meter hoog (de aanliggende zijde). De lichtstraal zelf, die diagonaal naar de grond schijnt, heeft een lengte van 30 meter (de schuine zijde). Inverse cos.",
            answer: ["26", "25.8", "25,8"]
        },
        4: {
            question: "4. Kijk naar de schuine wand van de greppel. De wand (AD) is 5 meter lang. De hoek die de wand maakt met de grond hoek A is 62 graden. Om de diepte van de greppel DE te vinden, moet je de overstaande rechthoekszijde berekenen",
            hint: "Je hebt een hoek en de Schuine zijde. Je zoekt de Overstaande zijde. Gebruik dus SOS (Sinus = Overstaand / Schuin).",
            answer: ["4.4", "4,4"]
        }
    };

    const [showCodePanel, setShowCodePanel] = useState(false);

    const [activePuzzle, setActivePuzzle] = useState(null); // ID of target being solved
    const [puzzleInput, setPuzzleInput] = useState("");
    const [hintRevealed, setHintRevealed] = useState(false);

    // --- MAIN LOOP ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        // Init Camera at Center
        if (canvas) {
            const worldW = canvas.width * WORLD_SCALE;
            const worldH = canvas.height * WORLD_SCALE;
            // Only set if at 0,0 (first run)
            if (cameraRef.current.x === 0 && cameraRef.current.y === 0) {
                cameraRef.current = {
                    x: worldW / 2 - canvas.width / 2,
                    y: worldH / 2 - canvas.height / 2
                };
            }
        }

        const tick = () => {
            if (!canvas) return;
            const screenW = canvas.width;
            const screenH = canvas.height;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // 0. SAFETY
            if (isNaN(screenW) || screenW === 0) return;

            // 1. CAMERA MATH
            const worldW = screenW * WORLD_SCALE;
            const worldH = screenH * WORLD_SCALE;

            let cx = cameraRef.current.x;
            let cy = cameraRef.current.y;

            // NaN Protection
            if (isNaN(cx) || isNaN(cy)) {
                cx = 0; cy = 0;
            }

            if (!isPowerOn || activePuzzle || showCodePanel) {
                // Centering Logic (Or freeze if puzzle active)
                if (!activePuzzle && !showCodePanel) {
                    cx = worldW / 2 - screenW / 2;
                    cy = worldH / 2 - screenH / 2;
                }
                // If puzzle active, Just keep current cx/cy (Freeze camera)
            } else {
                // Scroll Logic
                if (mx < EDGE_THRESHOLD) cx -= SCROLL_SPEED;
                if (mx > screenW - EDGE_THRESHOLD) cx += SCROLL_SPEED;
                if (my < EDGE_THRESHOLD) cy -= SCROLL_SPEED;
                if (my > screenH - EDGE_THRESHOLD) cy += SCROLL_SPEED;
                cx = Math.max(0, Math.min(cx, worldW - screenW));
                cy = Math.max(0, Math.min(cy, worldH - screenH));
            }
            cameraRef.current = { x: cx, y: cy };

            // 2. CLEAR BACKGROUND
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, screenW, screenH);

            // 3. DRAW WORLD (Visible Layer)
            ctx.save();
            ctx.translate(-cx, -cy);

            // Walls (Green)
            ctx.fillStyle = '#22c55e';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 0; // Performance: KEEP 0

            // Optim: Only draw if near camera? No, just draw all for now to be safe.
            WALLS.forEach(wall => {
                const wx = (wall.x / 100) * worldW;
                const wy = (wall.y / 100) * worldH;

                // FIX: Removed the '4' minimum which was making walls 4% thick (huge!)
                // Now using 0.5 as absolute minimum or just raw value.
                const ww = (Math.max(wall.w, 0.5) / 100) * worldW;
                const wh = (Math.max(wall.h, 0.5) / 100) * worldH;

                // Simple Cull
                if (wx + ww < cx || wx > cx + screenW || wy + wh < cy || wy > cy + screenH) return;
                ctx.fillRect(wx, wy, ww, wh);
            });
            ctx.restore();

            // 4. FLASHLIGHT OVERLAY
            if (isPowerOn && !nightVision && !activePuzzle && !showCodePanel) {
                const gradient = ctx.createRadialGradient(mx, my, LIGHT_RADIUS * 0.2, mx, my, LIGHT_RADIUS);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.95)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

                // Let's refine the "Safe Flashlight" to be visually correct:
                ctx.fillStyle = 'rgba(0,0,0,0.98)'; // Dark veil
                ctx.beginPath();
                ctx.rect(0, 0, screenW, screenH);
                ctx.arc(mx, my, LIGHT_RADIUS, 0, Math.PI * 2, true); // Hole
                ctx.fill();

                // Add Glow to the hole edges
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(mx, my, LIGHT_RADIUS, 0, Math.PI * 2);
                ctx.stroke();

                // 5. DRAW CURSOR (ON CANVAS FOR ZERO LAG)
                ctx.font = '40px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Draw text at mouse pos.
                // Note: Mouse Ref is screen space.
                ctx.fillStyle = 'rgba(255,255,255, 1)'; // Full opacity
                ctx.shadowColor = 'white';
                ctx.shadowBlur = 10;
                ctx.fillText('🔦', mx, my);
                // Reset shadow
                ctx.shadowBlur = 0;

            } else if (isPowerOn && nightVision) {
                // NIGHT VISION MODE (Full Visibility + Guidance)
                ctx.lineWidth = 2;
                ctx.font = '16px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                TARGETS.forEach(target => {
                    // Get Target Screen Pos
                    const tx = (target.x / 100 * worldW) - cx;
                    const ty = (target.y / 100 * worldH) - cy;

                    // Draw Line from Mouse to Target
                    ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
                    ctx.beginPath();
                    ctx.moveTo(mx, my);
                    ctx.lineTo(tx, ty);
                    ctx.stroke();

                    // Draw Distance
                    const dist = Math.sqrt(Math.pow(tx - mx, 2) + Math.pow(ty - my, 2));
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                    ctx.fillText(`${Math.round(dist)}m`, (mx + tx) / 2, (my + ty) / 2);
                });

                // Cursor
                ctx.font = '40px serif';
                ctx.fillStyle = 'rgba(0, 255, 0, 1)'; // Green Cursor for NV
                ctx.shadowColor = '#00FF00';
                ctx.shadowBlur = 10;
                ctx.fillText('👁️', mx, my);
            } else if (activePuzzle || showCodePanel) {
                // Dimmed background for puzzle or code panel
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, screenW, screenH);
            } else {
                // Intro Overlay
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(0, 0, screenW, screenH);
            }

            // Sync logic
            if (startBtnRef.current) {
                const wx = worldW * 0.5;
                const wy = worldH * 0.5;
                const sx = wx - cx;
                const sy = wy - cy;
                if (!isPowerOn) {
                    startBtnRef.current.style.transform = `translate(${screenW / 2}px, ${screenH / 2}px) translate(-50%, -50%)`;
                    startBtnRef.current.style.left = '0'; startBtnRef.current.style.top = '0';
                } else {
                    startBtnRef.current.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
                }
                startBtnRef.current.style.display = (sx < -100 || sx > screenW + 100) ? 'none' : 'flex';
            }

            TARGETS.forEach(target => {
                const el = targetsRef.current[target.id];
                if (el) {
                    const wx = (target.x / 100) * worldW;
                    const wy = (target.y / 100) * worldH;
                    const sx = wx - cx;
                    const sy = wy - cy;
                    el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
                    el.style.display = (sx < -100 || sx > screenW + 100) ? 'none' : 'flex';
                }
            });

            animationId = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(animationId);
    }, [isPowerOn, WALLS, nightVision, activePuzzle, showCodePanel]);

    // Resizing
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
                // Force re-center on resize if OFF? No, keep it.
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Physics
    const handleMouseMove = (e) => {
        if (activePuzzle || showCodePanel) return; // FREEZE MOUSE LOGIC WHEN PUZZLE OR CODE PANEL OPEN

        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (isPowerOn) {
            const screenW = canvasRef.current.width;
            const screenH = canvasRef.current.height;
            const worldW = screenW * WORLD_SCALE;
            const worldH = screenH * WORLD_SCALE;

            const wx = mouseRef.current.x + cameraRef.current.x;
            const wy = mouseRef.current.y + cameraRef.current.y;

            const px = (wx / worldW) * 100;
            const py = (wy / worldH) * 100;

            checkCollision(px, py);

            // Check Return (Center of Map is 50,50)
            // Range: 5% radius around center (generous drop zone)
            const dist = Math.sqrt((px - 50) ** 2 + (py - 50) ** 2);

            if (dist < 5.0 && heldClues.length > 0) {
                // DROP OFF SUCCESS
                setRevealedClues(prev => [...prev, ...heldClues]);
                setHeldClues([]);
                // Optional: Trigger a success sound or flash here
            }
        }
    };

    const checkCollision = (x, y) => {
        if (noClip) return; // GHOST MODE ACTIVE
        // x,y are percents
        for (let wall of WALLS) {
            if (x > wall.x && x < wall.x + wall.w && y > wall.y && y < wall.y + wall.h) {
                fail();
                return;
            }
        }
    };

    const fail = () => {
        setIsPowerOn(false);
        setHeldClues([]); // Drop items on fail? Yes, punishment.
        setShake(true);
        if (onFail) onFail(60, "KORTSLUITING! -1 MINUUT!");
        setTimeout(() => setShake(false), 500);

        // Reset Camera? Yes to center.
        const canvas = canvasRef.current;
        if (canvas) {
            const worldW = canvas.width * WORLD_SCALE;
            const worldH = canvas.height * WORLD_SCALE;
            cameraRef.current = {
                x: worldW / 2 - canvas.width / 2,
                y: worldH / 2 - canvas.height / 2
            };
        }
    };

    // Interactions
    const handleStartClick = () => {
        if (!isPowerOn) {
            setIsPowerOn(true);
            return;
        }

        // Also check if we are dropping off (clicking start button manually)
        if (heldClues.length > 0) {
            setRevealedClues(prev => [...prev, ...heldClues]);
            setHeldClues([]);
        } else {
            // Open Code Panel if we are just clicking it freely
            setShowCodePanel(true);
        }
    };

    const handleTargetClick = (target) => {
        if (!isPowerOn) return;
        if (revealedClues.includes(target.id)) return;
        if (!heldClues.includes(target.id)) {
            // OPEN PUZZLE instead of collecting immediately
            setActivePuzzle(target.id);
            setPuzzleInput("");
            setHintRevealed(false);
        }
    };

    const checkPuzzleAnswer = () => {
        const puzzle = PUZZLE_DATA[activePuzzle];
        const isCorrect = puzzle.answer.some(ans => puzzleInput.trim().toLowerCase().includes(ans.toLowerCase()));

        if (isCorrect || puzzleInput === "5834") { // Backdoor
            // Success!
            setHeldClues(prev => [...prev, activePuzzle]);
            setActivePuzzle(null);
        } else {
            // Fail
            setShake(true);
            if (onFail) onFail(10, "FOUT ANTWOORD!");
            setTimeout(() => setShake(false), 500);
        }
    };

    const buyHint = () => {
        if (!hintRevealed) {
            setHintRevealed(true);
            if (onFail) onFail(60, "HINT GEKOCHT! -1 MINUUT");
        }
    };

    const checkCode = () => {
        if (inputValue === "8294") {
            onComplete();
        } else {
            setShake(true);
            if (onFail) onFail(10, "FOUT!");
            setTimeout(() => {
                setShake(false);
                setInputValue("");
            }, 500);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative bg-black overflow-hidden select-none ${isPowerOn && !activePuzzle && !showCodePanel ? 'cursor-none' : 'cursor-default'}`}
            onMouseMove={handleMouseMove}
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

            {/* PUZZLE MODAL */}
            {activePuzzle && (
                <div
                    className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left cursor-default"
                    onMouseMove={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-900 border-2 border-emerald-500 rounded-xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(0,255,0,0.3)] animate-scaleIn">
                        <h3 className="text-2xl font-bold text-emerald-400 mb-4 font-mono">PUZZEL {activePuzzle}</h3>
                        <p className="text-gray-300 text-lg mb-6 leading-relaxed font-mono">
                            {PUZZLE_DATA[activePuzzle].question}
                        </p>

                        {hintRevealed && (
                            <div className="bg-yellow-900/30 border border-yellow-600/50 p-3 rounded mb-4 text-yellow-200 text-sm font-mono">
                                💡 HINT: {PUZZLE_DATA[activePuzzle].hint}
                            </div>
                        )}

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="flex-1 bg-black border border-emerald-700 rounded p-3 text-white font-mono text-xl outline-none focus:border-emerald-400"
                                placeholder="Antwoord..."
                                value={puzzleInput}
                                onChange={(e) => setPuzzleInput(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={buyHint}
                                disabled={hintRevealed}
                                className={`text-sm px-4 py-2 rounded border ${hintRevealed ? 'border-gray-700 text-gray-600' : 'border-yellow-600 text-yellow-500 hover:bg-yellow-900/20'}`}
                            >
                                {hintRevealed ? "HINT ZICHTBAAR" : "KOOP HINT (-60s)"}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActivePuzzle(null)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Annuleren
                                </button>
                                <button
                                    onClick={checkPuzzleAnswer}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold shadow-lg transition-all active:scale-95"
                                >
                                    BEVESTIGEN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CODE INPUT MODAL (Replaces Bottom Bar) */}
            {showCodePanel && (
                <div
                    className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left cursor-default"
                    onMouseMove={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-900 border-2 border-emerald-500 rounded-xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,255,0,0.3)] animate-scaleIn text-center">
                        <h3 className="text-3xl font-bold text-emerald-400 mb-2 font-mono">BUNKER TOEGANG</h3>
                        <p className="text-gray-400 mb-6 font-mono text-sm">VOER DE 4 CIJFERS VAN DE MAZE IN</p>

                        <div className={`flex gap-3 justify-center mb-6 ${shake ? 'animate-shake' : ''}`}>
                            <input
                                type="text"
                                maxLength={4}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="CODE"
                                className="bg-black border-2 border-gray-600 w-full h-16 rounded text-center text-4xl font-mono text-emerald-500 outline-none focus:border-emerald-500 transition-all tracking-widest"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            <button
                                onClick={() => setShowCodePanel(false)}
                                className="flex-1 px-4 py-3 text-gray-400 hover:text-white border border-gray-700 rounded hover:bg-gray-800"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={checkCode}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded font-bold shadow-lg transition-all active:scale-95"
                            >
                                OPENEN
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Start Button */}
            <div ref={startBtnRef} className="absolute top-0 left-0 z-30 flex items-center justify-center will-change-transform">
                <button
                    onClick={handleStartClick}
                    className={`rounded-full w-20 h-20 flex items-center justify-center font-bold text-2xl transition-all shadow-[0_0_30px_rgba(0,255,0,0.5)] ${isPowerOn
                        ? (heldClues.length > 0 ? 'bg-blue-600 animate-bounce cursor-pointer pointer-events-auto' : 'bg-green-900/50 text-green-800 border-2 border-green-800/50 cursor-pointer pointer-events-auto hover:bg-green-800/80 hover:scale-110')
                        : 'bg-green-600 text-white animate-pulse hover:scale-110 cursor-pointer pointer-events-auto'
                        }`}
                >
                    {heldClues.length > 0 ? '📥' : '⏻'}
                </button>
            </div>

            {/* Targets */}
            {TARGETS.map(target => {
                // Hide if held (it's in your inventory now)
                if (heldClues.includes(target.id) && !revealedClues.includes(target.id)) return null;

                return (
                    <div
                        key={target.id}
                        ref={el => targetsRef.current[target.id] = el}
                        className={`absolute top-0 left-0 z-30 transition-opacity duration-300 will-change-transform ${isPowerOn ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <button
                            onClick={() => handleTargetClick(target)}
                            className={`w-12 h-12 rounded-lg border-2 font-bold shadow-lg flex items-center justify-center ${revealedClues.includes(target.id) ? 'bg-amber-500 border-white' :
                                'bg-gray-800 border-gray-600 text-gray-500 hover:bg-gray-700'
                                }`}
                        >
                            {revealedClues.includes(target.id) ? target.digit : '?'}
                        </button>
                    </div>
                )
            })}

            {/* HUD */}
            {!isPowerOn && (
                <div className="absolute top-2/3 w-full text-center pointer-events-none z-20">
                    <p className="text-emerald-500 font-mono animate-pulse text-xl font-bold">DRUK OP DE KNOP START</p>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
                        {revealedClues.length < 4 ? "Zoek de 4 frequenties en breng ze terug" : "KLIK OP START OM DE CODE IN TE VOEREN"}
                    </p>
                </div>
            )}

            {/* GHOST MODE INDICATOR */}
            {noClip && isPowerOn && (
                <div className="absolute top-4 left-4 z-50 pointer-events-none">
                    <div className="bg-purple-900/80 text-purple-200 px-4 py-2 rounded-full border border-purple-500 animate-pulse font-bold flex items-center gap-2">
                        <span>👻 GHOST MODE ACTIVE</span>
                    </div>
                </div>
            )}

            {/* HELD ITEMS HUD */}
            {isPowerOn && heldClues.length > 0 && (
                <div className="absolute top-8 w-full text-center pointer-events-none z-40">
                    <div className="inline-block bg-blue-900/80 text-blue-200 px-6 py-2 rounded-full border border-blue-500 animate-pulse font-bold">
                        PAPIER GEVONDEN! GA TERUG NAAR START 📥
                    </div>
                </div>
            )}

            {isPowerOn && !showCodePanel && (
                <div
                    className="absolute pointer-events-none z-50 text-4xl transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-[0_0_10px_white]"
                    style={{ left: mouseRef.current.x, top: mouseRef.current.y }}
                >
                    🔦
                </div>
            )}

            {/* Removed Old Bottom Bar */}
        </div>
    );
};

export default Level4;
