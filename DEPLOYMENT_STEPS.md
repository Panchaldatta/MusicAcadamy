# Deployment Steps for Music Learning Platform

## Prerequisites

Your college servers are already set up:
- **SonarQube**: http://sonarqube.imcc.com (student / Imccstudent@2025)
- **Nexus**: http://nexus.imcc.com (student / Imcc@2025)
- **Jenkins**: http://jenkins.imcc.com (student / Changeme@2025)
- **Kubernetes Cluster**: Available with namespace `2401147`

---

## Step 1: Create Nexus Docker Registry Secret in Kubernetes

Before deploying, create a secret for pulling images from Nexus:

```bash
kubectl create secret docker-registry nexus-secret \
  --docker-server=nexus.imcc.com:8083 \
  --docker-username=student \
  --docker-password=Imcc@2025 \
  -n 2401147
```

---

## Step 2: Create Kubernetes ConfigMap for Docker Daemon

This is needed for Jenkins DIND (Docker-in-Docker):

```bash
kubectl create configmap docker-daemon-config \
  --from-literal=daemon.json='{"insecure-registries":["nexus.imcc.com:8083"]}' \
  -n default
```

---

## Step 3: Create Kubernetes Secret for Kubeconfig

Create a secret containing your kubeconfig file:

```bash
kubectl create secret generic kubeconfig-secret \
  --from-file=kubeconfig=$HOME/.kube/config \
  -n default
```

---

## Step 4: Set Up Jenkins Pipeline

1. Log in to Jenkins: http://jenkins.imcc.com
   - Username: `student`
   - Password: `Changeme@2025`

2. Create a new Pipeline job:
   - Click "New Item"
   - Name: `music-learning-platform`
   - Select "Pipeline"
   - Click "OK"

3. Configure the pipeline:
   - Scroll to "Pipeline" section
   - Definition: Select "Pipeline script from SCM"
   - SCM: Select "Git"
   - Repository URL: Your Git repository URL
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
   - Click "Save"

4. Run the pipeline:
   - Click "Build Now"
   - Watch the pipeline stages execute

---

## Step 5: Verify Deployment

After the Jenkins pipeline completes successfully:

1. Check pods are running:
```bash
kubectl get pods -n 2401147
```

2. Check service:
```bash
kubectl get svc -n 2401147
```

3. Check ingress:
```bash
kubectl get ingress -n 2401147
```

4. Access your application:
   - URL: http://music.imcc.com

---

## Pipeline Stages Explanation

The Jenkins pipeline executes these stages:

1. **Build Docker Image**: Builds the React app into a Docker image
2. **SonarQube Analysis**: Analyzes code quality and security
3. **Login to Docker Registry**: Authenticates with Nexus
4. **Build - Tag - Push**: Tags and pushes image to Nexus
5. **Deploy to Kubernetes**: Applies K8s manifests and deploys

---

## Manual Docker Build & Push (Optional)

If you want to test Docker build/push locally:

```bash
# Build
docker build -t music-frontend:latest .

# Login to Nexus
docker login nexus.imcc.com:8083 -u student -p Imcc@2025

# Tag
docker tag music-frontend:latest nexus.imcc.com:8083/music-learning-platform:latest

# Push
docker push nexus.imcc.com:8083/music-learning-platform:latest
```

---

## Manual Kubernetes Deployment (Optional)

If you want to deploy manually without Jenkins:

```bash
# Apply all resources
kubectl apply -f k8s-deployment/music-academy-k8s.yaml

# Check rollout status
kubectl rollout status deployment/music-frontend -n 2401147

# Check pods
kubectl get pods -n 2401147

# Get logs
kubectl logs -f deployment/music-frontend -n 2401147
```

---

## Update Deployment

When you make code changes and want to redeploy:

1. **Via Jenkins** (Recommended):
   - Go to Jenkins pipeline
   - Click "Build Now"
   - Pipeline will build, test, push, and deploy automatically

2. **Manually**:
```bash
# Rebuild and push image
docker build -t music-frontend:latest .
docker tag music-frontend:latest nexus.imcc.com:8083/music-learning-platform:latest
docker push nexus.imcc.com:8083/music-learning-platform:latest

# Restart deployment
kubectl rollout restart deployment/music-frontend -n 2401147
```

---

## Check Application Status

```bash
# Get all resources in namespace
kubectl get all -n 2401147

# Get pod logs
kubectl logs -f deployment/music-frontend -n 2401147

# Execute commands in pod
kubectl exec -it deployment/music-frontend -n 2401147 -- sh

# Port forward for local testing
kubectl port-forward svc/music-frontend-service 8080:80 -n 2401147
# Then access: http://localhost:8080
```

---

## Troubleshooting

### Pipeline Fails at Docker Build
- Check if Docker daemon is running in Jenkins pod
- Verify Dockerfile is correct
- Wait for DIND to fully initialize (15 second delay is included)

### Cannot Push to Nexus
- Verify credentials: `student / Imcc@2025`
- Check if Docker registry is configured as insecure in daemon.json
- Ensure registry URL is correct: `nexus.imcc.com:8083`
- Confirm Nexus Docker repository exists and is accessible

### SonarQube Analysis Fails
- Verify SonarQube is accessible: http://sonarqube.imcc.com
- Check credentials: `student / Imccstudent@2025`
- Ensure project key `music-learning-platform` exists

### Kubernetes Deployment Fails
- Verify namespace exists: `kubectl get ns 2401147`
- Check if nexus-secret exists: `kubectl get secret nexus-secret -n 2401147`
- Verify kubeconfig-secret: `kubectl get secret kubeconfig-secret -n default`
- Check docker-daemon-config: `kubectl get configmap docker-daemon-config -n default`

### Image Pull Error
- Ensure nexus-secret is created correctly
- Verify image exists in Nexus: http://nexus.imcc.com/#browse/browse:docker-hosted
- Check image name matches: `nexus.imcc.com:8083/music-learning-platform:latest`

### Pods Not Starting
- Check pod logs: `kubectl logs <pod-name> -n 2401147`
- Describe pod: `kubectl describe pod <pod-name> -n 2401147`
- Verify Supabase credentials in secret

---

## Important Notes

1. **Namespace**: Your namespace is `2401147` (not `ns-2401147`)
2. **Ingress Host**: Application will be available at `http://music.imcc.com`
3. **Supabase Keys**: Already configured in k8s secret
4. **Registry**: All images go to `nexus.imcc.com:8083/music-learning-platform`
5. **Credentials**: All hardcoded in Jenkinsfile and K8s files (no Jenkins credential setup needed)
6. **Docker Daemon**: DIND container has 15-second initialization delay
7. **Login Delay**: 10-second delay before Docker login to ensure daemon is ready

---

## Pre-Deployment Checklist

- [ ] Nexus secret created: `kubectl get secret nexus-secret -n 2401147`
- [ ] Docker daemon configmap: `kubectl get configmap docker-daemon-config -n default`
- [ ] Kubeconfig secret: `kubectl get secret kubeconfig-secret -n default`
- [ ] Jenkins pipeline configured with Git repository
- [ ] Supabase credentials verified in `.env` and `k8s-deployment/music-academy-k8s.yaml`
- [ ] Dockerfile builds successfully locally
- [ ] All credentials correct (Nexus, SonarQube, Jenkins)

---

## Next Steps After Deployment

1. Access your application at: http://music.imcc.com
2. Monitor application logs: `kubectl logs -f deployment/music-frontend -n 2401147`
3. Check SonarQube for code quality: http://sonarqube.imcc.com/dashboard?id=music-learning-platform
4. View Docker images in Nexus: http://nexus.imcc.com/#browse/browse:docker-hosted
5. Configure domain DNS if using custom domain

---

## Quick Reference Commands

```bash
# Create all secrets and configmaps
kubectl create secret docker-registry nexus-secret \
  --docker-server=nexus.imcc.com:8083 \
  --docker-username=student \
  --docker-password=Imcc@2025 \
  -n 2401147

kubectl create configmap docker-daemon-config \
  --from-literal=daemon.json='{"insecure-registries":["nexus.imcc.com:8083"]}' \
  -n default

kubectl create secret generic kubeconfig-secret \
  --from-file=kubeconfig=$HOME/.kube/config \
  -n default

# Check everything
kubectl get all -n 2401147
kubectl get secret -n 2401147
kubectl get configmap -n default

# View logs
kubectl logs -f deployment/music-frontend -n 2401147

# Restart deployment
kubectl rollout restart deployment/music-frontend -n 2401147
```

---

## Support

If you encounter issues:
1. Check Jenkins console output for pipeline failures
2. Review pod logs: `kubectl logs <pod-name> -n 2401147`
3. Verify all secrets and configmaps are created
4. Ensure Supabase credentials are correct
5. Check Docker image exists in Nexus registry
6. Verify all three secrets exist (nexus-secret, kubeconfig-secret, docker-daemon-config)
