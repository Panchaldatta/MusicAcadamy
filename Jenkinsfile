pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: docker
    image: docker:24.0
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    command: ["dockerd-entrypoint.sh"]
    args: ["--host=tcp://0.0.0.0:2375"]
    volumeMounts:
      - name: docker-graph-storage
        mountPath: /var/lib/docker

  - name: dind-client
    image: docker:24.0
    command: ["cat"]
    tty: true
    env:
      - name: DOCKER_HOST
        value: tcp://localhost:2375

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

  volumes:
    - name: docker-graph-storage
      emptyDir: {}
    - name: kubeconfig-secret
      secret:
        secretName: kubeconfig-secret
'''
        }
    }

    stages {

        // Stage 1: Build Docker image with Supabase secrets
        stage('Build Docker Image') {
            steps {
                container('dind-client') {
                    script {
                        echo "Fetching Supabase secrets..."

                        def supabaseUrl = sh(
                            script: "kubectl get secret music-frontend-secret -n 2401147 -o jsonpath='{.data.VITE_SUPABASE_URL}' | base64 -d",
                            returnStdout: true
                        ).trim()

                        def supabaseAnonKey = sh(
                            script: "kubectl get secret music-frontend-secret -n 2401147 -o jsonpath='{.data.VITE_SUPABASE_ANON_KEY}' | base64 -d",
                            returnStdout: true
                        ).trim()

                        echo "Building Docker image..."

                        sh """
                            docker build \
                              --build-arg VITE_SUPABASE_URL='${supabaseUrl}' \
                              --build-arg VITE_SUPABASE_ANON_KEY='${supabaseAnonKey}' \
                              -t music-frontend:latest .
                        """
                    }
                }
            }
        }

        // Stage 2: SonarQube Analysis
        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401147', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401147-Music \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=node_modules/**,dist/** \
                              -Dsonar.sourceEncoding=UTF-8
                        '''
                    }
                }
            }
        }

        // Stage 3: Login to Docker Registry
         stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh 'docker --version'
                    sh 'sleep 10'
                    sh 'docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025'
                }
            }
        }

        // Stage 4: Tag + Push Image
        stage('Build - Tag - Push') {
            steps {
                container('dind-client') {
                    sh '''
                        docker tag music-frontend:latest nexus.imcc.com:8083/music-learning-platform:latest
                        docker push nexus.imcc.com:8083/music-learning-platform:latest
                    '''
                }
            }
        }

        // Stage 5: Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    script {
                        dir('k8s-deployment') {
                            sh '''
                                kubectl apply -f music-academy-k8s.yaml
                                kubectl rollout status deployment/music-frontend -n 2401147
                            '''
                        }
                    }
                }
            }
        }

    }
}
