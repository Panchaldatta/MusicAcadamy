pipeline {

    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:

  containers:

  # -------------------------
  # Docker Daemon (DinD)
  # -------------------------
  - name: dind
    image: docker:20.10-dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
      - name: docker-storage
        mountPath: /var/lib/docker

  # -------------------------
  # Sonar Scanner
  # -------------------------
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["sleep", "infinity"]
    tty: true

  # -------------------------
  # Kubectl for deployment
  # -------------------------
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["sleep", "infinity"]
    tty: true
    env:
      - name: KUBECONFIG
        value: /kube/config
    volumeMounts:
      - name: kubeconfig-secret
        mountPath: /kube/config
        subPath: kubeconfig

  volumes:
    - name: docker-storage
      emptyDir: {}

    - name: kubeconfig-secret
      secret:
        secretName: kubeconfig-secret
'''
        }
    }

    environment {
        VITE_SUPABASE_URL = 'https://jzdolobncemqdqazgwoq.supabase.co'
        VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZG9sb2JuY2VtcWRxYXpnd29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODExMjQsImV4cCI6MjA2NjA1NzEyNH0.kuOTWWHX8Jtq3ZjN9T9iVEqSNa2Jd9wLpTrT5k-wGQA'
    }

    stages {

      
        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Waiting for Docker..."
                        sleep 15

                        docker build \
                          --build-arg VITE_SUPABASE_URL='${VITE_SUPABASE_URL}' \
                          --build-arg VITE_SUPABASE_ANON_KEY='${VITE_SUPABASE_ANON_KEY}' \
                          -t music-frontend:latest .

                        docker image ls
                    '''
                }
            }
        }

   
        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401147', variable: 'SQ_TOKEN')]) {

                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401147_Music \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.token=$SQ_TOKEN \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=node_modules/**,dist/**,**/*.test.tsx,**/*.test.ts
                        '''
                    }
                }
            }
        }

      
        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        echo "Logging into Nexus..."
                        sleep 5

                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                          -u admin -p Changeme@2025
                    '''
                }
            }
        }

      
        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker tag music-frontend:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/music-frontend:latest

                        docker push \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/music-frontend:latest

                        echo "Image pushed successfully!"
                    '''
                }
            }
        }

       
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    dir('k8s-deployment') {
                        sh '''
                            kubectl apply -f music-academy-k8s.yaml -n 2401147
                            kubectl rollout status deployment/music-frontend -n 2401147
                        '''
                    }
                }
            }
        }
    }
}
