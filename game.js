// ==========================================
// PCTE CMI5 QUEST - GAME ENGINE
// ==========================================

const STORAGE_KEY = 'pcteCmi5Quest_saveData';

// ==========================================
// GAME STATE
// ==========================================
let gameState = {
    player: {
        name: 'HERO',
        class: 'developer',
        level: 1,
        xp: 0,
        xpToNext: 100,
        totalXp: 0,
        hp: 100,
        maxHp: 100,
        stars: 0,
        skills: []
    },
    progress: {
        currentWorld: 1,
        worldsUnlocked: [1],
        worldsCompleted: [],
        lessonsCompleted: [],
        bossesDefeated: [],
        currentLesson: null,
        currentLessonStep: 0
    },
    settings: {
        soundEnabled: true,
        textSpeed: 'normal'
    }
};

// XP required per level (cumulative feel)
const XP_TABLE = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];

// Class bonuses
const CLASS_BONUSES = {
    developer: { codeXpMult: 1.5, contentXpMult: 1.0, configXpMult: 1.0 },
    designer: { codeXpMult: 1.0, contentXpMult: 1.5, configXpMult: 1.0 },
    admin: { codeXpMult: 1.0, contentXpMult: 1.0, configXpMult: 1.5 }
};

// Skills unlocked at each level
const SKILL_UNLOCKS = {
    2: { name: 'XML NOVICE', desc: 'Basic understanding of cmi5.xml structure' },
    3: { name: 'CONTENT CRAFTER', desc: 'Can create effective learning content' },
    4: { name: 'PACKAGE MASTER', desc: 'Understands ZIP packaging requirements' },
    5: { name: 'UPLOAD WARRIOR', desc: 'Can navigate PCTE upload process' },
    6: { name: 'XAPI APPRENTICE', desc: 'Understands xAPI statements' },
    7: { name: 'DEBUG KNIGHT', desc: 'Can troubleshoot common issues' },
    8: { name: 'INTEGRATION SAGE', desc: 'Masters LMS integration' },
    9: { name: 'CMI5 CHAMPION', desc: 'Near-mastery of CMI5 standard' },
    10: { name: 'LEGENDARY TRAINER', desc: 'Complete mastery achieved!' }
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    checkSavedGame();
    initTitleScreen();
    // Hide persistent stats bar on initial load (title screen)
    const statsBar = document.getElementById('persistentStatsBar');
    if (statsBar) {
        statsBar.style.display = 'none';
    }
    // Set default player sprite
    const previewSprite = document.getElementById('previewSprite');
    if (previewSprite) {
        previewSprite.className = 'player-sprite developer';
    }
});

function checkSavedGame() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        document.getElementById('continueBtn').style.display = 'block';
    }
}

function initTitleScreen() {
    // Add sparkle effect to title
    createTitleStars();
}

function createTitleStars() {
    const container = document.querySelector('.title-stars');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}

// ==========================================
// SCREEN MANAGEMENT
// ==========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    // Control persistent stats bar visibility
    const statsBar = document.getElementById('persistentStatsBar');
    if (statsBar) {
        const hideOnScreens = ['titleScreen', 'characterScreen', 'victoryScreen', 'gameOverScreen'];
        statsBar.style.display = hideOnScreens.includes(screenId) ? 'none' : 'flex';
    }
}

function startNewGame() {
    playSound('select');
    showScreen('characterScreen');
}

function continueGame() {
    playSound('select');
    loadGame();
    showScreen('worldMap');
    updateAllHUDs();
    updateWorldMap();
}

// ==========================================
// CHARACTER CREATION
// ==========================================
function selectClass(btn, className) {
    document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    gameState.player.class = className;
    document.getElementById('classPreview').textContent = className.toUpperCase();

    // Update player sprite preview
    const previewSprite = document.getElementById('previewSprite');
    if (previewSprite) {
        previewSprite.className = 'player-sprite ' + className;
    }

    playSound('select');
}

function confirmCharacter() {
    const nameInput = document.getElementById('playerName');
    gameState.player.name = nameInput.value.toUpperCase() || 'HERO';

    playSound('confirm');

    // Show intro dialog
    showDialog('ELDER', [
        `Welcome, ${gameState.player.name}!`,
        'You have chosen to walk the path of the CMI5 CREATOR.',
        'Your quest: Learn to create training content for PCTE and master the ancient arts of CMI5.',
        'Each WORLD you visit will teach you new skills. Defeat the BOSS of each world to prove your knowledge.',
        'But beware... the FINAL BOSS awaits in the CERTIFICATION TOWER. Only those with 80% mastery may survive!',
        'Your journey begins in TUTORIAL VILLAGE. Good luck, brave trainer!'
    ], () => {
        showScreen('worldMap');
        updateAllHUDs();
        updateWorldMap();
        saveGame();
    });
}

// ==========================================
// WORLD MAP
// ==========================================
function updateWorldMap() {
    // Update world statuses
    for (let i = 1; i <= 5; i++) {
        const worldEl = document.getElementById('world' + i);
        const statusEl = document.getElementById('world' + i + 'Status');

        if (gameState.progress.worldsCompleted.includes(i)) {
            worldEl.classList.remove('locked');
            worldEl.classList.add('completed');
            statusEl.textContent = 'COMPLETE';
        } else if (gameState.progress.worldsUnlocked.includes(i)) {
            worldEl.classList.remove('locked');
            statusEl.textContent = 'AVAILABLE';
        } else {
            worldEl.classList.add('locked');
            statusEl.textContent = 'LOCKED';
        }

        // Update progress dots
        updateWorldProgressDots(i);
    }

    // Update paths
    for (let i = 1; i < 5; i++) {
        const path = document.getElementById('path' + i + '-' + (i + 1));
        if (path && gameState.progress.worldsCompleted.includes(i)) {
            path.classList.add('active');
        }
    }
}

function updateWorldProgressDots(worldNum) {
    const world = WORLDS[worldNum];
    if (!world) return;

    world.lessons.forEach((lesson, idx) => {
        const dot = document.getElementById(`w${worldNum}d${idx + 1}`);
        if (dot && gameState.progress.lessonsCompleted.includes(lesson.id)) {
            dot.classList.add('complete');
        }
    });

    const bossDot = document.getElementById(`w${worldNum}boss`);
    if (bossDot && gameState.progress.bossesDefeated.includes(worldNum)) {
        bossDot.classList.add('complete');
    }
}

function enterWorld(worldNum) {
    if (!gameState.progress.worldsUnlocked.includes(worldNum)) {
        playSound('error');
        showMessage('This area is still LOCKED!');
        return;
    }

    playSound('select');
    gameState.progress.currentWorld = worldNum;
    showAreaScreen(worldNum);
}

// ==========================================
// AREA SCREEN
// ==========================================
function showAreaScreen(worldNum) {
    const world = WORLDS[worldNum];
    if (!world) return;

    document.getElementById('areaTitle').textContent = world.name;
    document.getElementById('areaSubtitle').textContent = world.description;

    const content = document.getElementById('areaContent');
    content.innerHTML = '';

    // Add world intro if first visit
    if (!gameState.progress.lessonsCompleted.some(id => id.startsWith('w' + worldNum))) {
        const introBox = document.createElement('div');
        introBox.className = 'area-intro';
        introBox.innerHTML = `
            <div class="intro-npc">
                <div class="npc-sprite ${world.npc}"></div>
                <div class="npc-bubble">${world.introText}</div>
            </div>
        `;
        content.appendChild(introBox);
    }

    // Add lessons
    const lessonsContainer = document.createElement('div');
    lessonsContainer.className = 'lessons-grid';

    world.lessons.forEach((lesson, idx) => {
        const isComplete = gameState.progress.lessonsCompleted.includes(lesson.id);
        const isLocked = idx > 0 && !gameState.progress.lessonsCompleted.includes(world.lessons[idx - 1].id);

        const lessonCard = document.createElement('div');
        lessonCard.className = `lesson-card ${isComplete ? 'complete' : ''} ${isLocked ? 'locked' : ''}`;
        lessonCard.innerHTML = `
            <div class="lesson-number">${idx + 1}</div>
            <div class="lesson-info">
                <div class="lesson-name">${lesson.name}</div>
                <div class="lesson-desc">${lesson.description}</div>
                <div class="lesson-xp">+${lesson.xpReward} XP</div>
            </div>
            <div class="lesson-status">${isComplete ? '✓ CLEAR' : isLocked ? '🔒' : '▶'}</div>
        `;

        if (!isLocked && !isComplete) {
            lessonCard.onclick = () => startLesson(lesson.id);
        } else if (isComplete) {
            lessonCard.onclick = () => startLesson(lesson.id); // Allow replay
        }

        lessonsContainer.appendChild(lessonCard);
    });

    content.appendChild(lessonsContainer);

    // Add boss battle option if all lessons complete
    const allLessonsComplete = world.lessons.every(l => gameState.progress.lessonsCompleted.includes(l.id));
    const bossDefeated = gameState.progress.bossesDefeated.includes(worldNum);

    const bossSection = document.createElement('div');
    bossSection.className = 'boss-section-card';

    if (worldNum === 5) {
        // Final boss
        bossSection.innerHTML = `
            <div class="boss-card final ${!allLessonsComplete ? 'locked' : ''} ${bossDefeated ? 'defeated' : ''}">
                <div class="boss-icon">👑</div>
                <div class="boss-info">
                    <div class="boss-name">${world.boss.name}</div>
                    <div class="boss-challenge">FINAL CERTIFICATION EXAM</div>
                    <div class="boss-warning">⚠ 80% Required to Pass ⚠</div>
                </div>
                <div class="boss-status">${bossDefeated ? '✓ CERTIFIED' : allLessonsComplete ? '⚔ CHALLENGE' : '🔒'}</div>
            </div>
        `;
        if (allLessonsComplete && !bossDefeated) {
            bossSection.querySelector('.boss-card').onclick = () => startFinalBoss();
        }
    } else {
        bossSection.innerHTML = `
            <div class="boss-card ${!allLessonsComplete ? 'locked' : ''} ${bossDefeated ? 'defeated' : ''}">
                <div class="boss-icon">⚔</div>
                <div class="boss-info">
                    <div class="boss-name">${world.boss.name}</div>
                    <div class="boss-challenge">SCENARIO CHALLENGE</div>
                </div>
                <div class="boss-status">${bossDefeated ? '✓ DEFEATED' : allLessonsComplete ? '⚔ BATTLE' : '🔒'}</div>
            </div>
        `;
        if (allLessonsComplete && !bossDefeated) {
            bossSection.querySelector('.boss-card').onclick = () => startBossBattle(worldNum);
        }
    }

    content.appendChild(bossSection);

    showScreen('areaScreen');
    updateAllHUDs();
}

function returnToArea() {
    showAreaScreen(gameState.progress.currentWorld);
}

function returnToMap() {
    showScreen('worldMap');
    updateWorldMap();
    closeGameMenu();
}

// ==========================================
// LESSON SYSTEM (KOLB'S MODEL)
// ==========================================
/*
 * Each lesson follows Kolb's Experiential Learning Cycle:
 * 1. CONCRETE EXPERIENCE - Video/demo showing the concept
 * 2. REFLECTIVE OBSERVATION - Review and analyze what was shown
 * 3. ABSTRACT CONCEPTUALIZATION - Learn the theory/rules
 * 4. ACTIVE EXPERIMENTATION - Practice exercise/mini-quiz
 */

let currentLessonData = null;
let currentStepIndex = 0;

function startLesson(lessonId) {
    const lesson = findLessonById(lessonId);
    if (!lesson) return;

    playSound('select');
    currentLessonData = lesson;
    currentStepIndex = 0;

    document.getElementById('lessonTitle').textContent = lesson.name;
    document.getElementById('lessonTotal').textContent = lesson.steps.length;

    renderLessonStep();
    showScreen('lessonScreen');
}

function findLessonById(lessonId) {
    for (const worldNum in WORLDS) {
        const world = WORLDS[worldNum];
        const lesson = world.lessons.find(l => l.id === lessonId);
        if (lesson) return lesson;
    }
    return null;
}

function renderLessonStep() {
    const step = currentLessonData.steps[currentStepIndex];
    const content = document.getElementById('lessonContent');
    const kolbIndicator = document.getElementById('kolbIndicator');

    // Update Kolb phase indicator
    const kolbPhases = {
        experience: 'EXPERIENCE',
        reflection: 'REFLECTION',
        conceptualization: 'THEORY',
        experimentation: 'PRACTICE'
    };
    kolbIndicator.querySelector('.kolb-phase').textContent = kolbPhases[step.kolbPhase] || step.kolbPhase.toUpperCase();
    kolbIndicator.className = 'kolb-indicator ' + step.kolbPhase;

    // Update step counter
    document.getElementById('lessonStep').textContent = currentStepIndex + 1;

    // Render step content based on type
    let html = `<div class="step-container ${step.kolbPhase}">`;

    switch (step.type) {
        case 'video':
            html += renderVideoStep(step);
            break;
        case 'image':
            html += renderImageStep(step);
            break;
        case 'text':
            html += renderTextStep(step);
            break;
        case 'interactive':
            html += renderInteractiveStep(step);
            break;
        case 'practice':
            html += renderPracticeStep(step);
            break;
        case 'reflection':
            html += renderReflectionStep(step);
            break;
        default:
            html += `<p>${step.content}</p>`;
    }

    html += '</div>';
    content.innerHTML = html;

    // Update navigation buttons
    document.getElementById('lessonPrevBtn').style.display = currentStepIndex > 0 ? 'block' : 'none';

    const nextBtn = document.getElementById('lessonNextBtn');
    if (currentStepIndex === currentLessonData.steps.length - 1) {
        nextBtn.textContent = 'COMPLETE ✓';
        nextBtn.onclick = completeLesson;
    } else {
        nextBtn.textContent = 'NEXT ▶';
        nextBtn.onclick = nextLessonStep;
    }

    // Disable next if step requires completion
    if (step.requireCompletion) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
    }
}

function renderVideoStep(step) {
    return `
        <div class="video-step">
            <div class="step-header">
                <span class="kolb-badge">CONCRETE EXPERIENCE</span>
                <h3>${step.title}</h3>
            </div>
            <div class="video-placeholder" id="videoPlaceholder_${currentStepIndex}">
                <div class="placeholder-icon">🎬</div>
                <div class="placeholder-text">VIDEO PLACEHOLDER</div>
                <div class="placeholder-desc">${step.videoDescription || 'Training video demonstrating this concept'}</div>
                <div class="placeholder-path">Expected: videos/${step.videoFile || 'placeholder.mp4'}</div>
            </div>
            <div class="video-container" style="display:none;">
                <video id="lessonVideo_${currentStepIndex}" controls>
                    <source src="videos/${step.videoFile}" type="video/mp4">
                </video>
            </div>
            <div class="step-description">
                <p>${step.description}</p>
            </div>
            <div class="watch-instructions">
                <p>📺 Watch the video above to see ${step.watchPrompt || 'this concept in action'}.</p>
            </div>
        </div>
    `;
}

function renderImageStep(step) {
    return `
        <div class="image-step">
            <div class="step-header">
                <span class="kolb-badge">${step.kolbPhase === 'reflection' ? 'REFLECTIVE OBSERVATION' : 'VISUAL GUIDE'}</span>
                <h3>${step.title}</h3>
            </div>
            <div class="image-placeholder" id="imagePlaceholder_${currentStepIndex}">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">IMAGE PLACEHOLDER</div>
                <div class="placeholder-desc">${step.imageDescription || 'Screenshot or diagram'}</div>
                <div class="placeholder-path">Expected: images/${step.imageFile || 'placeholder.png'}</div>
            </div>
            <div class="image-container" style="display:none;">
                <img src="images/${step.imageFile}" alt="${step.title}">
            </div>
            <div class="step-description">
                ${step.content}
            </div>
            ${step.callouts ? renderCallouts(step.callouts) : ''}
        </div>
    `;
}

function renderCallouts(callouts) {
    let html = '<div class="callouts">';
    callouts.forEach((callout, i) => {
        html += `
            <div class="callout-item">
                <span class="callout-number">${i + 1}</span>
                <span class="callout-text">${callout}</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderTextStep(step) {
    return `
        <div class="text-step">
            <div class="step-header">
                <span class="kolb-badge">${step.kolbPhase === 'conceptualization' ? 'ABSTRACT CONCEPTUALIZATION' : 'INFORMATION'}</span>
                <h3>${step.title}</h3>
            </div>
            <div class="text-content">
                ${step.content}
            </div>
            ${step.keyPoints ? renderKeyPoints(step.keyPoints) : ''}
            ${step.codeExample ? renderCodeExample(step.codeExample) : ''}
        </div>
    `;
}

function renderKeyPoints(points) {
    let html = '<div class="key-points"><div class="kp-header">KEY POINTS</div><ul>';
    points.forEach(point => {
        html += `<li>${point}</li>`;
    });
    html += '</ul></div>';
    return html;
}

function renderCodeExample(code) {
    return `
        <div class="code-example">
            <div class="code-header">CODE EXAMPLE</div>
            <pre><code>${escapeHtml(code)}</code></pre>
        </div>
    `;
}

function renderInteractiveStep(step) {
    return `
        <div class="interactive-step">
            <div class="step-header">
                <span class="kolb-badge">INTERACTIVE ELEMENT</span>
                <h3>${step.title}</h3>
            </div>
            <div class="interactive-instructions">
                ${step.instructions}
            </div>
            <div class="interactive-area" id="interactiveArea_${currentStepIndex}">
                ${renderInteractiveElement(step)}
            </div>
        </div>
    `;
}

function renderInteractiveElement(step) {
    switch (step.interactiveType) {
        case 'dragdrop':
            return renderDragDrop(step);
        case 'sequence':
            return renderSequence(step);
        case 'matching':
            return renderMatching(step);
        case 'fillblank':
            return renderFillBlank(step);
        default:
            return '<p>Interactive element</p>';
    }
}

function renderDragDrop(step) {
    let html = '<div class="dragdrop-container">';
    html += '<div class="drag-items">';
    step.items.forEach((item, i) => {
        html += `<div class="drag-item" draggable="true" data-id="${i}">${item}</div>`;
    });
    html += '</div>';
    html += '<div class="drop-zones">';
    step.zones.forEach((zone, i) => {
        html += `<div class="drop-zone" data-zone="${i}"><span class="zone-label">${zone}</span></div>`;
    });
    html += '</div></div>';
    return html;
}

function renderSequence(step) {
    let html = '<div class="sequence-container">';
    html += '<p>Drag items to arrange them in the correct order:</p>';
    html += '<div class="sequence-items" id="sequenceItems">';
    const shuffled = [...step.items].sort(() => Math.random() - 0.5);
    shuffled.forEach((item, i) => {
        const correctIndex = step.items.indexOf(item);
        html += `<div class="sequence-item" draggable="true" data-correct="${correctIndex}" data-current="${i}">${item}</div>`;
    });
    html += '</div>';
    html += '<div class="sequence-feedback" id="sequenceFeedback" style="display:none;"></div>';
    html += `<button class="btn-pixel" id="checkSequenceBtn" onclick="checkSequence()">CHECK ORDER</button>`;
    html += '</div>';

    // Store correct order for checking
    window.currentSequenceItems = step.items;

    // Initialize drag and drop after render
    setTimeout(() => initSequenceDragDrop(), 100);

    return html;
}

function initSequenceDragDrop() {
    const container = document.getElementById('sequenceItems');
    if (!container) return;

    const items = container.querySelectorAll('.sequence-item');
    let draggedItem = null;

    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem !== item) {
                const rect = item.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (e.clientY < midY) {
                    container.insertBefore(draggedItem, item);
                } else {
                    container.insertBefore(draggedItem, item.nextSibling);
                }
            }
        });
    });
}

function checkSequence() {
    const container = document.getElementById('sequenceItems');
    const feedback = document.getElementById('sequenceFeedback');
    const nextBtn = document.getElementById('lessonNextBtn');
    const checkBtn = document.getElementById('checkSequenceBtn');

    if (!container || !window.currentSequenceItems) return;

    const items = container.querySelectorAll('.sequence-item');
    let allCorrect = true;

    items.forEach((item, index) => {
        const correctIndex = parseInt(item.dataset.correct);
        if (correctIndex === index) {
            item.classList.add('correct');
            item.classList.remove('incorrect');
        } else {
            item.classList.add('incorrect');
            item.classList.remove('correct');
            allCorrect = false;
        }
    });

    if (allCorrect) {
        feedback.innerHTML = '<div class="feedback-correct">CORRECT! All items are in the right order.</div>';
        feedback.className = 'sequence-feedback correct';
        playSound('correct');
        awardXP(15, 'interactive');

        // Enable next button
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }
        checkBtn.disabled = true;
        checkBtn.textContent = 'COMPLETED';
    } else {
        feedback.innerHTML = '<div class="feedback-incorrect">Not quite right. Try rearranging the items.</div>';
        feedback.className = 'sequence-feedback incorrect';
        playSound('wrong');
    }

    feedback.style.display = 'block';
}

function renderMatching(step) {
    let html = '<div class="matching-container">';
    html += '<p>Click a left item, then click its matching right item:</p>';
    html += '<div class="matching-columns">';
    html += '<div class="match-left">';
    step.pairs.forEach((pair, i) => {
        html += `<div class="match-item left" data-id="${i}" onclick="selectMatchItem(this, 'left')">${pair.left}</div>`;
    });
    html += '</div>';
    html += '<div class="match-right">';
    const shuffledRight = [...step.pairs].sort(() => Math.random() - 0.5);
    shuffledRight.forEach((pair) => {
        const originalIndex = step.pairs.findIndex(p => p.right === pair.right);
        html += `<div class="match-item right" data-id="${originalIndex}" onclick="selectMatchItem(this, 'right')">${pair.right}</div>`;
    });
    html += '</div>';
    html += '</div>';
    html += '<div class="matching-feedback" id="matchingFeedback" style="display:none;"></div>';
    html += `<button class="btn-pixel" id="checkMatchingBtn" onclick="checkMatching(${step.pairs.length})">CHECK MATCHES</button>`;
    html += '</div>';

    // Reset matching state
    window.matchingState = {
        selectedLeft: null,
        matches: {},
        totalPairs: step.pairs.length
    };

    return html;
}

function selectMatchItem(element, side) {
    if (element.classList.contains('matched')) return;

    const state = window.matchingState;
    if (!state) return;

    if (side === 'left') {
        // Deselect previous left selection
        document.querySelectorAll('.match-item.left.selected').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        state.selectedLeft = element;
    } else if (side === 'right' && state.selectedLeft) {
        // Try to make a match
        const leftId = state.selectedLeft.dataset.id;
        const rightId = element.dataset.id;

        // Check if this is a correct match
        if (leftId === rightId) {
            // Correct match
            state.selectedLeft.classList.remove('selected');
            state.selectedLeft.classList.add('matched', 'correct');
            element.classList.add('matched', 'correct');
            state.matches[leftId] = true;
            playSound('correct');
        } else {
            // Incorrect match - show briefly then reset
            const leftElement = state.selectedLeft; // Save reference before clearing
            leftElement.classList.add('incorrect');
            element.classList.add('incorrect');
            playSound('wrong');

            setTimeout(() => {
                leftElement.classList.remove('selected', 'incorrect');
                element.classList.remove('incorrect');
            }, 500);
        }

        state.selectedLeft = null;

        // Check if all matched
        if (Object.keys(state.matches).length === state.totalPairs) {
            const feedback = document.getElementById('matchingFeedback');
            const nextBtn = document.getElementById('lessonNextBtn');
            const checkBtn = document.getElementById('checkMatchingBtn');

            feedback.innerHTML = '<div class="feedback-correct">EXCELLENT! All items matched correctly!</div>';
            feedback.className = 'matching-feedback correct';
            feedback.style.display = 'block';

            awardXP(15, 'interactive');

            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.classList.remove('disabled');
            }
            if (checkBtn) {
                checkBtn.style.display = 'none';
            }
        }
    }
}

function checkMatching(totalPairs) {
    const state = window.matchingState;
    const feedback = document.getElementById('matchingFeedback');

    if (!state) return;

    const matchedCount = Object.keys(state.matches).length;

    if (matchedCount === totalPairs) {
        feedback.innerHTML = '<div class="feedback-correct">All matches complete!</div>';
        feedback.className = 'matching-feedback correct';
    } else {
        feedback.innerHTML = `<div class="feedback-incorrect">You have ${matchedCount} of ${totalPairs} matches. Keep going!</div>`;
        feedback.className = 'matching-feedback incorrect';
    }

    feedback.style.display = 'block';
}

function renderFillBlank(step) {
    let html = '<div class="fillblank-container">';
    html += `<p class="fillblank-text">${step.text.replace(/___/g, '<input type="text" class="blank-input">')}</p>`;
    html += `<button class="btn-pixel" onclick="checkFillBlank()">CHECK ANSWERS</button>`;
    html += '</div>';
    return html;
}

function renderPracticeStep(step) {
    return `
        <div class="practice-step">
            <div class="step-header">
                <span class="kolb-badge">ACTIVE EXPERIMENTATION</span>
                <h3>${step.title}</h3>
            </div>
            <div class="practice-scenario">
                <div class="scenario-icon">⚔</div>
                <p>${step.scenario}</p>
            </div>
            <div class="practice-question">
                <p><strong>${step.question}</strong></p>
            </div>
            <div class="practice-choices" id="practiceChoices_${currentStepIndex}">
                ${renderPracticeChoices(step.choices, currentStepIndex)}
            </div>
            <div class="practice-feedback" id="practiceFeedback_${currentStepIndex}" style="display:none;"></div>
        </div>
    `;
}

function renderPracticeChoices(choices, stepIndex) {
    let html = '';
    const shuffled = [...choices].sort(() => Math.random() - 0.5);
    shuffled.forEach((choice, i) => {
        html += `
            <button class="practice-choice" onclick="selectPracticeChoice(${stepIndex}, this, ${choice.correct})">
                <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
                <span class="choice-text">${choice.text}</span>
            </button>
        `;
    });
    return html;
}

function selectPracticeChoice(stepIndex, btn, isCorrect) {
    const container = document.getElementById('practiceChoices_' + stepIndex);
    const feedback = document.getElementById('practiceFeedback_' + stepIndex);
    const nextBtn = document.getElementById('lessonNextBtn');

    // Disable all choices
    container.querySelectorAll('.practice-choice').forEach(c => {
        c.disabled = true;
        c.classList.add('disabled');
    });

    if (isCorrect) {
        btn.classList.add('correct');
        feedback.innerHTML = '<div class="feedback-correct">✓ CORRECT! Well done, adventurer!</div>';
        feedback.className = 'practice-feedback correct';
        playSound('correct');

        // Enable next button
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');

        // Award bonus XP
        awardXP(10, 'practice');
    } else {
        btn.classList.add('incorrect');
        feedback.innerHTML = '<div class="feedback-incorrect">✗ Not quite. Review the material and try the lesson again!</div>';
        feedback.className = 'practice-feedback incorrect';
        playSound('wrong');

        // Still allow progression but no bonus XP
        setTimeout(() => {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }, 2000);
    }

    feedback.style.display = 'block';
}

function renderReflectionStep(step) {
    return `
        <div class="reflection-step">
            <div class="step-header">
                <span class="kolb-badge">REFLECTIVE OBSERVATION</span>
                <h3>${step.title}</h3>
            </div>
            <div class="reflection-content">
                ${step.content}
            </div>
            <div class="reflection-questions">
                <div class="reflection-header">THINK ABOUT:</div>
                <ul>
                    ${step.questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
            ${step.summary ? `<div class="reflection-summary"><strong>Summary:</strong> ${step.summary}</div>` : ''}
        </div>
    `;
}

function nextLessonStep() {
    if (currentStepIndex < currentLessonData.steps.length - 1) {
        currentStepIndex++;
        renderLessonStep();
        playSound('select');
    }
}

function prevLessonStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderLessonStep();
        playSound('select');
    }
}

function completeLesson() {
    const lessonId = currentLessonData.id;

    if (!gameState.progress.lessonsCompleted.includes(lessonId)) {
        gameState.progress.lessonsCompleted.push(lessonId);

        // Award XP with class bonus
        const xp = calculateXP(currentLessonData.xpReward, currentLessonData.category);
        awardXP(xp, 'lesson');

        // Award stars
        gameState.player.stars += currentLessonData.starReward || 1;

        playSound('victory');
        showReward({
            title: 'LESSON COMPLETE!',
            xp: xp,
            stars: currentLessonData.starReward || 1,
            message: `You have mastered: ${currentLessonData.name}`
        });
    } else {
        // Replay - reduced XP
        awardXP(Math.floor(currentLessonData.xpReward / 4), 'replay');
        showMessage('Lesson reviewed! (+' + Math.floor(currentLessonData.xpReward / 4) + ' XP)');
        returnToArea();
    }

    saveGame();
}

// ==========================================
// BOSS BATTLES (SCENARIO-BASED LEARNING)
// ==========================================
let currentBoss = null;
let bossHP = 0;
let bossMaxHP = 0;
let bossQuestionIndex = 0;
let bossCorrectAnswers = 0;

function startBossBattle(worldNum) {
    const world = WORLDS[worldNum];
    if (!world || !world.boss) return;

    currentBoss = world.boss;
    bossHP = currentBoss.hp;
    bossMaxHP = currentBoss.hp;
    bossQuestionIndex = 0;
    bossCorrectAnswers = 0;

    document.getElementById('bossName').textContent = currentBoss.name;
    document.getElementById('bossHpText').textContent = `${bossHP}/${bossMaxHP}`;
    document.getElementById('bossHpBar').style.width = '100%';

    // Set boss sprite image
    const bossImage = document.querySelector('#bossSprite .boss-image');
    if (bossImage && currentBoss.sprite) {
        bossImage.style.backgroundImage = `url('${currentBoss.sprite}')`;
        bossImage.style.backgroundSize = 'contain';
        bossImage.style.backgroundRepeat = 'no-repeat';
        bossImage.style.backgroundPosition = 'center';
        bossImage.style.width = '100%';
        bossImage.style.height = '100%';
    }

    document.getElementById('battlePlayerName').textContent = gameState.player.name;
    document.getElementById('battlePlayerLevel').textContent = gameState.player.level;
    updateBattlePlayerHP();

    showScreen('battleScreen');
    playSound('battleStart');

    // Show boss intro
    showBattleMessage(currentBoss.intro, () => {
        showBossQuestion();
    });
}

function showBossQuestion() {
    if (bossQuestionIndex >= currentBoss.scenario.questions.length) {
        // All questions answered - boss defeated!
        defeatBoss();
        return;
    }

    const question = currentBoss.scenario.questions[bossQuestionIndex];
    const dialog = document.getElementById('battleDialog');
    const questionEl = document.getElementById('battleQuestion');
    const choicesEl = document.getElementById('battleChoices');

    questionEl.innerHTML = `
        <div class="scenario-context">${question.context || ''}</div>
        <div class="scenario-question">${question.text}</div>
    `;

    // Shuffle choices
    const shuffledChoices = [...question.choices].sort(() => Math.random() - 0.5);
    choicesEl.innerHTML = shuffledChoices.map((choice, i) => `
        <button class="battle-choice" onclick="selectBossAnswer(this, ${choice.correct}, '${escapeHtml(choice.feedback)}', ${choice.damage || 0})">
            <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
            ${choice.text}
        </button>
    `).join('');

    dialog.style.display = 'block';
}

function selectBossAnswer(btn, isCorrect, feedback, damage) {
    const choicesEl = document.getElementById('battleChoices');
    choicesEl.querySelectorAll('.battle-choice').forEach(c => c.disabled = true);

    if (isCorrect) {
        btn.classList.add('correct');
        bossCorrectAnswers++;

        // Deal damage to boss
        const bossDamage = Math.floor(bossMaxHP / currentBoss.scenario.questions.length);
        bossHP = Math.max(0, bossHP - bossDamage);

        updateBossHP();
        showBattleEffect('hit');
        playSound('hit');

        showBattleMessage(`✓ CORRECT!\n\n${feedback}\n\nYou deal ${bossDamage} damage!`, () => {
            bossQuestionIndex++;
            showBossQuestion();
        });
    } else {
        btn.classList.add('incorrect');

        // Boss attacks player
        const playerDamage = damage || 20;
        gameState.player.hp = Math.max(0, gameState.player.hp - playerDamage);
        updateBattlePlayerHP();
        showBattleEffect('damage');
        playSound('damage');

        showBattleMessage(`✗ INCORRECT!\n\n${feedback}\n\nThe boss attacks! You take ${playerDamage} damage!`, () => {
            if (gameState.player.hp <= 0) {
                // Player defeated - but this is a learning experience, let them retry
                gameState.player.hp = Math.floor(gameState.player.maxHp / 2);
                showBattleMessage('You fall back, but your determination keeps you going! (HP restored to 50%)', () => {
                    bossQuestionIndex++;
                    showBossQuestion();
                });
            } else {
                bossQuestionIndex++;
                showBossQuestion();
            }
        });
    }
}

function updateBossHP() {
    const percent = (bossHP / bossMaxHP) * 100;
    document.getElementById('bossHpBar').style.width = percent + '%';
    document.getElementById('bossHpText').textContent = `${bossHP}/${bossMaxHP}`;

    if (percent < 25) {
        document.getElementById('bossHpBar').classList.add('critical');
    } else if (percent < 50) {
        document.getElementById('bossHpBar').classList.add('low');
    }
}

function updateBattlePlayerHP() {
    const percent = (gameState.player.hp / gameState.player.maxHp) * 100;
    document.getElementById('battlePlayerHpBar').style.width = percent + '%';
    document.getElementById('battlePlayerHpText').textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
}

function showBattleEffect(type) {
    const effects = document.getElementById('battleEffects');
    const effect = document.createElement('div');
    effect.className = 'battle-effect ' + type;
    effect.textContent = type === 'hit' ? '💥' : '💔';
    effects.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function showBattleMessage(message, callback) {
    const msgBox = document.getElementById('battleMessage');
    const dialog = document.getElementById('battleDialog');

    dialog.style.display = 'none';
    msgBox.innerHTML = `<div class="message-text">${message.replace(/\n/g, '<br>')}</div>
                        <button class="btn-pixel" onclick="this.parentElement.style.display='none'; (${callback})();">CONTINUE</button>`;
    msgBox.style.display = 'block';
}

function defeatBoss() {
    const worldNum = gameState.progress.currentWorld;

    if (!gameState.progress.bossesDefeated.includes(worldNum)) {
        gameState.progress.bossesDefeated.push(worldNum);
        gameState.progress.worldsCompleted.push(worldNum);

        // Unlock next world
        if (worldNum < 5 && !gameState.progress.worldsUnlocked.includes(worldNum + 1)) {
            gameState.progress.worldsUnlocked.push(worldNum + 1);
        }
    }

    // Award rewards
    const xp = calculateXP(currentBoss.xpReward, 'boss');
    awardXP(xp, 'boss');
    gameState.player.stars += currentBoss.starReward || 5;

    // Restore HP
    gameState.player.hp = gameState.player.maxHp;

    playSound('victory');

    showReward({
        title: 'BOSS DEFEATED!',
        xp: xp,
        stars: currentBoss.starReward || 5,
        message: `${currentBoss.name} has been vanquished!`,
        unlocked: worldNum < 5 ? WORLDS[worldNum + 1]?.name : null
    });

    saveGame();
}

// ==========================================
// FINAL BOSS BATTLE
// ==========================================
let finalBossHP = 0;
let finalBossMaxHP = 1000;
let finalQuestionIndex = 0;
let finalCorrectAnswers = 0;
let finalTotalQuestions = 10;
let finalQuestions = [];

function startFinalBoss() {
    const world = WORLDS[5];
    if (!world || !world.boss) return;

    currentBoss = world.boss;
    finalBossHP = finalBossMaxHP;
    finalQuestionIndex = 0;
    finalCorrectAnswers = 0;

    // Shuffle and select questions from final boss question pool
    finalQuestions = shuffleArray([...currentBoss.questions]).slice(0, finalTotalQuestions);

    document.getElementById('finalBossName').textContent = currentBoss.name;
    document.getElementById('finalBossHpText').textContent = `${finalBossHP}/${finalBossMaxHP}`;
    document.getElementById('finalBossHpBar').style.width = '100%';
    document.getElementById('finalQuestionTotal').textContent = finalTotalQuestions;
    document.getElementById('finalAccuracy').textContent = '0';

    // Set final boss sprite image
    const finalBossImage = document.querySelector('#finalBossSprite .final-boss-image');
    if (finalBossImage && currentBoss.sprite) {
        finalBossImage.style.backgroundImage = `url('${currentBoss.sprite}')`;
        finalBossImage.style.backgroundSize = 'contain';
        finalBossImage.style.backgroundRepeat = 'no-repeat';
        finalBossImage.style.backgroundPosition = 'center';
        finalBossImage.style.width = '100%';
        finalBossImage.style.height = '100%';
    }

    document.getElementById('finalPlayerName').textContent = gameState.player.name;
    updateFinalPlayerHP();

    showScreen('finalBossScreen');
    playSound('finalBattle');

    showFinalQuestion();
}

function showFinalQuestion() {
    if (finalQuestionIndex >= finalTotalQuestions) {
        // Battle over - check results
        checkFinalBossResult();
        return;
    }

    const question = finalQuestions[finalQuestionIndex];
    document.getElementById('finalQuestionNum').textContent = finalQuestionIndex + 1;

    const questionEl = document.getElementById('finalQuestion');
    const choicesEl = document.getElementById('finalChoices');

    questionEl.textContent = question.text;

    // Shuffle choices
    const shuffledChoices = [...question.choices].sort(() => Math.random() - 0.5);
    choicesEl.innerHTML = shuffledChoices.map((choice, i) => `
        <button class="final-choice" onclick="selectFinalAnswer(this, ${choice.correct})">
            <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
            ${choice.text}
        </button>
    `).join('');
}

function selectFinalAnswer(btn, isCorrect) {
    const choicesEl = document.getElementById('finalChoices');
    choicesEl.querySelectorAll('.final-choice').forEach(c => c.disabled = true);

    if (isCorrect) {
        btn.classList.add('correct');
        finalCorrectAnswers++;

        // Deal damage to boss (each correct = 100 damage)
        const damage = 100;
        finalBossHP = Math.max(0, finalBossHP - damage);
        updateFinalBossHP();

        showFinalBattleEffect('hit', damage);
        playSound('hit');
    } else {
        btn.classList.add('incorrect');

        // Boss damages player
        const damage = 25;
        gameState.player.hp = Math.max(0, gameState.player.hp - damage);
        updateFinalPlayerHP();

        showFinalBattleEffect('damage', damage);
        playSound('damage');
    }

    // Update accuracy
    const accuracy = Math.round((finalCorrectAnswers / (finalQuestionIndex + 1)) * 100);
    document.getElementById('finalAccuracy').textContent = accuracy;

    // Next question after delay
    setTimeout(() => {
        finalQuestionIndex++;
        showFinalQuestion();
    }, 1500);
}

function updateFinalBossHP() {
    const percent = (finalBossHP / finalBossMaxHP) * 100;
    document.getElementById('finalBossHpBar').style.width = percent + '%';
    document.getElementById('finalBossHpText').textContent = `${finalBossHP}/${finalBossMaxHP}`;
}

function updateFinalPlayerHP() {
    const percent = (gameState.player.hp / gameState.player.maxHp) * 100;
    document.getElementById('finalPlayerHpBar').style.width = percent + '%';
    document.getElementById('finalPlayerHpText').textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
}

function showFinalBattleEffect(type, amount) {
    const boss = document.querySelector('.final-boss-sprite');
    const player = document.querySelector('.final-player-sprite');

    if (type === 'hit') {
        boss.classList.add('hit');
        setTimeout(() => boss.classList.remove('hit'), 500);

        // Show damage number
        const dmgNum = document.createElement('div');
        dmgNum.className = 'damage-number';
        dmgNum.textContent = '-' + amount;
        boss.appendChild(dmgNum);
        setTimeout(() => dmgNum.remove(), 1000);
    } else {
        player.classList.add('damage');
        setTimeout(() => player.classList.remove('damage'), 500);
    }
}

function checkFinalBossResult() {
    const accuracy = (finalCorrectAnswers / finalTotalQuestions) * 100;

    if (accuracy >= 80) {
        // VICTORY!
        gameState.progress.bossesDefeated.push(5);
        gameState.progress.worldsCompleted.push(5);

        const xp = 500;
        awardXP(xp, 'finalBoss');
        gameState.player.stars += 10;

        playSound('finalVictory');

        document.getElementById('victoryMessage').textContent =
            `With ${accuracy}% accuracy, you have proven yourself a true CMI5 Master!`;
        document.getElementById('victoryRewards').innerHTML = `
            <div class="reward-item">+${xp} XP</div>
            <div class="reward-item">+10 ★</div>
            <div class="reward-item">TITLE: CMI5 MASTER</div>
        `;

        showScreen('victoryScreen');

        // Send completion to LMS
        completeCmi5(true, accuracy);
    } else {
        // GAME OVER
        playSound('gameOver');

        document.getElementById('gameoverScore').textContent = accuracy.toFixed(0);
        document.getElementById('gameoverMessage').textContent =
            `The CMI5 Guardian proved too powerful with only ${accuracy.toFixed(0)}% accuracy...`;
        document.getElementById('gameoverHint').textContent =
            `You needed 80% but scored ${accuracy.toFixed(0)}%. Review the training and try again!`;

        showScreen('gameOverScreen');

        // Send failure to LMS
        completeCmi5(false, accuracy);
    }

    saveGame();
}

function retryFinalBoss() {
    // Restore player HP
    gameState.player.hp = gameState.player.maxHp;
    startFinalBoss();
}

// ==========================================
// XP AND LEVELING
// ==========================================
function calculateXP(baseXP, category) {
    const bonus = CLASS_BONUSES[gameState.player.class];
    let multiplier = 1;

    if (category === 'code' && bonus.codeXpMult) multiplier = bonus.codeXpMult;
    else if (category === 'content' && bonus.contentXpMult) multiplier = bonus.contentXpMult;
    else if (category === 'config' && bonus.configXpMult) multiplier = bonus.configXpMult;

    return Math.floor(baseXP * multiplier);
}

function awardXP(amount, source) {
    gameState.player.xp += amount;
    gameState.player.totalXp += amount;

    // Check for level up
    while (gameState.player.xp >= gameState.player.xpToNext && gameState.player.level < 10) {
        levelUp();
    }

    updateAllHUDs();
    showMessage(`+${amount} XP`, 'xp');
}

function levelUp() {
    gameState.player.level++;
    gameState.player.xp -= gameState.player.xpToNext;
    gameState.player.xpToNext = XP_TABLE[gameState.player.level] - XP_TABLE[gameState.player.level - 1];
    gameState.player.maxHp += 10;
    gameState.player.hp = gameState.player.maxHp;

    // Check for skill unlock
    const skill = SKILL_UNLOCKS[gameState.player.level];
    if (skill && !gameState.player.skills.find(s => s.name === skill.name)) {
        gameState.player.skills.push(skill);
    }

    playSound('levelUp');
    showLevelUp(skill);
}

function showLevelUp(skill) {
    document.getElementById('newLevel').textContent = gameState.player.level;
    const skillEl = document.getElementById('skillUnlock');
    if (skill) {
        skillEl.textContent = `NEW SKILL: ${skill.name}`;
        skillEl.style.display = 'block';
    } else {
        skillEl.style.display = 'none';
    }
    document.getElementById('levelUpOverlay').style.display = 'flex';
}

function closeLevelUp() {
    document.getElementById('levelUpOverlay').style.display = 'none';
}

// ==========================================
// UI UPDATES
// ==========================================
function updateAllHUDs() {
    // World map HUD
    updateHUD('hud');
    // Area HUD
    updateHUD('areaHud');
    // Persistent stats bar
    updatePersistentStats();
    // Menu
    updateMenu();
}

function updatePersistentStats() {
    const nameEl = document.getElementById('persistName');
    const levelEl = document.getElementById('persistLevel');
    const classEl = document.getElementById('persistClass');
    const hpBar = document.getElementById('persistHpBar');
    const hpText = document.getElementById('persistHpText');
    const xpBar = document.getElementById('persistXpBar');
    const xpText = document.getElementById('persistXpText');
    const stars = document.getElementById('persistStars');

    if (nameEl) nameEl.textContent = gameState.player.name;
    if (levelEl) levelEl.textContent = gameState.player.level;
    if (classEl) classEl.textContent = gameState.player.class.substring(0, 3).toUpperCase();
    if (hpBar) hpBar.style.width = (gameState.player.hp / gameState.player.maxHp * 100) + '%';
    if (hpText) hpText.textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
    if (xpBar) xpBar.style.width = (gameState.player.xp / gameState.player.xpToNext * 100) + '%';
    if (xpText) xpText.textContent = `${gameState.player.xp}/${gameState.player.xpToNext}`;
    if (stars) stars.textContent = gameState.player.stars;
}

function updateHUD(prefix) {
    const nameEl = document.getElementById(prefix + 'Name');
    const levelEl = document.getElementById(prefix + 'Level');
    const classEl = document.getElementById(prefix + 'Class');
    const hpBar = document.getElementById(prefix + 'HpBar');
    const hpText = document.getElementById(prefix + 'HpText');
    const xpBar = document.getElementById(prefix + 'XpBar');
    const xpText = document.getElementById(prefix + 'XpText');
    const stars = document.getElementById(prefix + 'Stars');

    if (nameEl) nameEl.textContent = gameState.player.name;
    if (levelEl) levelEl.textContent = gameState.player.level;
    if (classEl) classEl.textContent = gameState.player.class.substring(0, 3).toUpperCase();
    if (hpBar) hpBar.style.width = (gameState.player.hp / gameState.player.maxHp * 100) + '%';
    if (hpText) hpText.textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
    if (xpBar) xpBar.style.width = (gameState.player.xp / gameState.player.xpToNext * 100) + '%';
    if (xpText) xpText.textContent = `${gameState.player.xp}/${gameState.player.xpToNext}`;
    if (stars) stars.textContent = gameState.player.stars;
}

function updateMenu() {
    document.getElementById('menuName').textContent = gameState.player.name;
    document.getElementById('menuClass').textContent = gameState.player.class.toUpperCase();
    document.getElementById('menuLevel').textContent = gameState.player.level;
    document.getElementById('menuTotalXp').textContent = gameState.player.totalXp;
    document.getElementById('menuWorldsCleared').textContent = `${gameState.progress.worldsCompleted.length}/5`;
    document.getElementById('menuBossesDefeated').textContent = gameState.progress.bossesDefeated.length;

    const skillsList = document.getElementById('menuSkills');
    if (gameState.player.skills.length > 0) {
        skillsList.innerHTML = gameState.player.skills.map(s =>
            `<div class="skill-item"><span class="skill-name">${s.name}</span><span class="skill-desc">${s.desc}</span></div>`
        ).join('');
    } else {
        skillsList.innerHTML = '<div class="no-skills">No skills learned yet</div>';
    }
}

// ==========================================
// OVERLAYS AND DIALOGS
// ==========================================
function showDialog(npcName, messages, callback) {
    const overlay = document.getElementById('dialogOverlay');
    const nameEl = document.getElementById('npcName');
    const textEl = document.getElementById('npcText');

    let messageIndex = 0;
    nameEl.textContent = npcName;

    function showNextMessage() {
        if (messageIndex < messages.length) {
            textEl.textContent = messages[messageIndex];
            messageIndex++;
        } else {
            overlay.style.display = 'none';
            if (callback) callback();
        }
    }

    window.continueDialog = showNextMessage;
    overlay.style.display = 'flex';
    showNextMessage();
}

function showMessage(text, type = 'info') {
    // Create floating message
    const msg = document.createElement('div');
    msg.className = 'floating-message ' + type;
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function showReward(reward) {
    const content = document.getElementById('rewardContent');
    content.innerHTML = `
        <div class="reward-title">${reward.title}</div>
        ${reward.message ? `<div class="reward-message">${reward.message}</div>` : ''}
        <div class="reward-items">
            <div class="reward-xp">+${reward.xp} XP</div>
            <div class="reward-stars">+${reward.stars} ★</div>
        </div>
        ${reward.unlocked ? `<div class="reward-unlock">NEW AREA UNLOCKED: ${reward.unlocked}</div>` : ''}
    `;
    document.getElementById('rewardOverlay').style.display = 'flex';
}

function closeReward() {
    document.getElementById('rewardOverlay').style.display = 'none';
    returnToArea();
}

function openGameMenu() {
    updateMenu();
    document.getElementById('gameMenu').style.display = 'flex';
}

function closeGameMenu() {
    document.getElementById('gameMenu').style.display = 'none';
}

function quitToTitle() {
    saveGame();
    closeGameMenu();
    showScreen('titleScreen');
}

function showCredits() {
    // Could show credits screen - for now return to map
    showScreen('worldMap');
    updateWorldMap();
}

// ==========================================
// SAVE/LOAD
// ==========================================
function saveGame() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        console.log('Game saved');
    } catch (e) {
        console.error('Save failed:', e);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            gameState = JSON.parse(saved);
            console.log('Game loaded');
            return true;
        }
    } catch (e) {
        console.error('Load failed:', e);
    }
    return false;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function playSound(soundName) {
    // Sound implementation - would load from audio folder
    console.log('Sound:', soundName);
    // In production: new Audio(`audio/${soundName}.mp3`).play();
}
