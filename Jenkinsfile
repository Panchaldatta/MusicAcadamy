// pipeline {
//     agent {
//         kubernetes {
//             yaml '''
// apiVersion: v1
// kind: Pod
// spec:
//   containers:

//   - name: sonar-scanner
//     image: sonarsource/sonar-scanner-cli
//     command: ["cat"]
//     tty: true

//   - name: kubectl
//     image: bitnami/kubectl:latest
//     command: ["cat"]
//     tty: true
//     securityContext:
//       runAsUser: 0
//       readOnlyRootFilesystem: false
//     env:
//       - name: KUBECONFIG
//         value: /kube/config
//     volumeMounts:
//       - name: kubeconfig-secret
//         mountPath: /kube/config
//         subPath: kubeconfig

//   - name: dind
//     image: docker:dind
//     securityContext:
//       privileged: true
//     env:
//       - name: DOCKER_TLS_CERTDIR
//         value: ""
//     volumeMounts:
//       - name: docker-config
//         mountPath: /etc/docker/daemon.json
//         subPath: daemon.json

//   volumes:
//     - name: docker-config
//       configMap:
//         name: docker-daemon-config
//     - name: kubeconfig-secret
//       secret:
//         secretName: kubeconfig-secret
// '''
//         }
//     }

//     stages {

//         stage('Build Docker Image') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         echo "Building Docker image..."
//                         sleep 15
//                         docker build -t music-frontend:latest .
//                     '''
//                 }
//             }
//         }

//         stage('SonarQube Analysis') {
//             steps {
//                 container('sonar-scanner') {
//                     withCredentials([string(credentialsId: 'sonar-token-2401147', variable: 'SONAR_TOKEN')]) {
//                         sh '''
//                             sonar-scanner \
//                               -Dsonar.projectKey=2401147-Datta \
//                               -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
//                               -Dsonar.login=$SONAR_TOKEN \
//                               -Dsonar.sources=src \
//                               -Dsonar.exclusions=node_modules/**,dist/** \
//                               -Dsonar.tests=src \
//                               -Dsonar.test.inclusions=src/**/*.test.ts,src/**/*.test.tsx \
//                               -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
//                               -Dsonar.sourceEncoding=UTF-8
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Login to Docker Registry') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker --version
//                         sleep 10
//                         docker login nexus.imcc.com:8083 -u student -p Imcc@2025
//                     '''
//                 }
//             }
//         }

//         stage('Build - Tag - Push') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker tag music-frontend:latest \
//                           nexus.imcc.com:8083/music-learning-platform:latest

//                         docker push nexus.imcc.com:8083/music-learning-platform:latest
//                     '''
//                 }
//             }
//         }

//         stage('Deploy to Kubernetes') {
//             steps {
//                 container('kubectl') {
//                     script {
//                         dir('k8s-deployment') {
//                             sh '''
//                                 kubectl apply -f music-academy-k8s.yaml
//                                 kubectl rollout status deployment/music-frontend -n 2401147
//                             '''
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }


pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  # Docker Daemon (DinD)
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

  # Docker client
  - name: dind-client
    image: docker:24.0
    command: ["cat"]
    tty: true
    env:
      - name: DOCKER_HOST
        value: tcp://localhost:2375

  # Sonar scanner
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  # Kubectl for deployment
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

        ##################################################
        # 1) BUILD DOCKER IMAGE with SUPABASE SECRETS
        ##################################################
        stage('Build Docker Image') {
            steps {
                container('dind-client') {
                    script {
                        echo "Fetching Supabase secrets..."

                        // Read secrets from Kubernetes Secret
                        def supabaseUrl = sh(
                            script: "kubectl get secret music-frontend-secret -n 2401147 -o jsonpath='{.data.VITE_SUPABASE_URL}' | base64 -d",
                            returnStdout: true
                        ).trim()

                        def supabaseAnonKey = sh(
                            script: "kubectl get secret music-frontend-secret -n 2401147 -o jsonpath='{.data.VITE_SUPABASE_ANON_KEY}' | base64 -d",
                            returnStdout: true
                        ).trim()

                        echo "Building Docker image with build args..."

                        // Build image with build args
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

        ##################################################
        # 2) SONARQUBE ANALYSIS
        ##################################################
        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401147', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401147-Datta \
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

        ##################################################
        # 3) LOGIN TO NEXUS DOCKER REGISTRY
        ##################################################
        stage('Login to Docker Registry') {
            steps {
                container('dind-client') {
                    sh '''
                        docker login nexus.imcc.com:8083 -u student -p Imcc@2025
                    '''
                }
            }
        }

        ##################################################
        # 4) TAG + PUSH IMAGE
        ##################################################
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

        ##################################################
        # 5) DEPLOY TO KUBERNETES
        ##################################################
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

    } // stages
}
