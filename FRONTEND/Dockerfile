# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Set npm registry and install dependencies
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# Copy source code
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_API_URL=http://localhost:8000

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]