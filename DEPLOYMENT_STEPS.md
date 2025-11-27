# Complete Deployment Steps for Music Learning Platform

## Server Details
- **SonarQube**: http://sonarqube.imcc.com/ (student / Imccstudent@2025)
- **Nexus**: http://nexus.imcc.com/ (student / Imcc@2025)
- **Jenkins**: http://jenkins.imcc.com/ (student / Changeme@2025)

---

## Pre-Deployment Setup (One-Time)

### 1. Configure Nexus Docker Registry

1. **Login to Nexus** (http://nexus.imcc.com/)
2. **Create Docker Repository** (if not exists):
   - Go to: Settings → Repositories → Create repository → docker (hosted)
   - Name: `docker-hosted`
   - HTTP Port: `8083`
   - Enable Docker V1 API: ✓
   - Deployment policy: Allow redeploy
   - Click Create

3. **Configure Docker Daemon** (on Jenkins agents):
```json
# /etc/docker/daemon.json
{
  "insecure-registries": ["nexus.imcc.com:8083"]
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

---

### 2. Configure SonarQube

1. **Login to SonarQube** (http://sonarqube.imcc.com/)
2. **Create Project**:
   - Click "Create Project"
   - Project key: `music-learning-platform`
   - Display name: `Music Learning Platform`
   - Click "Set Up"

3. **Generate Token** (Optional - for better security):
   - Go to: My Account → Security → Generate Token
   - Name: `jenkins-music-platform`
   - Type: Project Analysis Token
   - Save the token (you'll use this instead of password)

---

### 3. Configure Jenkins

#### A. Install Required Plugins
Go to Jenkins → Manage Jenkins → Plugins → Available plugins

Install these if not already installed:
- Docker Pipeline
- Kubernetes CLI
- SonarQube Scanner
- Pipeline

#### B. Configure Jenkins Credentials

Go to Jenkins → Manage Jenkins → Credentials → System → Global credentials

**Add these credentials:**

1. **Docker Registry Credentials**:
   - Kind: Username with password
   - ID: `nexus-docker-credentials`
   - Username: `student`
   - Password: `Imcc@2025`

2. **Kubernetes Config** (if using K8s):
   - Kind: Secret file
   - ID: `kubeconfig`
   - Upload your kubeconfig file

#### C. Configure Kubernetes Secret for Nexus Pull

Create a Kubernetes secret for pulling images from Nexus:

```bash
kubectl create secret docker-registry nexus-secret \
  --namespace=ns-2401147 \
  --docker-server=nexus.imcc.com:8083 \
  --docker-username=student \
  --docker-password=Imcc@2025
```

---

## Deployment Process

### Option 1: Jenkins Pipeline (Recommended)

#### Step 1: Push Code to Git
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

#### Step 2: Create Jenkins Pipeline Job

1. **Login to Jenkins** (http://jenkins.imcc.com/)
2. Click **"New Item"**
3. Enter name: `music-learning-platform-pipeline`
4. Select **"Pipeline"**
5. Click **OK**

#### Step 3: Configure Pipeline

**Under Pipeline section:**
- Definition: `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: Your Git repository URL
- Credentials: Add your Git credentials if private
- Branch: `*/main`
- Script Path: `Jenkinsfile`

**Save** and click **"Build Now"**

#### What the Pipeline Does:
1. ✓ Builds Docker image
2. ✓ Runs Jest tests with coverage
3. ✓ Performs SonarQube code analysis
4. ✓ Logs into Nexus registry
5. ✓ Tags and pushes image to Nexus
6. ✓ Deploys to Kubernetes cluster

---

### Option 2: Manual Docker Deployment

#### Step 1: Build Docker Image
```bash
docker build -t music-learning-platform:latest .
```

#### Step 2: Login to Nexus Registry
```bash
docker login nexus.imcc.com:8083
# Username: student
# Password: Imcc@2025
```

#### Step 3: Tag and Push
```bash
docker tag music-learning-platform:latest nexus.imcc.com:8083/music-learning-platform:latest
docker push nexus.imcc.com:8083/music-learning-platform:latest
```

#### Step 4: Deploy to Kubernetes
```bash
kubectl apply -f k8s-deployment/music-academy-k8s.yaml
```

#### Step 5: Verify Deployment
```bash
kubectl get pods -n ns-2401147
kubectl get service -n ns-2401147
kubectl logs -f deployment/music-frontend -n ns-2401147
```

---

## Kubernetes Deployment Commands

### Check Deployment Status
```bash
# Check pods
kubectl get pods -n ns-2401147

# Check deployment
kubectl get deployment -n ns-2401147

# Check service
kubectl get service -n ns-2401147

# View logs
kubectl logs -f deployment/music-frontend -n ns-2401147
```

### Update Deployment
```bash
# After pushing new image to Nexus
kubectl rollout restart deployment/music-frontend -n ns-2401147

# Check rollout status
kubectl rollout status deployment/music-frontend -n ns-2401147
```

### Rollback (if needed)
```bash
kubectl rollout undo deployment/music-frontend -n ns-2401147
```

---

## Access Your Application

### Via Kubernetes Service
```bash
# Get service details
kubectl get service music-frontend-service -n ns-2401147

# Port forward for local testing
kubectl port-forward service/music-frontend-service 8080:80 -n ns-2401147
# Access: http://localhost:8080
```

### Via Ingress (if configured)
Update `music-academy-k8s.yaml` line 118:
```yaml
host: music.yourdomain.com   # Change to your actual domain
```

Then access via: http://music.yourdomain.com

---

## Troubleshooting

### Jenkins Build Fails

**Issue**: Docker login fails
```bash
# Solution: Add insecure registry in Docker daemon
# Edit /etc/docker/daemon.json on Jenkins agent
{
  "insecure-registries": ["nexus.imcc.com:8083"]
}
sudo systemctl restart docker
```

**Issue**: Tests fail
```bash
# Check test output in Jenkins console
# Fix failing tests in your code
```

### SonarQube Analysis Fails

**Issue**: Authentication error
```bash
# Verify credentials in Jenkinsfile line 89
# Or generate a token and use it instead
```

**Issue**: Project not found
```bash
# Create project in SonarQube first
# Project key must match: music-learning-platform
```

### Kubernetes Deployment Issues

**Issue**: ImagePullBackOff
```bash
# Check if nexus-secret exists
kubectl get secret nexus-secret -n ns-2401147

# If not, create it:
kubectl create secret docker-registry nexus-secret \
  --namespace=ns-2401147 \
  --docker-server=nexus.imcc.com:8083 \
  --docker-username=student \
  --docker-password=Imcc@2025
```

**Issue**: Pods not starting
```bash
# Check pod logs
kubectl logs <pod-name> -n ns-2401147

# Check events
kubectl describe pod <pod-name> -n ns-2401147
```

**Issue**: Service not accessible
```bash
# Check service endpoints
kubectl get endpoints -n ns-2401147

# Check if pods are ready
kubectl get pods -n ns-2401147
```

---

## Environment Variables

The application requires these environment variables (already configured in K8s secret):

- `VITE_SUPABASE_URL`: https://jzdolobncemqdqazgwoq.supabase.co
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

To update these:
```bash
kubectl edit secret music-frontend-secret -n ns-2401147
```

---

## Monitoring

### View Application Logs
```bash
kubectl logs -f deployment/music-frontend -n ns-2401147 --tail=100
```

### Monitor Resources
```bash
kubectl top pods -n ns-2401147
kubectl top nodes
```

### Check SonarQube Quality Gate
Visit: http://sonarqube.imcc.com/dashboard?id=music-learning-platform

---

## Checklist

Before running the pipeline, ensure:

- [ ] Git repository is accessible from Jenkins
- [ ] Docker registry (Nexus port 8083) is configured
- [ ] `nexus-secret` exists in namespace `ns-2401147`
- [ ] SonarQube project `music-learning-platform` exists
- [ ] Jenkins credentials are configured
- [ ] Kubernetes cluster is accessible
- [ ] Docker daemon has insecure-registries configured

---

## Quick Commands Reference

```bash
# Build locally
docker build -t music-learning-platform:latest .

# Run locally
docker run -p 8080:80 --env-file .env music-learning-platform:latest

# Push to Nexus
docker login nexus.imcc.com:8083
docker tag music-learning-platform:latest nexus.imcc.com:8083/music-learning-platform:latest
docker push nexus.imcc.com:8083/music-learning-platform:latest

# Deploy to K8s
kubectl apply -f k8s-deployment/music-academy-k8s.yaml

# Check status
kubectl get all -n ns-2401147

# View logs
kubectl logs -f deployment/music-frontend -n ns-2401147

# Access locally
kubectl port-forward service/music-frontend-service 8080:80 -n ns-2401147
```

---

## Support

For issues:
1. Check Jenkins console output for build errors
2. Check SonarQube dashboard for code quality issues
3. Check Kubernetes pod logs for runtime errors
4. Verify all credentials are correct
5. Ensure all services (Jenkins, Nexus, SonarQube, K8s) are accessible
