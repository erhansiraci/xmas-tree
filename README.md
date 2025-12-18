# Xmas Tree - Interactive Desktop Widget

A fun, interactive Christmas tree desktop widget for Windows and macOS.

## Zero Human Code

This entire widget was developed using **zero human-written code** - created purely through AI prompts with Claude Code. In just tens of prompts, we built a fully functional desktop application with:

- Animated Christmas tree with PNG assets
- Interactive ornament placement (click to add)
- Tinsel garlands with animated sparkles
- Falling snow effect
- Twinkling lights
- Multiple ornament types (balls, bells, pinecones)
- Delete and randomize functionality

This project demonstrates what's possible when you let AI handle the coding while you focus on the creative direction.

## Features

- Transparent, frameless window that floats on your desktop
- Responsive design (1/4 screen size, bottom-right corner)
- 6 different ornament types to decorate your tree
- Snow and lights can be toggled on/off
- Click-to-place ornaments anywhere on the tree
- Works on macOS and Windows

## Installation

### macOS
Download the `.dmg` file from [Releases](../../releases), open it, and drag the app to your Applications folder.

### Windows
Download the `.exe` installer or portable version from [Releases](../../releases).

## Building from Source

### Prerequisites
- Node.js (v18 or later)
- npm

### Install Dependencies
```bash
npm install
```

### Run in Development
```bash
npm start
```

### Build for Distribution

**macOS:**
```bash
npm run build:mac
```

**Windows:**
```bash
npm run build:win
```

Built packages will be in the `dist/` folder.

## Internal Distribution

Feel free to distribute this widget internally within your organization. It's open source and meant for holiday fun!

## License

MIT License - Use it, modify it, share the holiday spirit!

---

*Built with Claude Code - proving that sometimes the best code is the code you don't write yourself.*
