###############################
# 1) Builder Stage (Node + Vite)
###############################
FROM node:20-alpine AS builder

# Create app folder
WORKDIR /app

# Install dependencies FIRST (better caching)
COPY package*.json ./

RUN npm install

# Copy the rest of the project
COPY . .

# Build Vite production bundle
RUN npm run build


###############################
# 2) Nginx Production Stage
###############################
FROM nginx:alpine

# Remove default config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom optimized nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage → Nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
