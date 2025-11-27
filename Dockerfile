###############################
# 1) Builder Stage (Node)
###############################
FROM node:20-alpine AS builder

# Increase memory for npm
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# ---- Copy pkg files first ----
COPY package*.json ./

# ---- FIX: Stable install ----
RUN npm config set fund false \
    && npm config set audit false \
    && npm config set fetch-retry-maxtimeout 300000 \
    && npm config set maxsockets 1 \
    && npm install --legacy-peer-deps

# ---- Copy rest of app ----
COPY . .

# ---- FIX: Ensure vite PATH exists ----
RUN npx vite --version

# ---- Build App ----
RUN npm run build



###############################
# 2) Nginx Stage
###############################
FROM nginx:alpine

# Replace default config
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built dist folder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
