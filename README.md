# 🔨 Whack-a-Mole Game

A modern, feature-rich Whack-a-Mole game built with React, TypeScript, Redux, and Tailwind CSS for the Gaming1 web development challenge.

## 🎮 Features

### Core Gameplay
- **3x4 Grid Layout**: 12 mole holes arranged in a classic grid
- **2-minute Timer**: Fast-paced gameplay with countdown
- **Random Mole Spawning**: Unpredictable mole appearances using RNG
- **Click/Tap Controls**: Responsive input for all devices
- **Proper Game Flow**: Countdown sequence before game starts, preventing premature mole spawning

### Advanced Features
- **🔥 Combo System**: Build combos for bonus points (up to 5x multiplier)
- **🔊 Sound Effects**: Dynamic audio feedback using Web Audio API with toggle control
- **✨ Visual Effects**: Animated score popups and visual feedback
- **🏆 Leaderboard**: Top 10 players with persistent storage and automatic score saving
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Built with shadcn/ui components for accessibility and consistency
- **🔔 Toast Notifications**: Sonner-based toast system for user feedback
- **🎯 Custom Favicon**: Themed SVG favicon for brand recognition

### Scoring System
- **Base Points**: 100 points per successful hit
- **Combo Multipliers**:
  - 2x Combo: 200 points
  - 3x Combo: 300 points
  - 4x Combo: 400 points
  - 5x+ Combo: 500 points

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: shadcn/ui (Button, modern accessible components)
- **Styling**: Tailwind CSS with custom animations and theming
- **Package Manager**: pnpm
- **Testing**: Jest + React Testing Library
- **Audio**: Web Audio API (no external files)
- **Storage**: LocalStorage for leaderboard persistence
- **Notifications**: Sonner for toast notifications
- **Icons**: Lucide React icons
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- pnpm 8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whack-a-mole-game
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run test suite
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Run ESLint for code quality
- `pnpm format` - Format code with Prettier

## 🎯 How to Play

1. **Enter Your Name**: Type your name in the input field
2. **Start Game**: Click "Start Game" to begin the countdown sequence
3. **Get Ready**: Watch the 3-2-1 countdown before moles start appearing
4. **Whack Moles**: Click on moles when they pop up from holes
5. **Build Combos**: Hit moles consecutively to build combo multipliers (up to 5x)
6. **Beat the Clock**: Score as many points as possible in 2 minutes
7. **Auto-Save**: Your score is automatically saved to the leaderboard
8. **Play Again**: Click "Play Again" to restart with proper countdown flow
9. **Toggle Sound**: Use the sound button to enable/disable audio effects

## 🏗 Architecture

### Project Structure
```
src/
├── views/               # View components organized by feature
│   ├── main/           # Main menu and landing page
│   │   ├── MainView.tsx # Main menu view
│   │   └── components/ # Main view components
│   │       ├── Footer.tsx
│   │       ├── GameFeatures.tsx
│   │       ├── GameInstructions.tsx
│   │       ├── Leaderboard.tsx # Top 10 players display
│   │       ├── ReadyToPlay.tsx
│   │       └── index.ts
│   └── game/           # Game view and components
│       ├── GameView.tsx # Main game view
│       └── components/ # Game-specific components
│           ├── CountdownBar.tsx
│           ├── CountdownOverlay.tsx
│           ├── GameGrid.tsx # 3x4 mole grid
│           ├── GameOverOverlay.tsx
│           ├── MoleHole.tsx # Individual mole hole
│           ├── ScoreDisplay.tsx # Score and timer
│           ├── Timer.tsx
│           └── index.ts
├── components/          # Shared UI components
│   └── ui/             # shadcn/ui components
│       ├── button.tsx
│       └── ...
├── store/              # Redux state management
│   ├── gameSlice.ts    # Game state and logic
│   ├── leaderboardSlice.ts # Leaderboard state
│   ├── types.ts        # Store-related TypeScript interfaces
│   └── index.ts        # Store configuration
├── services/           # Business logic services
│   ├── gameService.ts  # Game timer and mole spawning
│   ├── dataService.ts  # Leaderboard persistence
│   ├── soundService.ts # Audio effects
│   └── index.ts        # Service exports
├── hooks/              # Custom React hooks
│   └── useAppDispatch.ts # Typed Redux hooks
├── lib/                # Library utilities
│   └── utils.ts        # Utility functions
├── types/              # Global TypeScript definitions
│   └── images.d.ts     # Image type declarations
├── assets/             # Static assets
│   ├── images/         # Image assets
│   └── sounds/         # Sound assets
├── App.tsx             # Main application component
├── index.css           # Global styles
├── index.tsx           # Entry point
└── reportWebVitals.ts  # Web Vitals reporting
```

### Key Design Decisions

1. **Redux Toolkit**: Chosen for predictable state management and excellent TypeScript support
2. **Tailwind CSS**: Utility-first approach for rapid UI development and consistent design
3. **shadcn/ui**: Modern, accessible UI components with TypeScript support (using recommended components)
4. **Web Audio API**: Programmatic sound generation eliminates need for audio files
5. **Component Architecture**: Separation of concerns with reusable, testable components
6. **Service Layer**: Business logic separated from UI components for better maintainability
7. **Sonner Toasts**: Using recommended toast solution instead of deprecated Radix-based toasts
8. **Automatic Score Saving**: Seamless leaderboard integration without manual submission
9. **Proper Game Flow**: Countdown system ensures consistent game start experience

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Redux slices, services, and utility functions
- **Integration Tests**: Component interactions and state management
- **Component Tests**: UI rendering and user interactions

Run tests:
```bash
pnpm test
```

## 🎨 Styling & Animations

### Custom Tailwind Configuration
- **Custom Colors**: Game-specific color palette
- **Gradients**: Beautiful background gradients for different sections
- **Animations**: Mole popup, hammer swing, combo effects, and more

### Responsive Design
- **Mobile-first**: Optimized for touch devices
- **Breakpoints**: Adapts to different screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🔊 Sound System

The game features a sophisticated sound system:

- **Dynamic Generation**: All sounds created using Web Audio API
- **Sound Effects**:
  - Whack sounds for successful hits
  - Miss sounds for failed attempts
  - Combo sounds for streak bonuses
  - Game start/end audio cues
  - Timer tick for final countdown
- **User Control**: Toggle sound on/off with persistent preference
- **Browser Compatibility**: Handles autoplay policies gracefully
- **Performance**: Efficient audio context management with proper cleanup

## 📊 Performance

### Optimizations
- **Efficient Rendering**: Minimal re-renders with proper React patterns
- **Memory Management**: Proper cleanup of timers and event listeners
- **Bundle Size**: Optimized dependencies and code splitting
- **Web Vitals**: Excellent Core Web Vitals scores

## 🚀 Deployment

Build for production:
```bash
pnpm build
```

The `build` folder contains optimized static files ready for deployment to any static hosting service.

## 🎯 Gaming1 Challenge Requirements

✅ **All requirements met**:
- React with TypeScript ✅
- Redux for state management ✅
- 3x4 mole grid layout ✅
- RNG-based mole activation ✅
- Scoring system with combo multipliers ✅
- 2-minute game timer ✅
- Top 10 leaderboard with automatic saving ✅
- Real-time score updates ✅
- Unit/integration testing ✅
- Clean, maintainable code ✅
- Public git repository ✅

## 🚀 Future Enhancements

- **Power-ups**: Special moles with bonus effects
- **Difficulty Levels**: Adjustable game speed and mole spawn rates
- **Achievements**: Unlock system for reaching milestones
- **Multiplayer**: Real-time competitive gameplay
- **Analytics**: Detailed gameplay statistics and progress tracking

✨ **Bonus features for extra polish**:
- Advanced combo system
- Dynamic sound effects
- Animated visual feedback
- Responsive design
- Accessibility features
- Comprehensive test coverage

## 👨‍💻 Development

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting for consistency
- **Prettier**: Code formatting (configured in package.json)
- **Testing**: Jest and React Testing Library for comprehensive coverage

### Git Workflow
- Meaningful commit messages
- Feature-based branching
- Regular commits showing development progress

## 🤝 Contributing

This project was built for the Gaming1 web development challenge. The codebase demonstrates modern React development practices and is ready for code review.

## 📄 License

This project is created for the Gaming1 hiring challenge.

---

**Built with ❤️ for Gaming1 Challenge • Maxime Musin**  
*React • TypeScript • Redux • Tailwind CSS • shadcn/ui • pnpm*
