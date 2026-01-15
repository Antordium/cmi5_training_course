# PCTE Training RPG

An RPG-style interactive training course that teaches learners how to create and upload CMI5-compliant training content to the Persistent Cyber Training Environment (PCTE).

## Overview

This course uses Final Fantasy-inspired game mechanics to make learning engaging and memorable. Players journey through 5 worlds, each teaching different aspects of CMI5 content creation, with boss battles serving as scenario-based assessments.

## Features

### RPG Game Mechanics
- **Character Classes**: Developer, Designer, or Admin - each with unique bonuses
- **Experience Points (XP)**: Earn XP by completing lessons and defeating bosses
- **Leveling System**: 10 levels with increasing XP requirements
- **Skills**: Unlock new abilities as you level up
- **HP System**: Track your learning health through boss battles

### Educational Design
- **Kolb's Learning Cycle**: Each lesson follows the 4-phase experiential learning model:
  1. **Experience** - Engage with new concepts
  2. **Reflect** - Consider what you learned
  3. **Conceptualize** - Understand the theory
  4. **Experiment** - Apply knowledge practically

### 5 Worlds of Learning

| World | Name | Topics Covered |
|-------|------|----------------|
| 1 | Tutorial Village | PCTE overview, CMI5 basics, xAPI fundamentals |
| 2 | Content Caverns | Video creation, images, interactives, Kolb's model |
| 3 | Package Palace | cmi5.xml manifest, JavaScript integration, packaging |
| 4 | Upload Fortress | PCTE navigation, upload process, troubleshooting |
| 5 | Certification Tower | Final exam (20 questions, 80% to pass) |

### Boss Battle System
- Each world ends with a boss battle
- Answer scenario-based questions to damage the boss
- Wrong answers result in player damage
- Must achieve 80% accuracy to defeat the boss
- Final boss has 20 questions - your ultimate certification exam

### Progress Persistence
- Game state saved to localStorage
- Resume where you left off
- Tracks completed lessons, XP, level, and world progress

## File Structure

```
pcte_training_rpg/
├── index.html          # Main game HTML with all screens
├── game.js             # RPG mechanics and game logic
├── course-content.js   # All lesson content and quiz questions
├── styles.css          # FF-inspired retro-modern styling
├── cmi5.js             # CMI5/xAPI LMS integration
├── cmi5.xml            # Course structure manifest
├── README.md           # This file
├── images/
│   └── README.md       # Image asset requirements
├── videos/
│   └── README.md       # Video asset requirements
└── audio/
    └── README.md       # Audio asset requirements
```

## Quick Start

### Standalone Mode
1. Open `index.html` in a modern browser
2. Create your character
3. Begin your adventure!

### LMS Deployment
1. Add required media assets (see asset READMEs)
2. Package all files as a ZIP
3. Upload to your CMI5-compatible LMS
4. The `cmi5.xml` defines the course structure

## Customization

### Modifying Content
Edit `course-content.js` to:
- Change lesson text and scenarios
- Add/remove lessons
- Modify quiz questions
- Adjust boss battle questions

### Styling
Edit `styles.css` to change:
- Color palette (CSS variables at top)
- Fonts
- Animations
- Layout

### Game Balance
Edit `game.js` to adjust:
- XP requirements per level
- Damage values
- Boss HP
- Class bonuses

## CMI5 Integration

The course sends xAPI statements for:
- `initialized` - Course/lesson started
- `progressed` - Step/lesson completed
- `completed` - World completed
- `passed/failed` - Boss battle results
- `achieved` - Level ups
- `terminated` - Course exit

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Credits

Inspired by classic Final Fantasy games and modern instructional design principles.

## License

This template is provided for creating CMI5-compliant training content.
