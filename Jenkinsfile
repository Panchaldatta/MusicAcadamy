pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command:
    - cat
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config        
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true  # Needed to run Docker daemon
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""  # Disable TLS for simplicity
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json  # Mount the file directly here
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
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
                        sleep 15
                        docker build \
                          --build-arg VITE_SUPABASE_URL='${VITE_SUPABASE_URL}' \
                          --build-arg VITE_SUPABASE_ANON_KEY='${VITE_SUPABASE_ANON_KEY}' \
                          -t music-frontend:latest .
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401147', variable: 'SONAR_TOKEN')]) {
                        sh """
                            sonar-scanner \
                              -Dsonar.projectKey=2401147_FINAL \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.token=$SONAR_TOKEN \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=node_modules/**,dist/**
                        """
                    }
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker --version
                        sleep 10
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker tag music-frontend:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401147-project/music-frontend:latest

                        docker push \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401147-project/music-frontend:latest

                        docker pull \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401147-project/music-frontend:latest

                        docker image ls
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
