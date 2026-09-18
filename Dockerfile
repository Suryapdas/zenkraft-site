# --- Base Setup Stage ---
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
# Copy root package configurations
COPY package*.json ./
COPY prisma ./prisma/

# Copy workspace internal packages and apps configurations
COPY packages/config/package*.json ./packages/config/
COPY packages/validation/package*.json ./packages/validation/
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# Install all dependencies across the monorepo workspace
RUN npm ci

# --- Build Stage ---
FROM base AS builder
WORKDIR /app
# Copy the entire codebase into the container
COPY . .

# Generate Prisma Client structure
RUN npx prisma generate --schema=prisma/schema.prisma

# Build the entire workspace sequentially (config -> validation -> api -> web)
RUN npm run build

# --- Production Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Copy configurations, dependencies, and built packages from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/prisma ./prisma
# 👇 ADD THIS LINE TO COPY THE CORE YAML CONFIGURATIONS
COPY --from=builder /app/config ./config 

# Install concurrently globally in the container to boot both apps at once
RUN npm install -g concurrently

# Open the internal communication ports
EXPOSE 3000
EXPOSE 4000

# Fire up both the Express server and Next.js production server together
CMD ["concurrently", "-n", "api,web", "-c", "blue,magenta", "\"npm run start --workspace=apps/api\"", "\"npm run start --workspace=apps/web\""]

