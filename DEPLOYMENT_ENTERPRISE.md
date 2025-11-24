# Enterprise CI/CD Deployment Guide

Complete guide for deploying Music Learning Platform using Docker, Jenkins, Nexus, and SonarQube.

## Architecture Overview

```
GitHub → Jenkins → SonarQube → Docker Build → Nexus → Deploy
```

## Prerequisites

### 1. Jenkins Setup
```bash
# Required Jenkins Plugins
- Docker Pipeline
- SonarQube Scanner
- NodeJS Plugin
- Pipeline
- Git Plugin
- Credentials Binding
- Email Extension
```

### 2. Configure Jenkins Credentials

Add these credentials in Jenkins (Manage Jenkins → Credentials):

| Credential ID | Type | Description |
|--------------|------|-------------|
| `nexus-credentials` | Username/Password | Nexus artifact repository access |
| `nexus-docker-credentials` | Username/Password | Nexus Docker registry access |
| `sonarqube-token` | Secret text | SonarQube authentication token |
| `github-credentials` | Username/Password or SSH | GitHub repository access |

### 3. Jenkins Global Tool Configuration

Navigate to Manage Jenkins → Global Tool Configuration:

**NodeJS:**
- Name: `NodeJS-18`
- Version: NodeJS 18.x
- Global npm packages: `npm@latest`

**SonarQube Scanner:**
- Name: `SonarQubeScanner`
- Install automatically
- Version: Latest

### 4. Configure SonarQube in Jenkins

Manage Jenkins → Configure System → SonarQube servers:
- Name: `SonarQube`
- Server URL: `http://your-sonarqube-server:9000`
- Server authentication token: Select `sonarqube-token` credential

## Nexus Configuration

### 1. Create Docker Registry

In Nexus:
1. Go to Repository → Repositories → Create repository
2. Select `docker (hosted)`
3. Name: `docker-hosted`
4. HTTP port: `8083`
5. Enable Docker V1 API: ✓
6. Deployment policy: Allow redeploy

### 2. Create Raw Repository (for artifacts)

1. Create repository → `raw (hosted)`
2. Name: `raw-repo`
3. Deployment policy: Allow redeploy

### 3. Configure Docker Daemon

On Jenkins agent machines:

```bash
# Add insecure registry (if not using HTTPS)
sudo nano /etc/docker/daemon.json
```

```json
{
  "insecure-registries": ["your-nexus-server:8083"]
}
```

```bash
sudo systemctl restart docker
```

## SonarQube Setup

### 1. Create Project
1. Login to SonarQube
2. Create new project
3. Project key: `music-learning-platform`
4. Generate token and save it

### 2. Quality Gates
Navigate to Quality Gates and set thresholds:
- Code Coverage: > 80%
- Duplicated Lines: < 3%
- Maintainability Rating: A
- Reliability Rating: A
- Security Rating: A

## Jenkins Pipeline Setup

### 1. Create New Pipeline Job

1. New Item → Pipeline
2. Name: `music-learning-platform-pipeline`
3. Pipeline definition: Pipeline script from SCM
4. SCM: Git
5. Repository URL: Your GitHub repo
6. Credentials: Select github-credentials
7. Branch: `*/main` and `*/develop`
8. Script Path: `Jenkinsfile`

### 2. Environment Variables

Add these environment variables in Jenkins job configuration:

```properties
VITE_SUPABASE_URL=https://jzdolobncemqdqazgwoq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=jzdolobncemqdqazgwoq
```

### 3. Configure Webhooks

In GitHub repository:
1. Settings → Webhooks → Add webhook
2. Payload URL: `http://jenkins-server/github-webhook/`
3. Content type: `application/json`
4. Events: Push events, Pull request events

## Deployment Steps

### Local Testing

```bash
# Build Docker image locally
docker build -t music-learning-platform:test .

# Run container
docker run -d \
  -p 8080:80 \
  --name music-test \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your_key \
  music-learning-platform:test

# Test application
curl http://localhost:8080

# View logs
docker logs music-test

# Stop and remove
docker stop music-test && docker rm music-test
```

### Production Deployment with Docker Compose

```bash
# Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=https://jzdolobncemqdqazgwoq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
VITE_SUPABASE_PROJECT_ID=jzdolobncemqdqazgwoq
EOF

# Deploy
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Scale (if needed)
docker-compose up -d --scale music-learning-app=3
```

### Manual Deployment from Nexus

```bash
# Login to Nexus Docker registry
docker login your-nexus-server:8083

# Pull image
docker pull your-nexus-server:8083/music-learning-platform:latest

# Run
docker run -d \
  --name music-learning-prod \
  -p 80:80 \
  --restart unless-stopped \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your_key \
  your-nexus-server:8083/music-learning-platform:latest
```

## CI/CD Pipeline Flow

### 1. Developer Workflow

```bash
# Feature development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request → triggers Jenkins pipeline for testing

# Merge to develop → deploys to staging
git checkout develop
git merge feature/new-feature
git push origin develop

# Release to production
git checkout main
git merge develop
git push origin main
```

### 2. Pipeline Stages Explained

**Stage 1: Checkout**
- Pulls code from GitHub
- Gets short commit hash for tagging

**Stage 2: Install Dependencies**
- Runs `npm ci` for clean install
- Uses package-lock.json for reproducible builds

**Stage 3: Code Quality - Lint**
- Runs ESLint checks
- Non-blocking (continues on warnings)

**Stage 4: SonarQube Analysis**
- Static code analysis
- Security vulnerability scanning
- Code smell detection
- Technical debt calculation

**Stage 5: Quality Gate**
- Waits for SonarQube processing
- Aborts if quality standards not met
- Timeout: 5 minutes

**Stage 6: Build Application**
- Creates production build
- Injects environment variables
- Generates optimized bundle

**Stage 7: Build Docker Image**
- Multi-stage Docker build
- Creates tagged image
- Creates latest tag

**Stage 8: Security Scan - Trivy**
- Scans Docker image for vulnerabilities
- Checks HIGH and CRITICAL severities
- Non-blocking scan

**Stage 9: Push to Nexus Registry**
- Pushes tagged image
- Pushes latest image
- Stores in artifact repository

**Stage 10: Archive Artifacts**
- Creates tarball of dist folder
- Uploads to Nexus raw repository
- Version-tagged artifacts

**Stage 11: Deploy to Staging** (develop branch)
- Stops existing container
- Pulls new image from Nexus
- Starts new container on port 8081
- Auto-restart enabled

**Stage 12: Deploy to Production** (main branch)
- Requires manual approval
- Stops existing production container
- Deploys to port 80
- Zero-downtime deployment

## Monitoring & Maintenance

### Health Checks

```bash
# Check container health
docker ps
docker inspect music-learning-prod | grep Health

# Application health
curl http://localhost/

# Nginx status
docker exec music-learning-prod nginx -t
```

### Log Management

```bash
# View live logs
docker logs -f music-learning-prod

# Save logs to file
docker logs music-learning-prod > app.log

# Rotate logs
docker logs --since 1h music-learning-prod
```

### Backup & Rollback

```bash
# List available versions in Nexus
curl -u admin:admin123 http://nexus-server:8081/service/rest/v1/search?repository=docker-hosted&name=music-learning-platform

# Rollback to specific version
docker pull your-nexus-server:8083/music-learning-platform:42
docker stop music-learning-prod
docker rm music-learning-prod
docker run -d --name music-learning-prod -p 80:80 your-nexus-server:8083/music-learning-platform:42
```

### Update Supabase Configuration

After deployment, update Supabase URLs:
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add production URL to redirect URLs
4. Update site URL

## Troubleshooting

### Build Failures

**Issue:** npm install fails
```bash
# Clear Jenkins workspace
# In Jenkins job → "Wipe out workspace"
# Or manually:
rm -rf node_modules package-lock.json
npm cache clean --force
```

**Issue:** Docker build fails
```bash
# Check Dockerfile syntax
docker build --no-cache -t test .

# Check disk space
df -h
docker system prune -a
```

### SonarQube Issues

**Issue:** Quality gate fails
- Review SonarQube dashboard
- Check code coverage reports
- Fix identified code smells
- Review security hotspots

### Deployment Issues

**Issue:** Container won't start
```bash
# Check logs
docker logs music-learning-prod

# Inspect container
docker inspect music-learning-prod

# Check environment variables
docker exec music-learning-prod env
```

**Issue:** Application not accessible
```bash
# Check port bindings
docker port music-learning-prod

# Check nginx configuration
docker exec music-learning-prod cat /etc/nginx/conf.d/default.conf

# Test nginx config
docker exec music-learning-prod nginx -t
```

### Network Issues

```bash
# Check container network
docker network inspect bridge

# Check connectivity
docker exec music-learning-prod ping -c 3 google.com

# Check DNS resolution
docker exec music-learning-prod nslookup jzdolobncemqdqazgwoq.supabase.co
```

## Security Best Practices

1. **Never commit sensitive data**
   - Use Jenkins credentials
   - Environment variables only
   - No hardcoded secrets

2. **Regular security scans**
   - Trivy for container images
   - SonarQube for code
   - Dependency audits: `npm audit`

3. **Image management**
   - Use specific versions, not `latest` in production
   - Regular base image updates
   - Minimal image sizes

4. **Network security**
   - Use HTTPS for Nexus
   - Firewall rules
   - Private Docker networks

## Performance Optimization

### Nginx Tuning

```nginx
# Edit nginx.conf for better performance
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
client_max_body_size 10M;
```

### Docker Resource Limits

```bash
docker run -d \
  --name music-learning-prod \
  --memory="512m" \
  --cpus="1.0" \
  -p 80:80 \
  music-learning-platform:latest
```

## Scaling Strategies

### Horizontal Scaling

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: music-learning-platform:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Load Balancer Setup

```nginx
# nginx-lb.conf
upstream app_backend {
    least_conn;
    server app1:80;
    server app2:80;
    server app3:80;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_backend;
    }
}
```

## Checklist

- [ ] Jenkins configured with all required plugins
- [ ] Nexus Docker registry running on port 8083
- [ ] SonarQube server accessible
- [ ] All credentials added to Jenkins
- [ ] GitHub webhook configured
- [ ] Environment variables set
- [ ] Docker daemon configured for insecure registry
- [ ] Quality gates configured in SonarQube
- [ ] Supabase redirect URLs updated
- [ ] Email notifications configured
- [ ] Backup strategy in place
- [ ] Monitoring setup complete

## Support & Resources

- Jenkins Documentation: https://www.jenkins.io/doc/
- Docker Documentation: https://docs.docker.com/
- Nexus Documentation: https://help.sonatype.com/
- SonarQube Documentation: https://docs.sonarqube.org/
