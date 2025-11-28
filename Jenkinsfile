// pipeline {

//     agent {
//         kubernetes {
//             yaml """
// apiVersion: v1
// kind: Pod
// spec:
//   containers:

//   - name: docker
//     image: docker:20.10-dind
//     securityContext:
//       privileged: true
//     env:
//       - name: DOCKER_TLS_CERTDIR
//         value: ""
//     command: ["dockerd-entrypoint.sh"]
//     args: ["--host=tcp://0.0.0.0:2375"]
//     volumeMounts:
//       - name: docker-storage
//         mountPath: /var/lib/docker

//   - name: dind-client
//     image: docker:20.10
//     command: ["sleep", "infinity"]
//     env:
//       - name: DOCKER_HOST
//         value: tcp://localhost:2375

//   - name: sonar-scanner
//     image: sonarsource/sonar-scanner-cli
//     command: ["sleep", "infinity"]

//   - name: kubectl
//     image: bitnami/kubectl:latest
//     command: ["sleep", "infinity"]
//     env:
//       - name: KUBECONFIG
//         value: /kube/config
//     volumeMounts:
//       - name: kubeconfig-secret
//         mountPath: /kube/config
//         subPath: kubeconfig

//   volumes:
//     - name: docker-storage
//       emptyDir: {}
//     - name: kubeconfig-secret
//       secret:
//         secretName: kubeconfig-secret
// """
//         }
//     }

//     environment {
//         // Use your actual Supabase values here
//         VITE_SUPABASE_URL       = 'https://jzdolobncemqdqazgwoq.supabase.co'
//         VITE_SUPABASE_ANON_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZG9sb2JuY2VtcWRxYXpnd29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODExMjQsImV4cCI6MjA2NjA1NzEyNH0.kuOTWWHX8Jtq3ZjN9T9iVEqSNa2Jd9wLpTrT5k-wGQA'
//     }

//     stages {

//         stage('Build Docker Image') {
//             steps {
//                 container('dind-client') {
//                     script {
//                         echo "Building Docker image with Supabase build args"

//                         sh """
//                             docker build \
//                               --build-arg VITE_SUPABASE_URL='${VITE_SUPABASE_URL}' \
//                               --build-arg VITE_SUPABASE_ANON_KEY='${VITE_SUPABASE_ANON_KEY}' \
//                               -t music-frontend:latest .
//                         """
//                     }
//                 }
//             }
//         }

//         stage('SonarQube Analysis') {
//             steps {
//                 container('sonar-scanner') {
//                      withCredentials([string(credentialsId: 'sonar-token-2401147', variable: 'SONAR_TOKEN')]) {
//                         sh '''
//                             sonar-scanner \
//                                 -Dsonar.projectKey=2401147_Music \
//                                 -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
//                                 -Dsonar.login=$SONAR_TOKEN \
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Login to Docker Registry') {
//             steps {
//                 container('dind-client') {
//                     sh """
//                         docker --version
//                         docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
//                           -u admin -p Changeme@2025
//                     """
//                 }
//             }
//         }

//         stage('Build - Tag - Push') {
//             steps {
//                 container('dind-client') {
//                     sh """
//                         docker tag music-frontend:latest 
//                           nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/music-frontend:latest

//                         docker push 
//                           nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/music-frontend:latest

//                         docker pull 
//                           nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/music-frontend:latest
//                     """
//                 }
//             }
//         }

//         stage('Deploy to Kubernetes') {
//             steps {
//                 container('kubectl') {
//                     script {
//                         dir('k8s-deployment') {
//                             sh """
//                                 kubectl apply -f music-academy-k8s.yaml -n 2401147
//                                 kubectl rollout status deployment/music-frontend -n 2401147
//                             """
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

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-storage
      mountPath: /var/lib/docker

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
                              -Dsonar.projectKey=2401147-Music \
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
