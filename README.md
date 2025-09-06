# TaskFlow - Base Mini App

A beautiful task management mini-app built for Farcaster users on Base blockchain.

## Features

- **Daily/Weekly Task Overview**: Crystal-clear view of what needs doing, now and soon
- **Effortless Task Completion**: One-click task completion with visual feedback
- **Project-Task Linking**: Connect individual tasks to larger projects
- **Visual Project Status**: Dashboard showing project health and progress
- **Base Integration**: Built on Base blockchain with OnchainKit

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## Design System

- **Colors**: Purple/blue gradient theme with glass morphism
- **Layout**: Mobile-first responsive design
- **Motion**: Smooth transitions with 200ms duration
- **Components**: Modular, reusable UI components

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── lib/                # Utilities and types
└── public/             # Static assets
```

## Key Components

- **Dashboard**: Main overview with metrics and today's tasks
- **TodayView**: Focused view of today's tasks with progress tracking
- **ProjectsView**: Project management with visual progress indicators
- **TaskItem**: Individual task component with completion toggle
- **ProjectCard**: Project overview with completion statistics

## Business Model

- **Free Tier**: Basic task management
- **Micro-transactions**: Pay-per-use for advanced features
- **Premium Features**: Project linking, custom notifications, team collaboration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
