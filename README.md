# Jelly Learning Arcade

A bright, colorful educational game hub for children ages 5-9. Features 10 engaging games across multiple learning disciplines including math, words, logic, science, art, music, and more.

## Features

- **Age-based filtering**: Filter games by age range (5-9 years)
- **Subject categories**: Math, Words, Logic, Science, Art, Music, Brain Games, and Exploration
- **Search functionality**: Find games by name or description
- **Responsive design**: Works beautifully on desktop, tablet, and mobile
- **Smooth animations**: Built with Framer Motion for delightful interactions
- **Accessible**: ARIA labels and keyboard navigation support

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cifix-games
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deploying to Railway

Railway is a modern platform that makes deploying web apps incredibly simple.

### Method 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect the configuration and deploy

3. **Configuration** (automatic):
   - Railway will use the `railway.json` and `nixpacks.toml` files
   - The build and start commands are pre-configured
   - No manual environment variables needed for basic deployment

### Method 2: Deploy via Railway CLI

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize and deploy**:
```bash
railway init
railway up
```

4. **Add a domain**:
```bash
railway domain
```

### Environment Variables

This project doesn't require environment variables for basic functionality. If you add features that need them (API keys, etc.), add them in:

- Railway Dashboard → Your Project → Variables

### Custom Domain

To add a custom domain on Railway:

1. Go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

## Project Structure

```
cifix-games/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   └── GameHub.jsx  # Main game hub component
│   ├── App.jsx          # Root application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles and Tailwind imports
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── railway.json         # Railway deployment config
├── nixpacks.toml        # Nixpacks build configuration
└── README.md            # This file
```

## Customization

### Adding New Games

Edit `src/components/GameHub.jsx` and add to the `GAMES` array:

```javascript
{
  id: "your-game-id",
  title: "Your Game Title",
  discipline: "math", // or words, logic, science, art, music, brain, explore
  minAge: 5,
  maxAge: 9,
  icon: YourIcon, // Import from lucide-react
  description: "Your game description"
}
```

### Handling Game Clicks

The `GameHub` component accepts two props:

- `onOpenGame`: Callback function when a game is clicked
- `routes`: Object mapping game IDs to URLs

Example in `src/App.jsx`:

```javascript
<GameHub
  onOpenGame={(gameId) => console.log(gameId)}
  routes={{
    'number-garden': '/games/number-garden',
    'shape-safari': '/games/shape-safari'
  }}
/>
```

## Development Notes

- The project uses ESLint for code quality (can be added)
- Tailwind's JIT mode is enabled for optimal CSS bundle size
- Framer Motion animations are optimized for performance
- All components use semantic HTML and ARIA labels

## License

MIT License - feel free to use this project for your own educational purposes.

## Support

For issues or questions, please open an issue on GitHub.