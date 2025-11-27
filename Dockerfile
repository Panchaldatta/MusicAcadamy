# ---------- 1) Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only dependency files first (for better cache)
COPY package*.json ./

# Install all dependencies (prod + dev so Vite exists)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Vite React app
RUN npm run build

# ---------- 2) Production (Nginx) stage ----------
FROM nginx:alpine

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Optional healthcheck (K8s has probes, so this is not required)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
