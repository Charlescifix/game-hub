# Railway Deployment Guide

## Quick Start

### Option 1: Deploy from GitHub (Recommended)

1. **Initialize Git and push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit: Jelly Learning Arcade"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Railway**:
   - Visit [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select the `cifix-games` repository
   - Railway will automatically:
     - Detect the Node.js environment
     - Install dependencies
     - Build the project
     - Start the preview server

3. **Get your URL**:
   - Railway will provide a `.railway.app` domain
   - Click "Generate Domain" in the settings
   - Your app will be live at `https://your-app.railway.app`

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login**:
```bash
railway login
```

3. **Deploy**:
```bash
railway init
railway up
```

4. **Add domain**:
```bash
railway domain
```

## Configuration Details

### Automatic Configuration

The project includes:
- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build configuration for Nixpacks
- Optimized `package.json` scripts

### Build Process

Railway will execute:
1. `npm install` - Install all dependencies
2. `npm run build` - Create production build in `/dist`
3. `npm run start` - Serve the built files

### Port Configuration

The app uses the `$PORT` environment variable provided by Railway:
- Development: `5173`
- Production: Dynamic (set by Railway)

## Troubleshooting

### Build Fails

**Problem**: Dependencies not installing
```bash
# Clear cache locally and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem**: Build succeeds locally but fails on Railway
- Check that all dependencies are in `dependencies`, not `devDependencies`
- Ensure Node version is compatible (using Node 20)

### App Not Loading

**Problem**: White screen or errors
- Check Railway logs: `railway logs`
- Verify build output exists in `/dist`
- Check browser console for errors

### Performance Issues

**Problem**: Slow loading
- Railway serves static files efficiently
- Consider adding a CDN for assets
- Enable gzip compression (already configured in Vite)

## Environment Variables

This project works without environment variables, but you can add them:

1. In Railway Dashboard:
   - Go to your project
   - Click "Variables"
   - Add key-value pairs

2. Via CLI:
```bash
railway variables set KEY=value
```

## Custom Domain

1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: Your Railway domain

## Monitoring

View logs in real-time:
```bash
railway logs
```

Check deployment status:
```bash
railway status
```

## Updates and Redeployment

### Automatic (GitHub)
- Push to `main` branch
- Railway auto-deploys new changes

### Manual (CLI)
```bash
railway up
```

## Cost

- Railway offers a free tier
- Paid plans start at $5/month
- Static sites use minimal resources

## Next Steps

After deployment:
1. Test all games and features
2. Set up custom domain (optional)
3. Add analytics (Google Analytics, Plausible, etc.)
4. Monitor performance and logs
5. Implement game functionality

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: Open an issue on GitHub
