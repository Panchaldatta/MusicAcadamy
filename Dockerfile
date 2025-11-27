### ----------------------------
### 1) Build Stage (Node)
### ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Ensure devDependencies (Vite) get installed
ENV NODE_ENV=development

COPY package*.json ./

RUN npm config set fund false \
    && npm config set audit false \
    && npm install --legacy-peer-deps

COPY . .

RUN npm run build


### ----------------------------
### 2) Production Stage (NGINX)
### ----------------------------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
