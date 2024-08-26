# ---- Builder Stage ----
# Using Node.js 18 Alpine for a lean builder image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies for building)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
# Ensure tsconfig.json is present and correctly configured for 'outDir': './dist'
RUN npm run build

# ---- Production Stage ----
# Using Node.js 18 Alpine for a lean production image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Expose the correct port the application runs on
EXPOSE 5001

# Command to run the application
CMD [ "node", "dist/index.js" ]
