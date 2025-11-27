### ----------------------------
### 1) Build Stage (Node)
### ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Stable NPM install (no timeout changes)
RUN npm config set fund false \
    && npm config set audit false \
    && npm config set maxsockets 1 \
    && npm install --legacy-peer-deps

# Copy the rest
COPY . .

# Build Vite production bundle
RUN npm run build


### ----------------------------
### 2) Production Stage (NGINX)
### ----------------------------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
