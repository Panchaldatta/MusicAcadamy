##############################################
# 1) Build Stage (Vite + Node)
##############################################
FROM node:20-alpine AS builder

WORKDIR /app

# Fix npm registry issues inside Jenkins Kubernetes pods
RUN npm config set registry http://registry.npmjs.org/ \
    && npm config set strict-ssl false

# Build args from Jenkins
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx vite build


##############################################
# 2) Production Stage (Nginx)
##############################################
FROM nginx:alpine

# Use default Nginx config (works for Vite SPA)
RUN rm /etc/nginx/conf.d/default.conf

# Put a minimal SPA config
RUN printf "server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD [\"nginx\", \"-g\", \"daemon off;\"]

