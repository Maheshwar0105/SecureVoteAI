# Use official lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy backend source files
COPY backend/ ./

# Expose backend port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "start"]
