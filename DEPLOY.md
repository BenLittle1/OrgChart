# OrgGraph - Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- Git repository with your OrgGraph code
- GitHub/GitLab account (optional but recommended)

### Step 1: Prepare Your Repository
1. Ensure all files are committed to your git repository
2. Push to GitHub/GitLab if using version control integration

### Step 2: Deploy to Railway

#### Option A: Deploy from GitHub (Recommended)
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your OrgGraph repository
4. Railway will automatically detect Next.js and use the `railway.json` configuration

#### Option B: Deploy with Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize and deploy
railway project new
railway up
```

### Step 3: Configure Environment Variables
1. In Railway dashboard, go to your project → Variables tab
2. Add the following variables:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_APP_URL`: Your Railway app URL (auto-populated)

### Step 4: Custom Domain (Optional)
1. Go to project → Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## 📋 Configuration Files

### `railway.json`
- Configures build and deployment settings
- Sets up health checks and environment variables
- Uses Nixpacks builder for optimal performance

### `next.config.ts`
- Optimized for Railway deployment
- Enables standalone output for better performance
- Configures image optimization and security headers

### `package.json`
- Includes all necessary build scripts
- Specifies Node.js version requirements
- Configured for Railway's build process

## 🔧 Local Testing

Test production build locally before deploying:

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to test the production build.

## 🚀 Deployment Process

Railway will automatically:
1. Install dependencies (`npm ci`)
2. Run TypeScript type checking
3. Build the Next.js application (`npm run build`)
4. Start the production server (`npm start`)

## 📊 Monitoring

### Railway Dashboard
- View deployment logs
- Monitor resource usage
- Configure scaling settings
- Set up alerts

### Health Check
- Railway automatically checks `/` endpoint
- 300-second timeout configured
- Application will restart if health check fails

## 🔒 Security Features

- Disabled `x-powered-by` header
- Compression enabled
- Image optimization configured
- Standalone output for better security

## 📱 Features Available After Deployment

- **Persistent Data**: User progress saved in browser localStorage
- **Responsive Design**: Works on all devices
- **Interactive Graph**: D3.js visualization with zoom/pan
- **Real-time Updates**: Instant synchronization between views
- **Dark Theme**: Professional UI with slate color scheme

## 🐛 Troubleshooting

### Common Issues
1. **Build Fails**: Check TypeScript errors with `npm run type-check`
2. **D3.js Issues**: Webpack fallback configured for browser compatibility
3. **Slow Loading**: Enable Railway's CDN in project settings
4. **Memory Issues**: Increase memory limit in Railway settings

### Support
- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Next.js Deployment Guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## 🎯 Performance Optimization

The application is optimized for Railway with:
- Standalone Next.js output
- Compressed assets
- Efficient D3.js bundle
- Minimal dependencies
- Fast startup time

Your OrgGraph application will be live and ready to help track organizational maturity!