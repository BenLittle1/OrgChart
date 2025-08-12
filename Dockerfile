# Simplified Docker build for Railway deployment
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Set environment variables for optimization
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy all files first
COPY . .

# Install all dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts --no-fund --no-audit

# Debug: List directory structure
RUN echo "=== Directory structure ===" && \
    ls -la && \
    echo "=== Source directory ===" && \
    ls -la src/ && \
    echo "=== tsconfig.json content ===" && \
    cat tsconfig.json

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NEXT_TELEMETRY_DISABLED=1

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=base /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]