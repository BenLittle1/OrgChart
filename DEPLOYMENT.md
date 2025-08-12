# OrgGraph Deployment Guide

## Railway Deployment

This application is optimized for deployment on Railway using Docker containers.

### Quick Deploy

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will automatically detect the `railway.json` configuration

2. **Environment Variables**:
   Railway will automatically configure the following variables:
   - `NODE_ENV=production`
   - `NEXT_TELEMETRY_DISABLED=1`
   - `NODE_OPTIONS=--max-old-space-size=1024`
   - `NEXT_PUBLIC_APP_URL` (automatically set to your Railway domain)

3. **Deploy**:
   - Push to your main branch
   - Railway will automatically build and deploy using the multi-stage Dockerfile

### Docker Build Process

The deployment uses a 4-stage Docker build:

1. **Base**: Node.js 18 Alpine with system dependencies
2. **Dependencies**: Installs production npm dependencies
3. **Builder**: Builds the Next.js application
4. **Runner**: Production runtime with non-root user (nextjs:1001)

### Key Features

- **Multi-stage build** for optimal image size and security
- **Non-root user** (nextjs:1001) for security hardening
- **Memory optimization** (1GB limit) for Railway constraints
- **Health checks** on root endpoint with 300s timeout
- **Automatic restart** on failure (max 3 retries)
- **Security headers** and CSP policies
- **Build caching** for faster deployments

### Performance Optimizations

- **Standalone output** for minimal container size
- **Package import optimization** for D3.js
- **Image optimization** with WebP/AVIF support
- **Build cache cleaning** to reduce memory usage
- **Layer caching** for faster rebuilds

### Resource Requirements

- **Memory**: 1GB (configured with NODE_OPTIONS)
- **Storage**: ~200MB for built application
- **Build time**: 3-5 minutes on Railway
- **Cold start**: <2 seconds

### Health Monitoring

- **Health check**: GET / (every 30s)
- **Timeout**: 300 seconds
- **Restart policy**: ON_FAILURE (max 3 retries)
- **Logs**: Available in Railway dashboard

### Custom Domain Setup

1. Go to Railway project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificates are automatically managed

### Troubleshooting

**Build failures**:
- Check Railway logs for specific error messages
- Verify all dependencies are in package.json
- Ensure Dockerfile syntax is correct

**Memory issues**:
- Memory limit is set to 1GB via NODE_OPTIONS
- Check for memory leaks in application code
- Monitor Railway metrics dashboard

**Performance issues**:
- Check Railway metrics for resource usage
- Optimize images and assets
- Review D3.js performance in graph view

### Local Docker Testing

```bash
# Build the Docker image
docker build -t orgraph .

# Run the container
docker run -p 3000:3000 orgraph

# Test the application
curl http://localhost:3000
```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node.js environment | `production` |
| `NODE_OPTIONS` | Node.js memory settings | `--max-old-space-size=1024` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |
| `NEXT_PUBLIC_APP_URL` | Public application URL | Railway domain |

### Security Features

- **Non-root container user** (uid/gid 1001)
- **Minimal Alpine Linux base** with security updates
- **Content Security Policy** headers
- **XSS protection** headers
- **Clickjacking protection** (X-Frame-Options)
- **MIME sniffing protection**