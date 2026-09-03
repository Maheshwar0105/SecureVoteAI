# Use official lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev || npm install --omit=dev

# Copy remaining code
COPY . .

# Expose backend port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Run server script
CMD ["npm", "start"]
