##############################################
# 1) Build Stage (Vite + Node)
##############################################
FROM node:20-alpine AS builder

WORKDIR /app

# Fix npm registry issues inside Jenkins Kubernetes pods
RUN npm config set registry http://registry.npmjs.org/ \
    && npm config set strict-ssl false

# -------------------------------------------------
# IMPORTANT: Build args for Supabase secrets
# These come from Jenkins (passed via --build-arg)
# -------------------------------------------------
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Make args available inside Vite build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build frontend bundle
RUN npx vite build


##############################################
# 2) Production Stage (Nginx)
##############################################
FROM nginx:alpine

# Replace with your Vite SPA Nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
