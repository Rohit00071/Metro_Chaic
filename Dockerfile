# Start from Node.js 20 Alpine
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy root package.json if you have one (optional, helps with monorepos)
# We will copy the specific packages we need
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy the shared directory since the backend depends on it
COPY shared ./shared

# Copy the actual backend source code
COPY backend ./backend

# Build the TypeScript code
RUN cd backend && npm run build

# Expose the port Koyeb will use
EXPOSE 3001

# Start the application
CMD ["npm", "start", "--prefix", "backend"]
