# 1. Use official Node.js image (choose version as needed)
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first for better caching
COPY package*.json ./

# 4. Install dependencies (use ci for clean installs)
RUN npm ci --only=production

# 5. Copy the rest of your code
COPY . .

# 6. Expose app port (adjust if your app uses another)
EXPOSE 3000

# 7. Define default start command
CMD ["npm", "start"]
