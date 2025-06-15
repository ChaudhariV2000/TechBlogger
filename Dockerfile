# Use Node.js 16 as the base image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy package files first (optimizes caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port 5000 (same as your Express app)
EXPOSE 5000

# Command to start the app
CMD ["npm", "start"]