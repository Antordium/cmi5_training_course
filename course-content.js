// ==========================================
// PCTE CMI5 QUEST - COURSE CONTENT
// Structured using Kolb's Experiential Learning Model
// ==========================================

/*
 * KOLB'S LEARNING CYCLE PHASES:
 * 1. experience - Concrete Experience (watching, doing)
 * 2. reflection - Reflective Observation (reviewing, analyzing)
 * 3. conceptualization - Abstract Conceptualization (theory, rules)
 * 4. experimentation - Active Experimentation (practice, apply)
 */

const WORLDS = {
    // ==========================================
    // WORLD 1: TUTORIAL VILLAGE
    // Introduction to PCTE and CMI5 concepts
    // ==========================================
    1: {
        name: 'TUTORIAL VILLAGE',
        description: 'Learn the basics of PCTE and CMI5',
        icon: '🏠',
        npc: 'elder',
        introText: 'Welcome, young trainer! Before you venture forth, you must learn the ancient ways of CMI5. These scrolls contain the knowledge you seek...',

        lessons: [
            {
                id: 'w1_lesson1',
                name: 'What is PCTE?',
                description: 'Understanding the Persistent Cyber Training Environment',
                xpReward: 50,
                starReward: 1,
                category: 'content',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'PCTE Overview',
                        videoFile: 'pcte_overview.mp4',
                        videoDescription: 'Video showing the PCTE interface and explaining its purpose as a cyber training platform',
                        description: 'Watch this overview of the Persistent Cyber Training Environment (PCTE) to understand what it is and why we use it.',
                        watchPrompt: 'how PCTE provides a scalable training environment'
                    },
                    {
                        type: 'reflection',
                        kolbPhase: 'reflection',
                        title: 'Understanding PCTE',
                        content: `
                            <p>PCTE (Persistent Cyber Training Environment) is a Department of Defense platform designed to provide realistic, scalable cyber training environments.</p>
                            <p>It allows training developers to create and deploy interactive learning content that can be accessed by thousands of users simultaneously.</p>
                        `,
                        questions: [
                            'What makes PCTE different from traditional training platforms?',
                            'How might scalability benefit large-scale cyber training exercises?',
                            'What types of training content might work well in PCTE?'
                        ],
                        summary: 'PCTE provides the infrastructure; CMI5 provides the standard for tracking learning progress.'
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'PCTE Key Concepts',
                        content: `
                            <p>PCTE serves as a <strong>Learning Management System (LMS)</strong> that hosts and delivers training content. Understanding these key concepts is essential:</p>
                        `,
                        keyPoints: [
                            'PCTE uses the CMI5 standard for content packaging and tracking',
                            'Training content is uploaded as ZIP packages containing course files',
                            'The platform tracks learner progress through xAPI statements',
                            'Content can include videos, interactive exercises, quizzes, and scenarios',
                            'PCTE supports concurrent access by thousands of users'
                        ]
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Knowledge Check',
                        scenario: 'You are planning a new cyber training course. A colleague asks why you would use PCTE instead of just sharing files on a network drive.',
                        question: 'What is the BEST reason to use PCTE for cyber training?',
                        choices: [
                            { text: 'PCTE has nicer graphics than network folders', correct: false, feedback: 'While PCTE does provide a better interface, this is not the main advantage.' },
                            { text: 'PCTE provides standardized tracking, scalability, and interactive learning capabilities', correct: true, feedback: 'PCTE offers tracking through CMI5/xAPI, scales to thousands of users, and supports interactive content types.' },
                            { text: 'Network drives are not secure enough for training', correct: false, feedback: 'Security is important but not the primary differentiator for training delivery.' },
                            { text: 'PCTE is required by regulation for all training', correct: false, feedback: 'While PCTE is preferred for DoD cyber training, it is not universally required.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w1_lesson2',
                name: 'What is CMI5?',
                description: 'Understanding the CMI5 standard and xAPI',
                xpReward: 60,
                starReward: 1,
                category: 'config',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'CMI5 Explained',
                        videoFile: 'cmi5_explained.mp4',
                        videoDescription: 'Animated explainer video showing how CMI5 works as a bridge between content and LMS',
                        description: 'This video explains the CMI5 standard and how it enables communication between your training content and the PCTE learning management system.',
                        watchPrompt: 'the relationship between CMI5, xAPI, and the LMS'
                    },
                    {
                        type: 'image',
                        kolbPhase: 'reflection',
                        title: 'The CMI5 Workflow',
                        imageFile: 'cmi5_workflow_diagram.png',
                        imageDescription: 'Flowchart showing: Content Package → LMS → Launch → xAPI Statements → LRS',
                        content: `
                            <p>Study this diagram showing how CMI5 content flows through the system:</p>
                            <ol>
                                <li>Content creator packages training as a CMI5 ZIP file</li>
                                <li>Administrator uploads package to PCTE (LMS)</li>
                                <li>Learner launches the content from PCTE</li>
                                <li>Content sends xAPI statements to track progress</li>
                                <li>LMS records completion, scores, and status</li>
                            </ol>
                        `,
                        callouts: [
                            'The cmi5.xml file tells the LMS about your course structure',
                            'xAPI statements are the "language" used to report progress',
                            'The LMS handles authentication and session management'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'CMI5 Technical Foundation',
                        content: `
                            <p><strong>CMI5</strong> (Computer Managed Instruction, version 5) is a specification that defines how learning content communicates with an LMS.</p>
                            <p>It builds on <strong>xAPI</strong> (Experience API, also called Tin Can API), which provides the statement format for tracking learning activities.</p>
                        `,
                        keyPoints: [
                            'CMI5 defines the "launch" mechanism - how the LMS starts your content',
                            'CMI5 specifies required xAPI statements (initialized, completed, passed/failed, terminated)',
                            'The cmi5.xml file describes your course structure to the LMS',
                            'CMI5 content receives authentication tokens from the LMS at launch',
                            'All tracking data is sent as xAPI statements to a Learning Record Store (LRS)'
                        ],
                        codeExample: `// Example xAPI statement structure
{
  "actor": { "name": "John Doe", "mbox": "mailto:john@example.com" },
  "verb": { "id": "http://adlnet.gov/expapi/verbs/completed" },
  "object": { "id": "https://example.com/course/module1" },
  "result": { "success": true, "score": { "scaled": 0.85 } }
}`
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'CMI5 Components Check',
                        scenario: 'You are reviewing a CMI5 package before upload. You need to verify it contains the required elements.',
                        question: 'Which file is REQUIRED in every CMI5 package to describe the course to the LMS?',
                        choices: [
                            { text: 'index.html', correct: false, feedback: 'index.html is the content entry point, but not what describes the course structure to the LMS.' },
                            { text: 'manifest.xml', correct: false, feedback: 'manifest.xml is used in SCORM, not CMI5.' },
                            { text: 'cmi5.xml', correct: true, feedback: 'The cmi5.xml file is required and contains the course structure, AUs, and metadata.' },
                            { text: 'package.json', correct: false, feedback: 'package.json is used in Node.js projects, not CMI5.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w1_lesson3',
                name: 'CMI5 Package Structure',
                description: 'Understanding what goes in a CMI5 package',
                xpReward: 70,
                starReward: 2,
                category: 'config',
                steps: [
                    {
                        type: 'image',
                        kolbPhase: 'experience',
                        title: 'Inside a CMI5 Package',
                        imageFile: 'cmi5_package_structure.png',
                        imageDescription: 'File tree showing: package.zip containing cmi5.xml, index.html, course.js, styles.css, images/, videos/',
                        content: `
                            <p>A CMI5 package is simply a ZIP file containing your course files organized in a specific way.</p>
                            <p>Examine this typical package structure to understand what files go where.</p>
                        `
                    },
                    {
                        type: 'text',
                        kolbPhase: 'reflection',
                        title: 'Package Components',
                        content: `
                            <p>Every CMI5 package contains these essential components:</p>
                            <div class="component-list">
                                <div class="component">
                                    <strong>cmi5.xml</strong> - The course descriptor (REQUIRED)
                                    <p>Tells the LMS about your course: title, description, entry point, mastery score, and objectives.</p>
                                </div>
                                <div class="component">
                                    <strong>Entry Point (e.g., index.html)</strong> - Your course content
                                    <p>The HTML file the LMS will launch. Must handle CMI5 launch parameters.</p>
                                </div>
                                <div class="component">
                                    <strong>Supporting Files</strong> - JavaScript, CSS, media
                                    <p>All resources needed to run your course: scripts, styles, images, videos.</p>
                                </div>
                            </div>
                        `,
                        questions: [
                            'Why must all files be contained within the ZIP package?',
                            'What happens if cmi5.xml is missing or malformed?'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'The cmi5.xml File',
                        content: `
                            <p>The cmi5.xml file is the "manifest" that describes your course to the LMS. It contains:</p>
                        `,
                        keyPoints: [
                            'Course metadata (ID, title, description)',
                            'Assignable Units (AUs) - the launchable content items',
                            'Entry point URL for each AU',
                            'Mastery score required to pass',
                            'Move-on criteria (e.g., "Passed", "Completed")',
                            'Learning objectives (optional but recommended)'
                        ],
                        codeExample: `<?xml version="1.0" encoding="UTF-8"?>
<courseStructure xmlns="https://w3id.org/xapi/profiles/cmi5/v1/CourseStructure.xsd">
    <course id="https://example.com/course">
        <title><langstring lang="en-US">My Training Course</langstring></title>
        <description><langstring lang="en-US">Course description here</langstring></description>
    </course>
    <au id="https://example.com/course/au1">
        <title><langstring lang="en-US">Module 1</langstring></title>
        <url>index.html</url>
        <launchMethod>AnyWindow</launchMethod>
        <moveOn>Passed</moveOn>
        <masteryScore>0.8</masteryScore>
    </au>
</courseStructure>`
                    },
                    {
                        type: 'interactive',
                        kolbPhase: 'experimentation',
                        title: 'CMI5 Package Creation Steps',
                        instructions: 'Arrange these steps in the correct order to create a valid CMI5 package.',
                        interactiveType: 'sequence',
                        items: [
                            'Create your course content files (HTML, JS, CSS)',
                            'Create the cmi5.xml manifest describing your course structure',
                            'Organize all files in a single folder (cmi5.xml at root level)',
                            'Test your content locally in a browser',
                            'Create a ZIP file of the folder contents (not the folder itself)',
                            'Validate the package structure before upload'
                        ],
                        requireCompletion: true
                    }
                ]
            }
        ],

        boss: {
            name: 'CONFUSION SPECTER',
            sprite: 'images/boss_confusion_specter.svg',
            hp: 300,
            xpReward: 150,
            starReward: 5,
            intro: 'I am the CONFUSION SPECTER! Many have fallen to my misleading questions about CMI5 basics. Do you truly understand the fundamentals?',
            scenario: {
                context: 'You are helping a new team member understand CMI5 for the first time. They have many questions...',
                questions: [
                    {
                        context: 'Your colleague asks: "I keep hearing CMI5 and xAPI - are they the same thing?"',
                        text: 'How do you explain the relationship between CMI5 and xAPI?',
                        choices: [
                            { text: 'They are the same thing, just different names', correct: false, feedback: 'CMI5 and xAPI are related but distinct. CMI5 is a profile/specification that uses xAPI for tracking.', damage: 30 },
                            { text: 'CMI5 is a specification that defines how to use xAPI for LMS-launched content', correct: true, feedback: 'Exactly! CMI5 builds on xAPI, defining specific requirements for LMS integration.' },
                            { text: 'xAPI replaced CMI5 as the newer standard', correct: false, feedback: 'xAPI came first as a general tracking API. CMI5 was created later to standardize LMS usage.', damage: 20 },
                            { text: 'CMI5 is only for videos, xAPI is for everything else', correct: false, feedback: 'CMI5 supports all content types, not just videos.', damage: 25 }
                        ]
                    },
                    {
                        context: 'They ask: "What file do I absolutely need in my CMI5 package?"',
                        text: 'Which file is the essential descriptor that every CMI5 package must contain?',
                        choices: [
                            { text: 'package.json', correct: false, feedback: 'package.json is for Node.js projects, not CMI5.', damage: 25 },
                            { text: 'imsmanifest.xml', correct: false, feedback: 'imsmanifest.xml is used in SCORM, not CMI5.', damage: 20 },
                            { text: 'cmi5.xml', correct: true, feedback: 'Correct! cmi5.xml is the required course structure file.' },
                            { text: 'config.xml', correct: false, feedback: 'There is no config.xml in the CMI5 specification.', damage: 25 }
                        ]
                    },
                    {
                        context: 'Finally they ask: "What does PCTE actually do with my CMI5 package?"',
                        text: 'What is the primary role of PCTE when hosting CMI5 content?',
                        choices: [
                            { text: 'PCTE converts the content to a different format', correct: false, feedback: 'PCTE does not convert content - it hosts and launches it as-is.', damage: 20 },
                            { text: 'PCTE serves as the LMS - hosting content, managing launches, and tracking progress', correct: true, feedback: 'Correct! PCTE is the Learning Management System that handles all aspects of content delivery.' },
                            { text: 'PCTE only stores the files for download', correct: false, feedback: 'PCTE does much more than storage - it actively manages the learning experience.', damage: 30 },
                            { text: 'PCTE edits the content to add tracking automatically', correct: false, feedback: 'Content creators must implement tracking; PCTE does not modify content.', damage: 25 }
                        ]
                    }
                ]
            }
        }
    },

    // ==========================================
    // WORLD 2: CONTENT CAVERNS
    // Creating training content
    // ==========================================
    2: {
        name: 'CONTENT CAVERNS',
        description: 'Master the art of creating training content',
        icon: '⛰',
        npc: 'miner',
        introText: 'Deep in these caverns lie the secrets of content creation! Videos, images, quizzes, and interactive elements await. Mine them wisely...',

        lessons: [
            {
                id: 'w2_lesson1',
                name: 'Video Content',
                description: 'Creating and integrating training videos',
                xpReward: 60,
                starReward: 1,
                category: 'content',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'Video Best Practices',
                        videoFile: 'video_best_practices.mp4',
                        videoDescription: 'Demonstration of effective training video techniques: clear audio, good pacing, visual annotations',
                        description: 'Watch this example of an effective training video and note the techniques used.',
                        watchPrompt: 'the pacing, visual elements, and engagement techniques'
                    },
                    {
                        type: 'text',
                        kolbPhase: 'reflection',
                        title: 'What Makes a Good Training Video?',
                        content: `
                            <p>Effective training videos share common characteristics:</p>
                            <ul>
                                <li><strong>Clear audio</strong> - Use a quality microphone, minimize background noise</li>
                                <li><strong>Concise duration</strong> - Keep videos under 10 minutes; 5-7 is ideal</li>
                                <li><strong>Visual engagement</strong> - Use annotations, highlights, and zoom</li>
                                <li><strong>Logical structure</strong> - Introduction, content, summary</li>
                                <li><strong>Accessible format</strong> - MP4 with H.264 codec for broad compatibility</li>
                            </ul>
                        `,
                        questions: [
                            'What video length would work best for your training topic?',
                            'How can you make screen recordings more engaging?'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Video Technical Requirements',
                        content: `
                            <p>For PCTE/CMI5 compatibility, follow these technical specifications:</p>
                        `,
                        keyPoints: [
                            'Format: MP4 container with H.264 video codec',
                            'Audio: AAC codec, stereo, 128-256 kbps',
                            'Resolution: 1080p (1920x1080) recommended, 720p minimum',
                            'Frame rate: 30fps for most content, 60fps for fast demonstrations',
                            'File size: Keep under 100MB for web delivery; compress if needed',
                            'Aspect ratio: 16:9 for best display compatibility'
                        ],
                        codeExample: `<!-- HTML5 video element for CMI5 content -->
<video id="trainingVideo" controls>
    <source src="videos/training.mp4" type="video/mp4">
    Your browser does not support HTML5 video.
</video>

<!-- With tracking integration -->
<script>
video.addEventListener('ended', () => {
    sendXAPI('completed', 'video');
});
</script>`
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Video Format Check',
                        scenario: 'You have a training video that is 250MB in size and encoded in AVI format. You need to prepare it for PCTE.',
                        question: 'What should you do to prepare this video for CMI5 deployment?',
                        choices: [
                            { text: 'Upload it as-is; PCTE will convert it automatically', correct: false, feedback: 'PCTE does not convert video formats. Content must be web-ready before upload.' },
                            { text: 'Convert to MP4 (H.264), compress to under 100MB, verify 16:9 aspect ratio', correct: true, feedback: 'Correct! Converting to MP4 ensures compatibility, compression improves loading, and 16:9 ensures proper display.' },
                            { text: 'Just rename the file from .avi to .mp4', correct: false, feedback: 'Renaming does not convert the codec. The file must be properly re-encoded.' },
                            { text: 'Split it into 10 smaller AVI files', correct: false, feedback: 'Multiple AVI files would still have format compatibility issues.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w2_lesson2',
                name: 'Images and Screenshots',
                description: 'Creating effective visual content',
                xpReward: 50,
                starReward: 1,
                category: 'content',
                steps: [
                    {
                        type: 'image',
                        kolbPhase: 'experience',
                        title: 'Effective Screenshots',
                        imageFile: 'screenshot_example_good.png',
                        imageDescription: 'Side-by-side comparison: cluttered screenshot vs. annotated, focused screenshot with callouts',
                        content: `
                            <p>Compare these two screenshots. The effective one uses:</p>
                            <ul>
                                <li>Focused area (cropped to relevant content)</li>
                                <li>Clear annotations and numbered callouts</li>
                                <li>Highlighted areas of interest</li>
                                <li>Readable text and UI elements</li>
                            </ul>
                        `
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Image Best Practices',
                        content: `
                            <p>Follow these guidelines for training images:</p>
                        `,
                        keyPoints: [
                            'Format: PNG for screenshots/diagrams, JPG for photos',
                            'Resolution: Minimum 1200px width for readability',
                            'File size: Optimize to under 500KB per image',
                            'Annotations: Use contrasting colors, numbered callouts',
                            'Alt text: Always provide descriptive alt text for accessibility',
                            'Consistency: Use the same annotation style throughout'
                        ]
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Image Selection',
                        scenario: 'You need to show users how to navigate a complex menu system with 5 steps.',
                        question: 'What is the BEST approach for presenting this information?',
                        choices: [
                            { text: 'One screenshot showing the final result only', correct: false, feedback: 'Users need to see each step, not just the end result.' },
                            { text: 'Five separate screenshots, each with numbered annotations for that step', correct: true, feedback: 'Breaking complex procedures into annotated steps improves comprehension and retention.' },
                            { text: 'A single, very large screenshot with all menus visible', correct: false, feedback: 'Large, cluttered images are hard to follow and may not display well.' },
                            { text: 'Text-only instructions without images', correct: false, feedback: 'Visual learners benefit greatly from screenshots, especially for UI navigation.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w2_lesson3',
                name: 'Interactive Elements',
                description: 'Creating quizzes, scenarios, and interactions',
                xpReward: 80,
                starReward: 2,
                category: 'code',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'Interactive Content Demo',
                        videoFile: 'interactive_demo.mp4',
                        videoDescription: 'Demo of various interactive elements: multiple choice quiz, drag-and-drop, branching scenario',
                        description: 'Watch this demonstration of interactive training elements that increase learner engagement.',
                        watchPrompt: 'the different types of interactions and when each might be appropriate'
                    },
                    {
                        type: 'text',
                        kolbPhase: 'reflection',
                        title: 'Types of Interactive Elements',
                        content: `
                            <p>Interactive elements transform passive content into active learning experiences:</p>
                            <div class="element-grid">
                                <div class="element-card">
                                    <h4>Multiple Choice Quiz</h4>
                                    <p>Best for: Knowledge checks, assessments</p>
                                    <p>Tracks: Score, pass/fail</p>
                                </div>
                                <div class="element-card">
                                    <h4>Drag and Drop</h4>
                                    <p>Best for: Categorization, matching, sequencing</p>
                                    <p>Tracks: Completion, accuracy</p>
                                </div>
                                <div class="element-card">
                                    <h4>Branching Scenarios</h4>
                                    <p>Best for: Decision-making, consequences</p>
                                    <p>Tracks: Path taken, outcomes</p>
                                </div>
                                <div class="element-card">
                                    <h4>Simulations</h4>
                                    <p>Best for: Procedural practice, tool familiarity</p>
                                    <p>Tracks: Actions, completion time</p>
                                </div>
                            </div>
                        `,
                        questions: [
                            'Which interactive type would work best for your training content?',
                            'How can you balance engagement with learning objectives?'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Implementing Quizzes',
                        content: `
                            <p>A well-designed quiz includes:</p>
                        `,
                        keyPoints: [
                            'Question bank larger than questions shown (enables randomization)',
                            'Shuffled answer order (prevents pattern memorization)',
                            'Clear feedback for correct and incorrect answers',
                            'Mastery threshold (typically 80%)',
                            'xAPI statements for pass/fail with score'
                        ],
                        codeExample: `// Quiz question structure
const questionBank = [
    {
        text: "What is the required CMI5 descriptor file?",
        choices: [
            { text: "cmi5.xml", correct: true },
            { text: "manifest.xml", correct: false },
            { text: "config.json", correct: false },
            { text: "package.xml", correct: false }
        ],
        feedback: {
            correct: "cmi5.xml defines your course structure.",
            incorrect: "The CMI5 spec requires cmi5.xml."
        }
    }
];

// Shuffle function for randomization
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}`
                    },
                    {
                        type: 'interactive',
                        kolbPhase: 'experimentation',
                        title: 'Match the Interaction',
                        instructions: 'Match each learning goal with the best interactive element type.',
                        interactiveType: 'matching',
                        pairs: [
                            { left: 'Test factual knowledge', right: 'Multiple Choice Quiz' },
                            { left: 'Practice categorizing items', right: 'Drag and Drop' },
                            { left: 'Experience decision consequences', right: 'Branching Scenario' },
                            { left: 'Learn software procedures', right: 'Simulation' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w2_lesson4',
                name: 'Kolb Learning Integration',
                description: 'Designing content using Kolbs model',
                xpReward: 70,
                starReward: 2,
                category: 'content',
                steps: [
                    {
                        type: 'image',
                        kolbPhase: 'experience',
                        title: 'Kolbs Learning Cycle',
                        imageFile: 'kolb_cycle_diagram.png',
                        imageDescription: 'Circular diagram showing: Concrete Experience → Reflective Observation → Abstract Conceptualization → Active Experimentation → (back to start)',
                        content: `
                            <p>David Kolb's Experiential Learning Cycle describes how people learn most effectively through a four-stage process.</p>
                            <p>This course itself follows Kolb's model - notice how each lesson progresses through these phases!</p>
                        `
                    },
                    {
                        type: 'text',
                        kolbPhase: 'reflection',
                        title: 'The Four Stages',
                        content: `
                            <div class="kolb-stages">
                                <div class="kolb-stage experience">
                                    <h4>1. Concrete Experience</h4>
                                    <p>Learning through direct experience. In training: demos, videos, hands-on activities.</p>
                                </div>
                                <div class="kolb-stage reflection">
                                    <h4>2. Reflective Observation</h4>
                                    <p>Reviewing and analyzing the experience. In training: discussion questions, observations.</p>
                                </div>
                                <div class="kolb-stage conceptualization">
                                    <h4>3. Abstract Conceptualization</h4>
                                    <p>Forming theories and rules. In training: key concepts, principles, documentation.</p>
                                </div>
                                <div class="kolb-stage experimentation">
                                    <h4>4. Active Experimentation</h4>
                                    <p>Testing understanding through action. In training: practice exercises, quizzes, scenarios.</p>
                                </div>
                            </div>
                        `,
                        questions: [
                            'Which phase do you find most valuable for your own learning?',
                            'How can you ensure your content addresses all four phases?'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Applying Kolbs Model',
                        content: `
                            <p>Structure your CMI5 content to move learners through all four phases:</p>
                        `,
                        keyPoints: [
                            'Start with a video or demo (Concrete Experience)',
                            'Follow with reflection questions or analysis (Reflective Observation)',
                            'Present the theory, rules, or key points (Abstract Conceptualization)',
                            'End with a practice exercise or quiz (Active Experimentation)',
                            'Complete the cycle - the next lesson can build on experimentation results'
                        ]
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Design a Learning Sequence',
                        scenario: 'You are creating a lesson about configuring firewall rules. You want to follow Kolb\'s model.',
                        question: 'What should be the FIRST element of your lesson?',
                        choices: [
                            { text: 'A list of all firewall rule syntax options', correct: false, feedback: 'Starting with abstract rules skips the experience phase. Learners benefit from seeing before reading.' },
                            { text: 'A video demonstrating a firewall rule being configured', correct: true, feedback: 'Starting with a concrete demonstration gives learners an experience to reflect on before diving into theory.' },
                            { text: 'A quiz testing prior firewall knowledge', correct: false, feedback: 'Testing before teaching doesn\'t follow the experiential learning cycle.' },
                            { text: 'A text block explaining the importance of firewalls', correct: false, feedback: 'While context is important, leading with a concrete example is more engaging.' }
                        ],
                        requireCompletion: true
                    }
                ]
            }
        ],

        boss: {
            name: 'CHAOS CREATOR',
            sprite: 'images/boss_chaos_creator.svg',
            hp: 400,
            xpReward: 200,
            starReward: 6,
            intro: 'I am the CHAOS CREATOR! I fill training with confusion, poor videos, and meaningless interactions. Can you design content that defeats me?',
            scenario: {
                context: 'A stakeholder has reviewed your draft training course and has concerns. Address each one correctly.',
                questions: [
                    {
                        context: '"The training video is 45 minutes long. Is that okay?"',
                        text: 'How should you advise them about video length?',
                        choices: [
                            { text: 'That\'s fine - longer is more thorough', correct: false, feedback: 'Research shows learner engagement drops significantly after 10 minutes.', damage: 30 },
                            { text: 'Break it into 5-7 minute segments with checkpoints between each', correct: true, feedback: 'Chunking content into shorter videos improves retention and allows progress tracking.' },
                            { text: 'Remove the video entirely and use text instead', correct: false, feedback: 'Video is valuable for demonstrations; it just needs to be properly segmented.', damage: 25 },
                            { text: 'Speed up the video to make it shorter', correct: false, feedback: 'Speeding up makes content harder to follow without improving learning.', damage: 35 }
                        ]
                    },
                    {
                        context: '"The quiz only has 5 questions and they\'re always in the same order."',
                        text: 'What improvement would you recommend?',
                        choices: [
                            { text: 'Add more questions but keep the same order', correct: false, feedback: 'A larger bank is good, but fixed order allows pattern memorization.', damage: 20 },
                            { text: 'Create a larger question bank (10-15) and randomize both question selection and answer order', correct: true, feedback: 'Randomization from a larger pool prevents memorization and better tests true understanding.' },
                            { text: 'Remove the quiz since it can be gamed anyway', correct: false, feedback: 'Quizzes are valuable for assessment; they just need proper design.', damage: 30 },
                            { text: 'Make all questions fill-in-the-blank instead', correct: false, feedback: 'Question format variety helps, but doesn\'t address the randomization issue.', damage: 25 }
                        ]
                    },
                    {
                        context: '"I want to add a scenario-based section. When in the lesson should it appear?"',
                        text: 'Based on Kolb\'s model, where should a practice scenario be placed?',
                        choices: [
                            { text: 'At the very beginning to capture interest', correct: false, feedback: 'Learners need context before practice; placing scenarios first skips crucial phases.', damage: 25 },
                            { text: 'In the middle, mixed with the theory content', correct: false, feedback: 'Mixing experimentation with conceptualization can confuse learners.', damage: 20 },
                            { text: 'After the learner has experienced, reflected, and learned the concepts', correct: true, feedback: 'Active Experimentation comes after the other three phases in Kolb\'s cycle.' },
                            { text: 'Scenarios don\'t fit Kolb\'s model', correct: false, feedback: 'Scenarios are perfect for the Active Experimentation phase.', damage: 30 }
                        ]
                    },
                    {
                        context: '"How do I know if learners are actually watching the video or just skipping ahead?"',
                        text: 'What technical feature addresses this concern?',
                        choices: [
                            { text: 'Add a loud sound at the end of the video', correct: false, feedback: 'This doesn\'t prevent skipping; it just alerts them when they reach the end.', damage: 25 },
                            { text: 'Implement video progress tracking that prevents skipping ahead of watched position', correct: true, feedback: 'Tracking maximum watched position and requiring 90%+ completion ensures engagement.' },
                            { text: 'Trust that learners will watch it', correct: false, feedback: 'While trust is nice, verification is better for required training.', damage: 20 },
                            { text: 'Remove video controls entirely', correct: false, feedback: 'This hurts usability; learners should be able to pause and rewind.', damage: 30 }
                        ]
                    }
                ]
            }
        }
    },

    // ==========================================
    // WORLD 3: PACKAGE PALACE
    // Creating the CMI5 package
    // ==========================================
    3: {
        name: 'PACKAGE PALACE',
        description: 'Master the art of CMI5 packaging',
        icon: '🏰',
        npc: 'royal',
        introText: 'Welcome to the PACKAGE PALACE! Here you shall learn the royal protocols of CMI5 packaging. The XML scrolls contain powerful knowledge...',

        lessons: [
            {
                id: 'w3_lesson1',
                name: 'Creating cmi5.xml',
                description: 'Writing the course structure file',
                xpReward: 80,
                starReward: 2,
                category: 'code',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'cmi5.xml Walkthrough',
                        videoFile: 'cmi5xml_walkthrough.mp4',
                        videoDescription: 'Screen recording showing creation of cmi5.xml file in a text editor with explanation of each section',
                        description: 'Watch as we create a cmi5.xml file from scratch, explaining each required element.',
                        watchPrompt: 'the structure and how each element is defined'
                    },
                    {
                        type: 'text',
                        kolbPhase: 'reflection',
                        title: 'cmi5.xml Structure Analysis',
                        content: `
                            <p>The cmi5.xml file has a hierarchical structure:</p>
                            <div class="structure-tree">
                                <div class="tree-item level-0">courseStructure (root)</div>
                                <div class="tree-item level-1">└── course (course metadata)</div>
                                <div class="tree-item level-2">    ├── title</div>
                                <div class="tree-item level-2">    └── description</div>
                                <div class="tree-item level-1">└── au (assignable unit - launchable content)</div>
                                <div class="tree-item level-2">    ├── title</div>
                                <div class="tree-item level-2">    ├── description</div>
                                <div class="tree-item level-2">    ├── url (entry point)</div>
                                <div class="tree-item level-2">    ├── launchMethod</div>
                                <div class="tree-item level-2">    ├── moveOn</div>
                                <div class="tree-item level-2">    ├── masteryScore</div>
                                <div class="tree-item level-2">    └── objectives (optional)</div>
                            </div>
                        `,
                        questions: [
                            'Why does each AU need its own unique ID?',
                            'What happens if masteryScore is not set?'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'cmi5.xml Elements Reference',
                        content: `<p>Key elements and their requirements:</p>`,
                        keyPoints: [
                            '<course id="..."> - Unique identifier (URL format recommended)',
                            '<title><langstring lang="en-US">...</langstring></title> - Human-readable name',
                            '<au id="..."> - Each Assignable Unit needs a unique ID',
                            '<url>index.html</url> - Entry point file path (relative to package root)',
                            '<launchMethod>AnyWindow</launchMethod> - How content opens (AnyWindow or OwnWindow)',
                            '<moveOn>Passed</moveOn> - When AU is considered complete (Passed, Completed, CompletedOrPassed, CompletedAndPassed, NotApplicable)',
                            '<masteryScore>0.8</masteryScore> - Score needed to pass (0.0 to 1.0)'
                        ],
                        codeExample: `<?xml version="1.0" encoding="UTF-8"?>
<courseStructure xmlns="https://w3id.org/xapi/profiles/cmi5/v1/CourseStructure.xsd">
    <course id="https://myorg.mil/training/cybersecurity-101">
        <title>
            <langstring lang="en-US">Cybersecurity Fundamentals</langstring>
        </title>
        <description>
            <langstring lang="en-US">Introduction to cybersecurity concepts and best practices.</langstring>
        </description>
    </course>

    <au id="https://myorg.mil/training/cybersecurity-101/module1">
        <title>
            <langstring lang="en-US">Module 1: Security Basics</langstring>
        </title>
        <description>
            <langstring lang="en-US">Learn fundamental security concepts.</langstring>
        </description>
        <url>index.html</url>
        <launchMethod>AnyWindow</launchMethod>
        <moveOn>Passed</moveOn>
        <masteryScore>0.8</masteryScore>
    </au>
</courseStructure>`
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Spot the Error',
                        scenario: 'Review this cmi5.xml snippet and identify the problem:\n\n<au id="module1">\n  <title>Module 1</title>\n  <url>content/index.html</url>\n</au>',
                        question: 'What is WRONG with this AU definition?',
                        choices: [
                            { text: 'The id should be a full URL, not just "module1"', correct: false, feedback: 'While full URLs are recommended, short IDs can work. There\'s another issue.' },
                            { text: 'The title element is missing the langstring wrapper', correct: true, feedback: 'Correct! Titles must use <langstring lang="en-US">Title Text</langstring> format.' },
                            { text: 'The url cannot be in a subfolder', correct: false, feedback: 'URLs can reference files in subfolders. The path is fine.' },
                            { text: 'There\'s nothing wrong with this snippet', correct: false, feedback: 'There is an error - the title format is incorrect.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w3_lesson2',
                name: 'CMI5 JavaScript Integration',
                description: 'Implementing xAPI tracking in your content',
                xpReward: 90,
                starReward: 2,
                category: 'code',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'CMI5 JavaScript Demo',
                        videoFile: 'cmi5_javascript_demo.mp4',
                        videoDescription: 'Live coding demo showing initialization of CMI5, sending xAPI statements, and handling completion',
                        description: 'Watch how to implement CMI5 tracking in your course JavaScript.',
                        watchPrompt: 'the initialization flow and when each statement is sent'
                    },
                    {
                        type: 'text',
                        kolbPhase: 'reflection',
                        title: 'CMI5 Launch Flow',
                        content: `
                            <p>When the LMS launches your content, it passes parameters in the URL:</p>
                            <ol>
                                <li><strong>fetch</strong> - URL to retrieve authentication token</li>
                                <li><strong>endpoint</strong> - LRS endpoint for xAPI statements</li>
                                <li><strong>actor</strong> - The learner's identity (JSON)</li>
                                <li><strong>registration</strong> - Session registration ID</li>
                                <li><strong>activityId</strong> - The AU's identifier</li>
                            </ol>
                            <p>Your content must parse these, authenticate, and send proper statements.</p>
                        `
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Required xAPI Statements',
                        content: `<p>CMI5 requires these statements in order:</p>`,
                        keyPoints: [
                            'initialized - Sent once when content launches and auth completes',
                            'completed - Sent when learner finishes the content (optional based on moveOn)',
                            'passed OR failed - Sent when assessment is scored (required if moveOn is Passed)',
                            'terminated - Sent when learner exits (MUST be final statement)'
                        ],
                        codeExample: `// CMI5 initialization and tracking
async function initCmi5() {
    const params = new URLSearchParams(window.location.search);
    const fetchUrl = params.get('fetch');
    const endpoint = params.get('endpoint');

    // Get auth token
    const response = await fetch(fetchUrl, { method: 'POST' });
    const data = await response.json();
    const auth = data['auth-token'];

    // Send initialized statement
    await sendStatement('http://adlnet.gov/expapi/verbs/initialized');
}

// Send xAPI statement
async function sendStatement(verb, result = null) {
    const statement = {
        actor: JSON.parse(decodeURIComponent(actor)),
        verb: { id: verb },
        object: { id: activityId, objectType: 'Activity' },
        context: { registration: registration }
    };
    if (result) statement.result = result;

    await fetch(endpoint + 'statements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + auth,
            'X-Experience-API-Version': '1.0.3'
        },
        body: JSON.stringify(statement)
    });
}

// Course completion
function completeCourse(passed, score) {
    sendStatement('http://adlnet.gov/expapi/verbs/completed');
    sendStatement(
        passed ? 'http://adlnet.gov/expapi/verbs/passed' : 'http://adlnet.gov/expapi/verbs/failed',
        { score: { scaled: score }, success: passed, completion: true }
    );
    sendStatement('http://adlnet.gov/expapi/verbs/terminated');
}`
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Statement Order',
                        scenario: 'Your course needs to track: course start, video watched, quiz passed, and course exit.',
                        question: 'Which statement MUST be sent last according to CMI5 spec?',
                        choices: [
                            { text: 'completed', correct: false, feedback: 'Completed can be sent before the final statement.' },
                            { text: 'passed', correct: false, feedback: 'Passed is important but not required to be last.' },
                            { text: 'terminated', correct: true, feedback: 'Correct! The terminated statement MUST be the final statement sent in any CMI5 session.' },
                            { text: 'initialized', correct: false, feedback: 'Initialized is the first statement, not the last.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w3_lesson3',
                name: 'Packaging and Validation',
                description: 'Creating the final ZIP package',
                xpReward: 70,
                starReward: 2,
                category: 'config',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'Packaging Walkthrough',
                        videoFile: 'packaging_walkthrough.mp4',
                        videoDescription: 'Screen recording showing: file organization, ZIP creation, validation testing',
                        description: 'Watch the complete process of packaging a CMI5 course for upload.',
                        watchPrompt: 'the file structure and common mistakes to avoid'
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Packaging Checklist',
                        content: `<p>Before creating your ZIP package, verify:</p>`,
                        keyPoints: [
                            'cmi5.xml is at the root level (not in a subfolder)',
                            'Entry point file (index.html) exists at the path specified in cmi5.xml',
                            'All referenced resources (images, videos, CSS, JS) are included',
                            'File paths use forward slashes, not backslashes',
                            'No absolute URLs - all resources should be relative paths',
                            'ZIP created without extra wrapper folder (cmi5.xml should be at top level when extracted)'
                        ]
                    },
                    {
                        type: 'image',
                        kolbPhase: 'reflection',
                        title: 'Common Packaging Mistakes',
                        imageFile: 'packaging_mistakes.png',
                        imageDescription: 'Side-by-side showing WRONG (files in subfolder) vs RIGHT (cmi5.xml at root)',
                        content: `
                            <p>The most common mistake is creating a ZIP with an extra folder level:</p>
                            <div class="comparison">
                                <div class="wrong">
                                    <h4>WRONG</h4>
                                    <pre>package.zip
└── my_course/
    ├── cmi5.xml
    └── index.html</pre>
                                </div>
                                <div class="right">
                                    <h4>CORRECT</h4>
                                    <pre>package.zip
├── cmi5.xml
└── index.html</pre>
                                </div>
                            </div>
                        `
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Validation Check',
                        scenario: 'You\'ve created a ZIP package and want to verify it\'s correct before uploading to PCTE.',
                        question: 'What is the FIRST thing you should check when you extract the ZIP?',
                        choices: [
                            { text: 'That index.html opens in a browser', correct: false, feedback: 'Checking content is good, but first verify the structure.' },
                            { text: 'That cmi5.xml is at the root level, not inside a subfolder', correct: true, feedback: 'Correct! The most common error is having cmi5.xml nested in a folder. Always verify this first.' },
                            { text: 'That the total file size is under 100MB', correct: false, feedback: 'Size matters for upload limits, but structure must be verified first.' },
                            { text: 'That all images display correctly', correct: false, feedback: 'Image display is important but secondary to package structure.' }
                        ],
                        requireCompletion: true
                    }
                ]
            }
        ],

        boss: {
            name: 'XML WARLOCK',
            sprite: 'images/boss_xml_warlock.svg',
            hp: 450,
            xpReward: 225,
            starReward: 7,
            intro: 'I am the XML WARLOCK! My malformed tags and missing attributes have doomed many packages. Can your XML withstand my scrutiny?',
            scenario: {
                context: 'Your colleague has created a CMI5 package that isn\'t working. Debug each issue they present.',
                questions: [
                    {
                        context: '"The LMS says it can\'t find my course structure. Here\'s my ZIP contents: package.zip → training_folder → cmi5.xml, index.html"',
                        text: 'What is the problem with this package structure?',
                        choices: [
                            { text: 'The ZIP file name should be cmi5.zip', correct: false, feedback: 'ZIP filename doesn\'t matter. The internal structure is the problem.', damage: 25 },
                            { text: 'cmi5.xml must be at the ZIP root, not inside a subfolder', correct: true, feedback: 'Correct! The LMS looks for cmi5.xml at the root level of the extracted ZIP.' },
                            { text: 'You need to add a manifest.xml file too', correct: false, feedback: 'CMI5 doesn\'t use manifest.xml - that\'s SCORM.', damage: 30 },
                            { text: 'The folder name should be "cmi5_content"', correct: false, feedback: 'Folder names don\'t matter; the issue is that there shouldn\'t be a wrapper folder at all.', damage: 20 }
                        ]
                    },
                    {
                        context: '"My course launches but never shows as completed in PCTE. Here\'s my JavaScript: function finish() { alert(\'Done!\'); }"',
                        text: 'Why isn\'t the course marking as complete?',
                        choices: [
                            { text: 'The alert message is wrong', correct: false, feedback: 'The message content doesn\'t affect LMS tracking.', damage: 25 },
                            { text: 'The function needs to send xAPI completed and terminated statements to the LMS', correct: true, feedback: 'Correct! Without sending proper xAPI statements, the LMS has no way to know the course is complete.' },
                            { text: 'PCTE doesn\'t support JavaScript', correct: false, feedback: 'PCTE fully supports JavaScript content.', damage: 30 },
                            { text: 'The function name should be completeСourse()', correct: false, feedback: 'Function names are arbitrary; the issue is missing xAPI integration.', damage: 20 }
                        ]
                    },
                    {
                        context: '"I set masteryScore to 80 but learners are passing with 50%. Why?"',
                        text: 'What is wrong with the masteryScore setting?',
                        choices: [
                            { text: 'masteryScore should be 80%, not 80', correct: false, feedback: 'CMI5 uses decimal format, not percentage.', damage: 20 },
                            { text: 'masteryScore uses a 0.0-1.0 scale, so 80% should be 0.8, not 80', correct: true, feedback: 'Correct! CMI5 uses scaled scores where 1.0 = 100%. A value of 80 would be invalid.' },
                            { text: 'PCTE ignores masteryScore settings', correct: false, feedback: 'PCTE respects masteryScore; it just needs to be in the correct format.', damage: 30 },
                            { text: 'You need to set it in both cmi5.xml and JavaScript', correct: false, feedback: 'masteryScore in cmi5.xml is sufficient; the issue is the value format.', damage: 25 }
                        ]
                    }
                ]
            }
        }
    },

    // ==========================================
    // WORLD 4: UPLOAD FORTRESS
    // Uploading to PCTE
    // ==========================================
    4: {
        name: 'UPLOAD FORTRESS',
        description: 'Learn to upload and manage content in PCTE',
        icon: '🗼',
        npc: 'guard',
        introText: 'You approach the UPLOAD FORTRESS! Only those who understand the upload protocols may enter. Prove your worth!',

        lessons: [
            {
                id: 'w4_lesson1',
                name: 'PCTE Navigation',
                description: 'Finding your way around PCTE',
                xpReward: 60,
                starReward: 1,
                category: 'config',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'PCTE Interface Tour',
                        videoFile: 'pcte_interface_tour.mp4',
                        videoDescription: 'Screen recording navigating through PCTE: login, dashboard, content management, user areas',
                        description: 'Watch this tour of the PCTE interface to familiarize yourself with the platform.',
                        watchPrompt: 'where content management options are located'
                    },
                    {
                        type: 'image',
                        kolbPhase: 'reflection',
                        title: 'PCTE Dashboard',
                        imageFile: 'pcte_dashboard.png',
                        imageDescription: 'Annotated screenshot of PCTE dashboard with callouts for: Navigation menu, Content area, User info, Help',
                        content: `
                            <p>The PCTE dashboard provides access to key areas:</p>
                        `,
                        callouts: [
                            'Main navigation menu (left side)',
                            'Content management area',
                            'User profile and settings',
                            'Help and documentation links'
                        ]
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'PCTE Access Requirements',
                        content: `<p>Before uploading content to PCTE, ensure you have:</p>`,
                        keyPoints: [
                            'Valid PCTE account with content creator/admin permissions',
                            'Access to the specific training environment/instance',
                            'Completed CMI5 package ready for upload',
                            'Knowledge of where the content should be categorized',
                            'Testing plan for post-upload validation'
                        ]
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Access Check',
                        scenario: 'You try to upload content to PCTE but don\'t see the upload option.',
                        question: 'What is the MOST likely cause?',
                        choices: [
                            { text: 'PCTE is down for maintenance', correct: false, feedback: 'If PCTE were down, you wouldn\'t be able to log in at all.' },
                            { text: 'Your account lacks content creator/administrator permissions', correct: true, feedback: 'Upload options are only visible to users with appropriate permissions.' },
                            { text: 'Your browser is incompatible', correct: false, feedback: 'Browser issues would affect more than just upload visibility.' },
                            { text: 'The content is too large', correct: false, feedback: 'Size limits wouldn\'t hide the upload option entirely.' }
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w4_lesson2',
                name: 'Uploading Content',
                description: 'Step-by-step upload process',
                xpReward: 80,
                starReward: 2,
                category: 'config',
                steps: [
                    {
                        type: 'video',
                        kolbPhase: 'experience',
                        title: 'Upload Process Demo',
                        videoFile: 'upload_process_demo.mp4',
                        videoDescription: 'Complete walkthrough: selecting upload, choosing file, filling metadata, confirming, checking status',
                        description: 'Watch the complete upload process from start to finish.',
                        watchPrompt: 'each step and what information is required'
                    },
                    {
                        type: 'image',
                        kolbPhase: 'reflection',
                        title: 'Upload Workflow',
                        imageFile: 'upload_workflow.png',
                        imageDescription: 'Flowchart: Select Upload → Choose ZIP → Enter Metadata → Confirm → Processing → Validation → Ready',
                        content: `
                            <p>The upload workflow has these stages:</p>
                            <ol>
                                <li>Navigate to content management</li>
                                <li>Select "Upload CMI5 Package"</li>
                                <li>Choose your ZIP file</li>
                                <li>Enter/confirm metadata (title, description, category)</li>
                                <li>Submit and wait for processing</li>
                                <li>Review validation results</li>
                                <li>Test the deployed content</li>
                            </ol>
                        `
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Upload Requirements',
                        content: `<p>PCTE upload requirements:</p>`,
                        keyPoints: [
                            'Package must be a valid ZIP file',
                            'Maximum file size varies by instance (typically 100-500MB)',
                            'cmi5.xml must be valid and at package root',
                            'All referenced resources must be included',
                            'Metadata fields (title, description) may be required',
                            'Processing time depends on package size and complexity'
                        ]
                    },
                    {
                        type: 'interactive',
                        kolbPhase: 'experimentation',
                        title: 'Upload Sequence',
                        instructions: 'Arrange these upload steps in the correct order.',
                        interactiveType: 'sequence',
                        items: [
                            'Navigate to Content Management in PCTE',
                            'Click "Upload CMI5 Package" or equivalent option',
                            'Select your prepared ZIP file',
                            'Enter or verify course metadata',
                            'Click Upload/Submit and wait for processing',
                            'Review validation results for errors',
                            'Test the content as a learner'
                        ],
                        requireCompletion: true
                    }
                ]
            },
            {
                id: 'w4_lesson3',
                name: 'Troubleshooting Uploads',
                description: 'Diagnosing and fixing common upload issues',
                xpReward: 90,
                starReward: 2,
                category: 'config',
                steps: [
                    {
                        type: 'text',
                        kolbPhase: 'experience',
                        title: 'Common Upload Errors',
                        content: `
                            <p>You will encounter these errors. Learn to recognize and fix them:</p>
                            <div class="error-list">
                                <div class="error-item">
                                    <h4>ERROR: cmi5.xml not found</h4>
                                    <p><strong>Cause:</strong> cmi5.xml is missing or in a subfolder</p>
                                    <p><strong>Fix:</strong> Ensure cmi5.xml is at the ZIP root level</p>
                                </div>
                                <div class="error-item">
                                    <h4>ERROR: Invalid XML structure</h4>
                                    <p><strong>Cause:</strong> Malformed XML, missing required elements</p>
                                    <p><strong>Fix:</strong> Validate XML against CMI5 schema, check for typos</p>
                                </div>
                                <div class="error-item">
                                    <h4>ERROR: Entry point not found</h4>
                                    <p><strong>Cause:</strong> URL in cmi5.xml doesn't match actual file location</p>
                                    <p><strong>Fix:</strong> Verify the <url> element matches your file path</p>
                                </div>
                                <div class="error-item">
                                    <h4>ERROR: File too large</h4>
                                    <p><strong>Cause:</strong> Package exceeds size limit</p>
                                    <p><strong>Fix:</strong> Compress videos, optimize images, or split into modules</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        type: 'text',
                        kolbPhase: 'conceptualization',
                        title: 'Troubleshooting Strategy',
                        content: `<p>When uploads fail, follow this diagnostic process:</p>`,
                        keyPoints: [
                            'Read the error message carefully - it usually indicates the problem',
                            'Extract your ZIP and verify cmi5.xml is at root level',
                            'Validate your cmi5.xml with an XML validator',
                            'Check that all file paths in cmi5.xml match actual files',
                            'Verify file sizes are within limits',
                            'Test your content locally before uploading (open index.html)',
                            'If all else fails, start with a known-good template'
                        ]
                    },
                    {
                        type: 'practice',
                        kolbPhase: 'experimentation',
                        title: 'Diagnose This Error',
                        scenario: 'Upload fails with error: "URL entry point \'content/index.html\' not found in package"',
                        question: 'What is the MOST likely cause?',
                        choices: [
                            { text: 'The file index.html doesn\'t exist at all', correct: false, feedback: 'Possible, but there\'s a more specific issue indicated by the path.' },
                            { text: 'index.html exists at package root, but cmi5.xml says it\'s in "content/" folder', correct: true, feedback: 'Correct! The path in <url> must match the actual file location in the ZIP.' },
                            { text: 'PCTE doesn\'t support HTML files', correct: false, feedback: 'PCTE fully supports HTML entry points.' },
                            { text: 'The URL should use backslashes instead of forward slashes', correct: false, feedback: 'URLs should use forward slashes, which is correct in the error message.' }
                        ],
                        requireCompletion: true
                    }
                ]
            }
        ],

        boss: {
            name: 'UPLOAD GUARDIAN',
            sprite: 'images/boss_upload_guardian.svg',
            hp: 500,
            xpReward: 250,
            starReward: 8,
            intro: 'I am the UPLOAD GUARDIAN! Many packages have been rejected at my gates. Only those with perfect packages may pass!',
            scenario: {
                context: 'You\'re helping team members troubleshoot their PCTE upload issues. Solve each problem.',
                questions: [
                    {
                        context: '"I uploaded my course yesterday but it still says \'Processing\'. It\'s been 24 hours!"',
                        text: 'What should they try first?',
                        choices: [
                            { text: 'Wait another 24 hours - processing can take time', correct: false, feedback: 'While some processing takes time, 24 hours is excessive for most packages.', damage: 25 },
                            { text: 'Check the processing/validation log for errors that may have halted processing', correct: true, feedback: 'Correct! "Stuck" processing often means a silent error occurred. Check logs for details.' },
                            { text: 'Delete and re-upload the exact same file', correct: false, feedback: 'Re-uploading the same file will likely produce the same result.', damage: 20 },
                            { text: 'Contact IT to restart the PCTE server', correct: false, feedback: 'Server restarts are rarely needed for individual upload issues.', damage: 30 }
                        ]
                    },
                    {
                        context: '"The course uploaded but when I launch it, I just see a blank white page."',
                        text: 'What is the MOST likely cause?',
                        choices: [
                            { text: 'PCTE doesn\'t support their browser', correct: false, feedback: 'Browser issues would affect more than just this one course.', damage: 25 },
                            { text: 'JavaScript errors in the content - check browser console for details', correct: true, feedback: 'Correct! A blank page usually means JavaScript failed to execute. Browser console will show the error.' },
                            { text: 'The video file is too large', correct: false, feedback: 'Large videos might load slowly but wouldn\'t cause a completely blank page.', damage: 20 },
                            { text: 'The masteryScore is set incorrectly', correct: false, feedback: 'masteryScore affects completion tracking, not initial page display.', damage: 25 }
                        ]
                    },
                    {
                        context: '"My course works when I open index.html locally, but fails in PCTE."',
                        text: 'What is different about the PCTE environment that could cause this?',
                        choices: [
                            { text: 'PCTE uses a different HTML version', correct: false, feedback: 'HTML standards are the same; the difference is in how the content is launched.', damage: 25 },
                            { text: 'PCTE launches with CMI5 parameters that the content may not be handling properly', correct: true, feedback: 'Correct! Local testing doesn\'t include CMI5 launch parameters. The content may fail when trying to parse/use them.' },
                            { text: 'PCTE automatically compresses all content', correct: false, feedback: 'PCTE doesn\'t compress or modify content.', damage: 30 },
                            { text: 'Local and server JavaScript work differently', correct: false, feedback: 'JavaScript execution is similar, but the CMI5 context is the key difference.', damage: 20 }
                        ]
                    },
                    {
                        context: '"Learners complete the course but it doesn\'t show as \'Passed\' in their records."',
                        text: 'What is likely missing from the course code?',
                        choices: [
                            { text: 'The CSS styling for the completion message', correct: false, feedback: 'CSS affects display, not LMS tracking.', damage: 25 },
                            { text: 'xAPI statements to send passed/completed status to the LMS', correct: true, feedback: 'Correct! The content must explicitly send xAPI statements for the LMS to record completion/pass status.' },
                            { text: 'A certificate download feature', correct: false, feedback: 'Certificates are separate from completion tracking.', damage: 30 },
                            { text: 'A "Mark Complete" button', correct: false, feedback: 'UI buttons alone don\'t affect LMS records without proper xAPI integration.', damage: 20 }
                        ]
                    }
                ]
            }
        }
    },

    // ==========================================
    // WORLD 5: CERTIFICATION TOWER (Final Boss)
    // Final exam
    // ==========================================
    5: {
        name: 'CERTIFICATION TOWER',
        description: 'Prove your mastery in the final exam',
        icon: '👑',
        npc: 'king',
        introText: 'You have reached the CERTIFICATION TOWER! Within awaits the CMI5 GUARDIAN. Only by answering correctly 80% of the time will you survive. Are you ready?',

        lessons: [], // No lessons - just the final boss

        boss: {
            name: 'CMI5 GUARDIAN',
            sprite: 'images/boss_cmi5_guardian.svg',
            hp: 1000,
            xpReward: 500,
            starReward: 10,
            intro: 'I am the CMI5 GUARDIAN, keeper of certification! To prove your mastery, you must answer my questions. Score below 80% and you shall fall! Let the final test begin!',
            questions: [
                // Pool of 20 questions - 10 will be randomly selected
                {
                    text: 'What file must be at the root level of every CMI5 package?',
                    choices: [
                        { text: 'cmi5.xml', correct: true },
                        { text: 'manifest.xml', correct: false },
                        { text: 'index.html', correct: false },
                        { text: 'package.json', correct: false }
                    ]
                },
                {
                    text: 'What is the correct format for masteryScore in cmi5.xml?',
                    choices: [
                        { text: 'A decimal between 0.0 and 1.0 (e.g., 0.8 for 80%)', correct: true },
                        { text: 'A percentage (e.g., 80%)', correct: false },
                        { text: 'A whole number (e.g., 80)', correct: false },
                        { text: 'A letter grade (e.g., B)', correct: false }
                    ]
                },
                {
                    text: 'Which xAPI statement must ALWAYS be sent last in a CMI5 session?',
                    choices: [
                        { text: 'terminated', correct: true },
                        { text: 'completed', correct: false },
                        { text: 'passed', correct: false },
                        { text: 'satisfied', correct: false }
                    ]
                },
                {
                    text: 'What does AU stand for in CMI5?',
                    choices: [
                        { text: 'Assignable Unit', correct: true },
                        { text: 'Assessment Unit', correct: false },
                        { text: 'Audio Unit', correct: false },
                        { text: 'Automatic Upload', correct: false }
                    ]
                },
                {
                    text: 'What is the relationship between CMI5 and xAPI?',
                    choices: [
                        { text: 'CMI5 is a profile that defines how to use xAPI for LMS content', correct: true },
                        { text: 'They are two names for the same standard', correct: false },
                        { text: 'xAPI replaced CMI5', correct: false },
                        { text: 'CMI5 replaced xAPI', correct: false }
                    ]
                },
                {
                    text: 'What happens if cmi5.xml is inside a subfolder in your ZIP?',
                    choices: [
                        { text: 'The LMS will not find the course structure', correct: true },
                        { text: 'The course will work normally', correct: false },
                        { text: 'The subfolder becomes the course root', correct: false },
                        { text: 'The LMS will automatically extract it', correct: false }
                    ]
                },
                {
                    text: 'In Kolb\'s Learning Cycle, which phase involves watching demonstrations or videos?',
                    choices: [
                        { text: 'Concrete Experience', correct: true },
                        { text: 'Reflective Observation', correct: false },
                        { text: 'Abstract Conceptualization', correct: false },
                        { text: 'Active Experimentation', correct: false }
                    ]
                },
                {
                    text: 'What is the recommended maximum length for a training video segment?',
                    choices: [
                        { text: '5-10 minutes', correct: true },
                        { text: '30-45 minutes', correct: false },
                        { text: '1-2 hours', correct: false },
                        { text: 'No limit - longer is better', correct: false }
                    ]
                },
                {
                    text: 'Which video format is recommended for CMI5 web content?',
                    choices: [
                        { text: 'MP4 with H.264 codec', correct: true },
                        { text: 'AVI', correct: false },
                        { text: 'WMV', correct: false },
                        { text: 'MOV', correct: false }
                    ]
                },
                {
                    text: 'What does moveOn="Passed" mean in cmi5.xml?',
                    choices: [
                        { text: 'The learner must achieve the mastery score to complete the AU', correct: true },
                        { text: 'The learner can skip this content', correct: false },
                        { text: 'The content will auto-advance after viewing', correct: false },
                        { text: 'The AU has been disabled', correct: false }
                    ]
                },
                {
                    text: 'A course works locally but shows a blank page in PCTE. What should you check first?',
                    choices: [
                        { text: 'Browser console for JavaScript errors related to CMI5 parameters', correct: true },
                        { text: 'The color scheme of the content', correct: false },
                        { text: 'The font size settings', correct: false },
                        { text: 'The number of images used', correct: false }
                    ]
                },
                {
                    text: 'What information does the LMS pass to content at launch?',
                    choices: [
                        { text: 'Fetch URL, endpoint, actor, registration, and activityId', correct: true },
                        { text: 'Just the learner name', correct: false },
                        { text: 'Only the course score', correct: false },
                        { text: 'Nothing - content must query the LMS', correct: false }
                    ]
                },
                {
                    text: 'Why should quiz questions be randomized?',
                    choices: [
                        { text: 'To prevent memorization of answers by order', correct: true },
                        { text: 'To make the quiz load faster', correct: false },
                        { text: 'Because PCTE requires it', correct: false },
                        { text: 'To reduce file size', correct: false }
                    ]
                },
                {
                    text: 'What is the purpose of the langstring element in cmi5.xml?',
                    choices: [
                        { text: 'To specify the language of text content for internationalization', correct: true },
                        { text: 'To compress the text', correct: false },
                        { text: 'To encrypt the content', correct: false },
                        { text: 'To link to external resources', correct: false }
                    ]
                },
                {
                    text: 'According to Kolb\'s model, when should practice exercises occur?',
                    choices: [
                        { text: 'After experiencing, reflecting, and learning concepts', correct: true },
                        { text: 'At the very beginning', correct: false },
                        { text: 'Mixed randomly throughout', correct: false },
                        { text: 'Only if time permits', correct: false }
                    ]
                },
                {
                    text: 'What does PCTE stand for?',
                    choices: [
                        { text: 'Persistent Cyber Training Environment', correct: true },
                        { text: 'Personal Computer Training Education', correct: false },
                        { text: 'Public Content Teaching Exchange', correct: false },
                        { text: 'Private Cloud Training Enterprise', correct: false }
                    ]
                },
                {
                    text: 'Which statement should be sent when a learner first loads CMI5 content?',
                    choices: [
                        { text: 'initialized', correct: true },
                        { text: 'completed', correct: false },
                        { text: 'launched', correct: false },
                        { text: 'started', correct: false }
                    ]
                },
                {
                    text: 'What is the correct way to prevent video skipping in training content?',
                    choices: [
                        { text: 'Track maximum watched position and prevent seeking beyond it', correct: true },
                        { text: 'Remove all video controls', correct: false },
                        { text: 'Make the video play at 0.5x speed', correct: false },
                        { text: 'Add a password after the video', correct: false }
                    ]
                },
                {
                    text: 'If upload fails with "Invalid XML", what should you check first?',
                    choices: [
                        { text: 'That cmi5.xml is well-formed with proper tags and required elements', correct: true },
                        { text: 'That images are high resolution', correct: false },
                        { text: 'That the ZIP file name is correct', correct: false },
                        { text: 'That you have internet connection', correct: false }
                    ]
                },
                {
                    text: 'What is the primary benefit of using CMI5 over just hosting files?',
                    choices: [
                        { text: 'Standardized tracking, progress reporting, and completion verification', correct: true },
                        { text: 'Smaller file sizes', correct: false },
                        { text: 'Better graphics quality', correct: false },
                        { text: 'Automatic translation', correct: false }
                    ]
                }
            ]
        }
    }
};
