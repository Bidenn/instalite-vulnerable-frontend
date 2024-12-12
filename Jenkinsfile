pipeline {
    agent any

    environment {
        scannerHome = tool 'jenkins-frontend-tool'
    }

    stages {
        stage('SCM Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Bidenn/instalite-vulnerable-frontend.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube Server') { 
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    script {
                        try {
                            waitForQualityGate abortPipeline: true
                        } catch (Exception e) {
                            echo 'Quality Gate failed, but continuing the pipeline...'
                        }
                    }
                }
            }
        }

        stage('Copy env-live to .env') {
            steps {
                sh '''
                if [ -f env-live ]; then
                    cp .env-live .env
                    echo "env-live copied to .env successfully."
                else
                    echo "env-live file does not exist. Failing the stage."
                    exit 1
                fi
                '''
            }
        }

        stage('Stop npm Start Script') {
            steps {
                // Safely stop the npm start script if it's running
                sh 'pgrep -f "npm start" | xargs kill -9 || true'
            }
        }

        stage('Start npm Start Script') {
            steps {
                // Check Node.js and npm versions
                sh 'node -v'
                sh 'npm -v'

                // Install dependencies and start the npm start script in detached mode
                sh 'npm install'
                sh 'nohup npm run start > npm-start.log 2>&1 &'
            }
        }

        stage('ZAP Scan') {
            agent {
                docker {
                    image 'ghcr.io/zaproxy/zaproxy:stable' // Use the ZAP proxy Docker image
                    args '-u root --network host -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:/zap/wrk:rw'
                }
            }
            steps {
                // Perform ZAP baseline scan and handle failures gracefully
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'zap-baseline.py -t http://localhost:3000 -r zapbaseline.html -x zapbaseline.xml'
                }

                // Copy and archive the ZAP scan results
                sh 'cp /zap/wrk/zapbaseline.html ./zapbaseline.html'
                sh 'cp /zap/wrk/zapbaseline.xml ./zapbaseline.xml'
                archiveArtifacts artifacts: 'zapbaseline.html'
                archiveArtifacts artifacts: 'zapbaseline.xml'
            }
        }
    }
}
