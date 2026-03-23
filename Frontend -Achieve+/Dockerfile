FROM node:22-alpine

WORKDIR /app

# Install native dependencies and bash for potentially running helper scripts
RUN apk add --no-cache python3 make g++ tzdata bash

# Copy basic package dependencies
COPY package.json package-lock.json* ./

# Clean block install to avoid binary lock conflicts from other architectures (like windows native)
RUN npm ci

# Copy the rest of the frontend source
COPY . .

# Expose development port
EXPOSE 4200

# Start server watching on 0.0.0.0 and with file polling enabled 
# since standard watcher fails across volumes in many OSs
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
