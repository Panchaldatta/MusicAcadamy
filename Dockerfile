# ---------- 1) Builder Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies including dev
RUN npm install

# Copy full project
COPY . .

# Build the Vite app
RUN npm run build

# ---------- 2) Production Stage ----------
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
