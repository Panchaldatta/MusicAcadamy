pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-nexus-docker-registry:8083'
        DOCKER_IMAGE = 'music-learning-platform'
        DOCKER_TAG = "${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = 'music-learning-platform'
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        DOCKER_CREDENTIALS_ID = 'nexus-docker-credentials'
        SONAR_HOST_URL = 'http://your-sonarqube-server:9000'
        SONAR_TOKEN = credentials('sonarqube-token')
    }
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Code Quality - Lint') {
            steps {
                sh 'npm run lint || true'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.tsx,**/*.test.ts
                        """
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Build Application') {
            steps {
                sh '''
                    export VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
                    export VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
                    export VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
                    npm run build
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Security Scan - Trivy') {
            steps {
                sh """
                    trivy image --severity HIGH,CRITICAL \
                    --exit-code 0 \
                    --no-progress \
                    ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
        
        stage('Push to Nexus Registry') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Archive Artifacts to Nexus') {
            steps {
                script {
                    sh """
                        tar -czf dist-${BUILD_NUMBER}.tar.gz dist/
                        curl -v -u \${NEXUS_USER}:\${NEXUS_PASSWORD} \
                        --upload-file dist-${BUILD_NUMBER}.tar.gz \
                        http://your-nexus-server:8081/repository/raw-repo/music-learning-platform/${BUILD_NUMBER}/dist-${BUILD_NUMBER}.tar.gz
                    """
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh """
                        docker stop music-learning-staging || true
                        docker rm music-learning-staging || true
                        docker run -d \
                        --name music-learning-staging \
                        -p 8081:80 \
                        --restart unless-stopped \
                        -e VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
                        -e VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY} \
                        ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                script {
                    sh """
                        docker stop music-learning-prod || true
                        docker rm music-learning-prod || true
                        docker run -d \
                        --name music-learning-prod \
                        -p 80:80 \
                        --restart unless-stopped \
                        -e VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
                        -e VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY} \
                        ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                    <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                to: 'team@example.com'
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                    <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                to: 'team@example.com'
            )
        }
        always {
            cleanWs()
        }
    }
}
