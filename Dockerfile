##############################################
# 1) Build Stage (Vite + Node)
##############################################
FROM node:20-alpine AS builder

WORKDIR /app

# Fix npm registry issues inside Jenkins Kubernetes pods
# Note: It's better to configure the proxy in the host/Jenkins agent if possible, 
# but this setup works for self-contained builds.
RUN npm config set registry http://registry.npmjs.org/ \
    && npm config set strict-ssl false

# Build args from Jenkins
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./
# Use --force or similar flag if necessary due to peer dependency issues, 
# or clean up package.json. --legacy-peer-deps is a good mitigation.
RUN npm install --legacy-peer-deps

COPY . .
RUN npx vite build


##############################################
# 2) Production Stage (Nginx)
##############################################
FROM nginx:alpine

# 1 & 2. MERGED RUN INSTRUCTION for better efficiency and fewer layers.
# This removes the default NGINX config and replaces it with a simple SPA config.
RUN rm /etc/nginx/conf.d/default.conf \
    && printf "server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

# 3. Copy the built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 4. The critical fix for the CrashLoopBackOff.
# This runs NGINX in the foreground, preventing Exit Code 127/command not found.
CMD ["nginx", "-g", "daemon off;"]