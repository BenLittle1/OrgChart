# OrgGraph Production Dockerfile
# Multi-stage build optimized for Railway deployment

# Base stage with Node.js 18 Alpine
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies and security updates
RUN apk add --no-cache libc6-compat && \
    apk upgrade

# Environment configuration
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencies stage
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with optimizations
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# Builder stage
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Install dev dependencies for build
RUN npm ci --include=dev --ignore-scripts

# Build the application
RUN npm run build && \
    npm prune --omit=dev && \
    npm cache clean --force

# Production runner stage
FROM base AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create and set ownership of necessary directories
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Start the application
CMD ["node", "server.js"]