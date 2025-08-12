# Multi-stage build for Railway deployment optimization
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Set environment variables for optimization
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Install dependencies in a separate stage to leverage Docker layer caching
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) for build stage
RUN npm ci --ignore-scripts --no-fund --no-audit && \
    npm cache clean --force

# Production dependencies stage
FROM base AS prod-deps
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts --no-fund --no-audit && \
    npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json files
COPY package.json package-lock.json* ./

# Copy configuration files
COPY next.config.js ./
COPY tsconfig.json ./
COPY next-env.d.ts ./
COPY tailwind.config.js ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./

# Copy source code
COPY src ./src
COPY public ./public

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]