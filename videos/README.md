# Videos Folder - PCTE Training RPG

This folder contains video assets for the RPG-style training course.

## Required Videos

### Introductory Videos

| Filename | Duration | Description |
|----------|----------|-------------|
| `intro-cinematic.mp4` | 30-60s | Opening cinematic/title sequence |
| `world-intro-1.mp4` | 15-30s | Tutorial Village introduction |
| `world-intro-2.mp4` | 15-30s | Content Caverns introduction |
| `world-intro-3.mp4` | 15-30s | Package Palace introduction |
| `world-intro-4.mp4` | 15-30s | Upload Fortress introduction |
| `world-intro-5.mp4` | 15-30s | Certification Tower introduction |

### Instructional Videos

#### World 1: PCTE & CMI5 Fundamentals

| Filename | Duration | Description |
|----------|----------|-------------|
| `pcte-overview.mp4` | 3-5min | Overview of PCTE platform and capabilities |
| `cmi5-explained.mp4` | 3-5min | CMI5 specification explanation |
| `xapi-basics.mp4` | 3-5min | xAPI statements and tracking basics |

#### World 2: Content Creation

| Filename | Duration | Description |
|----------|----------|-------------|
| `video-creation-tips.mp4` | 5-7min | How to create effective training videos |
| `image-best-practices.mp4` | 3-5min | Image creation and optimization |
| `interactive-elements.mp4` | 5-7min | Building quizzes and interactive content |
| `kolb-model-explained.mp4` | 4-6min | Kolb's Learning Cycle in practice |

#### World 3: CMI5 Packaging

| Filename | Duration | Description |
|----------|----------|-------------|
| `cmi5-xml-tutorial.mp4` | 5-8min | Creating the cmi5.xml manifest file |
| `javascript-integration.mp4` | 5-8min | Implementing xAPI tracking in code |
| `packaging-walkthrough.mp4` | 4-6min | Step-by-step packaging process |

#### World 4: PCTE Upload

| Filename | Duration | Description |
|----------|----------|-------------|
| `pcte-navigation.mp4` | 3-5min | Navigating the PCTE interface |
| `upload-process.mp4` | 5-7min | Complete upload walkthrough |
| `troubleshooting-guide.mp4` | 4-6min | Common issues and solutions |

### Victory/Completion Videos

| Filename | Duration | Description |
|----------|----------|-------------|
| `boss-defeat.mp4` | 5-10s | Boss defeat animation/celebration |
| `level-up.mp4` | 3-5s | Level up celebration animation |
| `victory-ending.mp4` | 30-60s | Course completion celebration |
| `game-over.mp4` | 10-15s | Game over sequence |

## Video Specifications

### Technical Requirements

| Property | Requirement |
|----------|-------------|
| **Format** | MP4 (H.264 codec) |
| **Resolution** | 1080p (1920x1080) recommended, 720p minimum |
| **Frame Rate** | 30fps or 60fps |
| **Aspect Ratio** | 16:9 |
| **Audio Codec** | AAC, stereo |
| **Audio Bitrate** | 128-256 kbps |
| **Video Bitrate** | 2-5 Mbps for 1080p |
| **Max File Size** | 100MB per video |

### Fallback Formats (Optional)

For broader browser compatibility:
- WebM (VP9 codec)
- OGG (Theora codec)

## Video Content Guidelines

### Instructional Videos Should Include:

1. **Clear Introduction** (10-15s)
   - State the learning objective
   - Preview what will be covered

2. **Main Content** (bulk of video)
   - Screen recordings with cursor highlighting
   - Voiceover narration
   - On-screen text for key points
   - Annotations/callouts for important areas

3. **Summary** (10-15s)
   - Recap key points
   - Transition to next topic

### Style Guidelines

- **Voiceover**: Clear, professional narration
- **Pacing**: Allow time for comprehension
- **Visuals**: Zoom in on important UI elements
- **Captions**: Include closed captions for accessibility
- **Branding**: Use consistent intro/outro

### RPG-Themed Elements

For world intro and cinematic videos:
- 8-bit/16-bit style animations
- Chiptune or orchestral FF-style music
- Pixel art transitions
- Text crawls in FF dialog style

## Video Creation Tools

### Screen Recording
- **OBS Studio** (Free) - Professional screen recording
- **Camtasia** - Screen recording with editing
- **Loom** - Quick screen recordings

### Video Editing
- **DaVinci Resolve** (Free) - Professional editing
- **Adobe Premiere Pro** - Industry standard
- **Kdenlive** (Free) - Open source editor

### Animation
- **After Effects** - Motion graphics
- **Aseprite** - Pixel art animation
- **Synfig** (Free) - 2D animation

## Compression

Use HandBrake or FFmpeg to compress videos:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

## Placeholder Behavior

If videos are missing:
1. A placeholder with play button appears
2. Filename is displayed
3. Users can upload their own video file
4. Course continues to function
