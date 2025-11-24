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
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
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

        ######################################################
        # 1. BUILD DOCKER IMAGE FOR REACT PROJECT
        ######################################################
        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "⏳ Waiting for Docker..."
                        sleep 15

                        echo "🚀 Building Music Academy Docker image"
                        docker build -t music-frontend:latest .

                        docker image ls
                    '''
                }
            }
        }

        ######################################################
        # 2. RUN TESTS (JEST)
        ######################################################
        stage('Run Jest Tests') {
            steps {
                container('dind') {
                    sh '''
                        echo "🧪 Running Jest tests..."

                        docker run --rm music-frontend:latest \
                          sh -c "npm install && npm test -- --coverage"

                        echo "✔ Tests completed"
                    '''
                }
            }
        }

        ######################################################
        # 3. SONARQUBE JAVASCRIPT ANALYSIS
        ######################################################
 stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                     withCredentials([string(credentialsId: 'sonar-token-2401199', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                                -Dsonar.projectKey=2401199_attendance-system \
                                -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                                -Dsonar.login=$SONAR_TOKEN \
                                -Dsonar.python.coverage.reportPaths=coverage.xml
                        '''
                    '''
                }
            }
        }

        ######################################################
        # 4. LOGIN TO NEXUS DOCKER REGISTRY
        ######################################################
        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        echo "🔐 Logging into Nexus..."
                        docker login host.docker.internal:30085 -u admin -p Change@Me123
                    '''
                }
            }
        }

        ######################################################
        # 5. TAG & PUSH TO NEXUS
        ######################################################
        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        echo "🏷 Tagging image"

                        docker tag music-frontend:latest \
                          host.docker.internal:30085/datta-project/music-learning-platform:v1

                        echo "⬆ Pushing image"
                        docker push host.docker.internal:30085/datta-project/music-learning-platform:v1

                        echo "⬇ Pulling for verification"
                        docker pull host.docker.internal:30085/datta-project/music-learning-platform:v1

                        docker image ls
                    '''
                }
            }
        }

        ######################################################
        # 6. DEPLOY TO KUBERNETES (ns-2401147)
        ######################################################
        stage('Deploy Music Academy to Kubernetes') {
            steps {
                container('kubectl') {
                    script {
                        dir('.') {   // k8s YAML is in repo root
                            sh '''
                                echo "🚀 Deploying to Kubernetes namespace: ns-2401147"

                                kubectl apply -f music-academy-k8s.yaml -n ns-2401147

                                echo "⏳ Waiting for rollout..."
                                kubectl rollout status deployment/music-frontend -n ns-2401147

                                echo "✔ Deployment Complete!"
                            '''
                        }
                    }
                }
            }
        }
    }
}
