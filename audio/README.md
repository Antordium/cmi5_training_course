# Audio Folder - PCTE Training RPG

This folder contains audio assets for the RPG-style training course.

## Required Audio Files

### Background Music

| Filename | Duration | Description |
|----------|----------|-------------|
| `title-theme.mp3` | 1-2min | Title screen music (loop) |
| `world-map.mp3` | 2-3min | World map exploration music (loop) |
| `world-1-theme.mp3` | 2-3min | Tutorial Village theme (loop) |
| `world-2-theme.mp3` | 2-3min | Content Caverns theme (loop) |
| `world-3-theme.mp3` | 2-3min | Package Palace theme (loop) |
| `world-4-theme.mp3` | 2-3min | Upload Fortress theme (loop) |
| `world-5-theme.mp3` | 2-3min | Certification Tower theme (loop) |
| `lesson-theme.mp3` | 2-3min | General lesson/learning music (loop) |
| `boss-battle.mp3` | 2-3min | Boss battle music (loop, intense) |
| `final-boss.mp3` | 3-4min | Final boss epic battle music (loop) |
| `victory-fanfare.mp3` | 10-15s | Victory celebration (one-shot) |
| `game-over.mp3` | 10-15s | Game over music (one-shot) |

### Sound Effects

| Filename | Duration | Description |
|----------|----------|-------------|
| `menu-select.mp3` | 0.2s | Menu selection sound |
| `menu-confirm.mp3` | 0.3s | Confirm/accept sound |
| `menu-cancel.mp3` | 0.2s | Cancel/back sound |
| `step-complete.mp3` | 0.5s | Lesson step completion |
| `lesson-complete.mp3` | 1s | Full lesson completion |
| `level-up.mp3` | 2s | Level up fanfare |
| `xp-gain.mp3` | 0.5s | XP gained sound |
| `boss-appear.mp3` | 2s | Boss entrance sound |
| `attack-hit.mp3` | 0.3s | Correct answer (attack hits boss) |
| `attack-miss.mp3` | 0.3s | Wrong answer (attack misses) |
| `boss-damage.mp3` | 0.5s | Boss taking damage |
| `boss-defeat.mp3` | 2s | Boss defeated sound |
| `player-damage.mp3` | 0.5s | Player taking damage |
| `world-unlock.mp3` | 1s | New world unlocked |
| `skill-unlock.mp3` | 1s | New skill learned |
| `typing.mp3` | 0.1s | Text appearing sound (optional) |

### Voice Lines (Optional)

| Filename | Description |
|----------|-------------|
| `narrator-welcome.mp3` | "Welcome, brave learner..." |
| `narrator-world-1.mp3` | World 1 introduction |
| `narrator-world-2.mp3` | World 2 introduction |
| `narrator-world-3.mp3` | World 3 introduction |
| `narrator-world-4.mp3` | World 4 introduction |
| `narrator-world-5.mp3` | World 5 introduction |
| `boss-taunt-1.mp3` | Boss taunt line |
| `boss-defeat-cry.mp3` | Boss defeat cry |
| `victory-congrats.mp3` | Victory congratulations |

## Audio Specifications

### Music Files

| Property | Requirement |
|----------|-------------|
| **Format** | MP3 (preferred), OGG (alternative) |
| **Bitrate** | 128-192 kbps |
| **Sample Rate** | 44.1 kHz |
| **Channels** | Stereo |
| **Looping** | Seamless loop points for BGM |

### Sound Effects

| Property | Requirement |
|----------|-------------|
| **Format** | MP3 or WAV |
| **Bitrate** | 128 kbps (MP3) |
| **Sample Rate** | 44.1 kHz |
| **Channels** | Mono or Stereo |
| **Normalization** | -3dB peak |

## Style Guidelines

### Music Style
- **Chiptune/8-bit**: For authentic retro FF feel
- **Orchestral**: For epic boss battles
- **Hybrid**: Modern production with retro elements
- **Reference**: Final Fantasy I-VI soundtracks

### Sound Effect Style
- 8-bit/16-bit synthesized sounds
- Classic RPG menu sounds
- Satisfying feedback for user actions
- Not too loud or jarring

## Audio Sources

### Free Music Resources
- [OpenGameArt.org](https://opengameart.org/) - Free game music
- [FreeMusicArchive](https://freemusicarchive.org/) - CC licensed music
- [Incompetech](https://incompetech.com/) - Royalty-free music
- [Chiptone](https://sfbgames.itch.io/chiptone) - Chiptune generator

### Sound Effect Resources
- [Freesound.org](https://freesound.org/) - Free sound effects
- [BFXR](https://www.bfxr.net/) - 8-bit sound generator
- [SFXR](https://sfxr.me/) - Retro sound generator
- [ZapSplat](https://www.zapsplat.com/) - Free sound effects

### Music Creation Tools
- **LMMS** (Free) - Digital audio workstation
- **FamiTracker** (Free) - NES-style chiptune
- **BeepBox** (Free) - Online chiptune maker
- **FL Studio** - Professional DAW

## Implementation Notes

### Volume Levels
- Background music: 30-50% volume
- Sound effects: 70-100% volume
- Voice: 100% volume
- Allow user volume controls

### Audio Loading
```javascript
// Preload critical sounds
const sounds = {
    menuSelect: new Audio('audio/menu-select.mp3'),
    confirm: new Audio('audio/menu-confirm.mp3'),
    levelUp: new Audio('audio/level-up.mp3')
};

// Play sound
function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play();
    }
}
```

### Background Music Looping
```javascript
const bgm = new Audio('audio/world-map.mp3');
bgm.loop = true;
bgm.volume = 0.4;
bgm.play();
```

## Placeholder Behavior

If audio files are missing:
1. Course runs silently
2. No errors thrown
3. Visual feedback still works
4. Console logs missing audio files
