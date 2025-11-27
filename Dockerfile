##############################################
# 1) Build Stage (Node + Vite)
##############################################
FROM node:20-alpine AS builder

WORKDIR /app

# Required for devDependencies (Vite, vitest, TS)
ENV NODE_ENV=development

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy full project
COPY . .

# Build frontend bundle
RUN npx vite build


##############################################
# 2) Production Stage (Nginx)
##############################################
FROM nginx:alpine

# Replace NGINX config for Vite SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
