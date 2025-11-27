pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: node
    image: node:18
    command: ["cat"]
    tty: true

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    env:
      - name: KUBECONFIG
        value: /kube/config
    volumeMounts:
      - name: kubeconfig-secret
        mountPath: /kube/config
        subPath: kubeconfig

  - name: dind
    image: docker:dind
    args: ["--storage-driver=overlay2"]
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
      - name: docker-config
        mountPath: /etc/docker/daemon.json
        subPath: daemon.json

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

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Building Docker image..."
                        sleep 15
                        docker build -t music-frontend:latest .
                    '''
                }
            }
        }

        stage('Run Jest Tests') {
            steps {
                container('node') {
                    sh '''
                        echo "Running Jest tests"
                        npm install
                        npm test -- --coverage
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=music-learning-platform \
                          -Dsonar.host.url=http://sonarqube.imcc.com \
                          -Dsonar.login=student \
                          -Dsonar.password=Imccstudent@2025 \
                          -Dsonar.sources=src \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login nexus.imcc.com:8083 -u student -p Imcc@2025
                    '''
                }
            }
        }

        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker tag music-frontend:latest \
                          nexus.imcc.com:8083/music-learning-platform:${BUILD_NUMBER}

                        docker push nexus.imcc.com:8083/music-learning-platform:${BUILD_NUMBER}
                        
                        docker tag music-frontend:latest \
                          nexus.imcc.com:8083/music-learning-platform:latest

                        docker push nexus.imcc.com:8083/music-learning-platform:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f music-academy-k8s.yaml -n ns-2401147
                        kubectl rollout status deployment/music-frontend -n ns-2401147
                    '''
                }
            }
        }
    }
}
