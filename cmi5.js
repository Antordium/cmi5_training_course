/**
 * CMI5 Integration Module for PCTE Training RPG
 * Handles LMS communication and xAPI statement tracking
 */

const CMI5 = (function() {
    // CMI5 State
    let initialized = false;
    let endpoint = null;
    let fetchUrl = null;
    let actor = null;
    let registration = null;
    let activityId = null;
    let authToken = null;
    let sessionId = null;
    let masteryScore = 0.8; // 80% to pass
    let launchMode = 'Normal';
    let launchParameters = null;
    let returnUrl = null;
    let contextTemplate = null;

    // Statement queue for offline support
    let statementQueue = [];
    let isOnline = true;

    /**
     * Initialize CMI5 from launch parameters
     */
    async function initialize() {
        try {
            // Parse launch parameters from URL
            const urlParams = new URLSearchParams(window.location.search);

            fetchUrl = urlParams.get('fetch');
            endpoint = urlParams.get('endpoint');
            actor = urlParams.get('actor') ? JSON.parse(decodeURIComponent(urlParams.get('actor'))) : null;
            registration = urlParams.get('registration');
            activityId = urlParams.get('activityId');

            // Check if running in LMS context
            if (!fetchUrl && !endpoint) {
                console.log('CMI5: Running in standalone mode (no LMS detected)');
                initialized = true;
                return true;
            }

            // Fetch auth token
            if (fetchUrl) {
                const response = await fetch(fetchUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    authToken = data['auth-token'];
                    console.log('CMI5: Auth token retrieved');
                } else {
                    throw new Error('Failed to fetch auth token');
                }
            }

            // Fetch launch data from LRS
            if (endpoint && activityId) {
                await fetchLaunchData();
            }

            // Generate session ID
            sessionId = generateUUID();

            // Send initialized statement
            await sendStatement('initialized');

            initialized = true;
            console.log('CMI5: Initialized successfully');
            return true;

        } catch (error) {
            console.error('CMI5: Initialization error:', error);
            // Still allow course to run in standalone mode
            initialized = true;
            return true;
        }
    }

    /**
     * Fetch launch data from LRS State API
     */
    async function fetchLaunchData() {
        try {
            const stateUrl = `${endpoint}activities/state?` + new URLSearchParams({
                activityId: activityId,
                agent: JSON.stringify(actor),
                stateId: 'LMS.LaunchData',
                registration: registration
            });

            const response = await fetch(stateUrl, {
                headers: {
                    'Authorization': `Basic ${authToken}`,
                    'X-Experience-API-Version': '1.0.3'
                }
            });

            if (response.ok) {
                const launchData = await response.json();
                launchMode = launchData.launchMode || 'Normal';
                masteryScore = launchData.masteryScore || 0.8;
                launchParameters = launchData.launchParameters || null;
                returnUrl = launchData.returnURL || null;
                contextTemplate = launchData.contextTemplate || null;

                console.log('CMI5: Launch data retrieved', {
                    launchMode,
                    masteryScore
                });
            }
        } catch (error) {
            console.error('CMI5: Failed to fetch launch data:', error);
        }
    }

    /**
     * Generate UUID for session/statement IDs
     */
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Build xAPI statement
     */
    function buildStatement(verb, result = null, object = null) {
        const verbs = {
            'initialized': {
                id: 'http://adlnet.gov/expapi/verbs/initialized',
                display: { 'en-US': 'initialized' }
            },
            'progressed': {
                id: 'http://adlnet.gov/expapi/verbs/progressed',
                display: { 'en-US': 'progressed' }
            },
            'completed': {
                id: 'http://adlnet.gov/expapi/verbs/completed',
                display: { 'en-US': 'completed' }
            },
            'passed': {
                id: 'http://adlnet.gov/expapi/verbs/passed',
                display: { 'en-US': 'passed' }
            },
            'failed': {
                id: 'http://adlnet.gov/expapi/verbs/failed',
                display: { 'en-US': 'failed' }
            },
            'terminated': {
                id: 'http://adlnet.gov/expapi/verbs/terminated',
                display: { 'en-US': 'terminated' }
            },
            'experienced': {
                id: 'http://adlnet.gov/expapi/verbs/experienced',
                display: { 'en-US': 'experienced' }
            },
            'interacted': {
                id: 'http://adlnet.gov/expapi/verbs/interacted',
                display: { 'en-US': 'interacted' }
            },
            'answered': {
                id: 'http://adlnet.gov/expapi/verbs/answered',
                display: { 'en-US': 'answered' }
            },
            'achieved': {
                id: 'http://adlnet.gov/expapi/verbs/achieved',
                display: { 'en-US': 'achieved' }
            }
        };

        const statement = {
            id: generateUUID(),
            timestamp: new Date().toISOString(),
            actor: actor || {
                account: {
                    homePage: 'http://pcte.mil/standalone',
                    name: 'standalone-user'
                }
            },
            verb: verbs[verb],
            object: object || {
                id: activityId || 'http://pcte.mil/training/pcte-training-rpg',
                definition: {
                    name: { 'en-US': 'PCTE Training RPG' },
                    description: { 'en-US': 'Learn to create and upload CMI5 training content to PCTE' },
                    type: 'http://adlnet.gov/expapi/activities/course'
                }
            },
            context: {
                registration: registration || generateUUID(),
                extensions: {
                    'https://w3id.org/xapi/cmi5/context/extensions/sessionid': sessionId
                }
            }
        };

        // Add context template if provided by LMS
        if (contextTemplate) {
            statement.context = { ...statement.context, ...contextTemplate };
        }

        // Add result if provided
        if (result) {
            statement.result = result;
        }

        return statement;
    }

    /**
     * Send xAPI statement to LRS
     */
    async function sendStatement(verb, result = null, object = null) {
        const statement = buildStatement(verb, result, object);

        // If not connected to LMS, just log and queue
        if (!endpoint || !authToken) {
            console.log('CMI5: Statement (standalone):', verb, statement);
            statementQueue.push(statement);
            return true;
        }

        try {
            const response = await fetch(`${endpoint}statements`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authToken}`,
                    'Content-Type': 'application/json',
                    'X-Experience-API-Version': '1.0.3'
                },
                body: JSON.stringify(statement)
            });

            if (response.ok) {
                console.log('CMI5: Statement sent:', verb);
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('CMI5: Failed to send statement:', error);
            statementQueue.push(statement);
            return false;
        }
    }

    /**
     * Track world/area entry
     */
    function enterWorld(worldId, worldName) {
        return sendStatement('experienced', null, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}`,
            definition: {
                name: { 'en-US': worldName },
                type: 'http://adlnet.gov/expapi/activities/module'
            }
        });
    }

    /**
     * Track lesson start
     */
    function startLesson(worldId, lessonId, lessonName) {
        return sendStatement('initialized', null, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}/lesson/${lessonId}`,
            definition: {
                name: { 'en-US': lessonName },
                type: 'http://adlnet.gov/expapi/activities/lesson'
            }
        });
    }

    /**
     * Track lesson step completion (Kolb phases)
     */
    function completeStep(worldId, lessonId, stepIndex, stepType) {
        const kolbPhases = ['experience', 'reflect', 'conceptualize', 'experiment'];
        const phase = kolbPhases[stepIndex] || 'unknown';

        return sendStatement('progressed', {
            extensions: {
                'http://pcte.mil/xapi/extensions/kolb-phase': phase,
                'http://pcte.mil/xapi/extensions/step-index': stepIndex
            }
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}/lesson/${lessonId}/step/${stepIndex}`,
            definition: {
                name: { 'en-US': `${stepType}: ${phase}` },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        });
    }

    /**
     * Track lesson completion
     */
    function completeLesson(worldId, lessonId, lessonName) {
        return sendStatement('completed', {
            completion: true
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}/lesson/${lessonId}`,
            definition: {
                name: { 'en-US': lessonName },
                type: 'http://adlnet.gov/expapi/activities/lesson'
            }
        });
    }

    /**
     * Track boss battle answer
     */
    function answerBossQuestion(worldId, questionIndex, correct, questionText) {
        return sendStatement('answered', {
            success: correct,
            response: correct ? 'correct' : 'incorrect'
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}/boss/question/${questionIndex}`,
            definition: {
                name: { 'en-US': questionText },
                type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                interactionType: 'choice'
            }
        });
    }

    /**
     * Track boss defeat
     */
    function defeatBoss(worldId, bossName, score, maxScore) {
        const passed = (score / maxScore) >= 0.8;

        return sendStatement(passed ? 'passed' : 'failed', {
            score: {
                raw: score,
                max: maxScore,
                min: 0,
                scaled: score / maxScore
            },
            success: passed,
            completion: true
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}/boss`,
            definition: {
                name: { 'en-US': bossName },
                type: 'http://adlnet.gov/expapi/activities/assessment'
            }
        });
    }

    /**
     * Track final boss completion
     */
    function completeFinalBoss(score, maxScore, passed) {
        return sendStatement(passed ? 'passed' : 'failed', {
            score: {
                raw: score,
                max: maxScore,
                min: 0,
                scaled: score / maxScore
            },
            success: passed,
            completion: true
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/final-boss`,
            definition: {
                name: { 'en-US': 'Final Boss: The Certification Exam' },
                type: 'http://adlnet.gov/expapi/activities/assessment'
            }
        });
    }

    /**
     * Track level up
     */
    function levelUp(newLevel, xp) {
        return sendStatement('achieved', {
            extensions: {
                'http://pcte.mil/xapi/extensions/level': newLevel,
                'http://pcte.mil/xapi/extensions/total-xp': xp
            }
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/achievement/level-${newLevel}`,
            definition: {
                name: { 'en-US': `Reached Level ${newLevel}` },
                type: 'http://adlnet.gov/expapi/activities/objective'
            }
        });
    }

    /**
     * Track world completion
     */
    function completeWorld(worldId, worldName) {
        return sendStatement('completed', {
            completion: true
        }, {
            id: `${activityId || 'http://pcte.mil/training/pcte-training-rpg'}/world/${worldId}`,
            definition: {
                name: { 'en-US': worldName },
                type: 'http://adlnet.gov/expapi/activities/module'
            }
        });
    }

    /**
     * Track course completion
     */
    function completeCourse(finalScore, passed) {
        return sendStatement(passed ? 'passed' : 'failed', {
            score: {
                scaled: finalScore
            },
            success: passed,
            completion: true
        });
    }

    /**
     * Track progress percentage
     */
    function trackProgress(percentage) {
        return sendStatement('progressed', {
            extensions: {
                'https://w3id.org/xapi/cmi5/result/extensions/progress': Math.round(percentage)
            }
        });
    }

    /**
     * Terminate session
     */
    async function terminate() {
        if (!initialized) return;

        await sendStatement('terminated');

        // Return to LMS if URL provided
        if (returnUrl) {
            window.location.href = returnUrl;
        }
    }

    /**
     * Save state to LRS
     */
    async function saveState(stateId, state) {
        if (!endpoint || !authToken) {
            console.log('CMI5: State saved locally (standalone):', stateId);
            return;
        }

        try {
            const stateUrl = `${endpoint}activities/state?` + new URLSearchParams({
                activityId: activityId,
                agent: JSON.stringify(actor),
                stateId: stateId,
                registration: registration
            });

            await fetch(stateUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${authToken}`,
                    'Content-Type': 'application/json',
                    'X-Experience-API-Version': '1.0.3'
                },
                body: JSON.stringify(state)
            });

            console.log('CMI5: State saved:', stateId);
        } catch (error) {
            console.error('CMI5: Failed to save state:', error);
        }
    }

    /**
     * Retrieve state from LRS
     */
    async function getState(stateId) {
        if (!endpoint || !authToken) {
            console.log('CMI5: No LRS state available (standalone)');
            return null;
        }

        try {
            const stateUrl = `${endpoint}activities/state?` + new URLSearchParams({
                activityId: activityId,
                agent: JSON.stringify(actor),
                stateId: stateId,
                registration: registration
            });

            const response = await fetch(stateUrl, {
                headers: {
                    'Authorization': `Basic ${authToken}`,
                    'X-Experience-API-Version': '1.0.3'
                }
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('CMI5: Failed to get state:', error);
        }

        return null;
    }

    /**
     * Check if running in LMS mode
     */
    function isLMSMode() {
        return endpoint !== null && authToken !== null;
    }

    /**
     * Get mastery score requirement
     */
    function getMasteryScore() {
        return masteryScore;
    }

    /**
     * Get launch mode
     */
    function getLaunchMode() {
        return launchMode;
    }

    // Public API
    return {
        initialize,
        terminate,
        enterWorld,
        startLesson,
        completeStep,
        completeLesson,
        answerBossQuestion,
        defeatBoss,
        completeFinalBoss,
        levelUp,
        completeWorld,
        completeCourse,
        trackProgress,
        saveState,
        getState,
        isLMSMode,
        getMasteryScore,
        getLaunchMode,
        sendStatement
    };
})();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    CMI5.initialize().then(() => {
        console.log('CMI5 module ready');
    });
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    CMI5.terminate();
});

// Global function for game.js to call
function completeCmi5(passed, score) {
    CMI5.completeCourse(score / 100, passed);
}
