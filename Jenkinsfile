pipeline {
    agent any

    environment {
        scannerHome = tool 'jenkins-frontend-tool' // Configure the SonarQube scanner tool in Jenkins
    }

    stages {
        stage('SCM Checkout') {
            steps {
                // Clone the specified GitHub repository
                git branch: 'main', url: 'https://github.com/Bidenn/instalite-vulnerable-frontend.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Run SonarQube scanner
                withSonarQubeEnv('SonarQube Server') { // Ensure the correct SonarQube server name is configured
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage("Quality Gate") {
            steps {
                // Wait for the SonarQube Quality Gate
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
                sh 'nohup npm start > npm-start.log 2>&1 &'
            }
        }

        // stage('ZAP Scan') {
        //     agent {
        //         docker {
        //             image 'ghcr.io/zaproxy/zaproxy:stable' // Use the ZAP proxy Docker image
        //             args '-u root --network host -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:/zap/wrk:rw'
        //         }
        //     }
        //     steps {
        //         // Perform ZAP baseline scan and handle failures gracefully
        //         catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        //             sh 'zap-baseline.py -t http://localhost:3000 -r zapbaseline.html -x zapbaseline.xml'
        //         }

        //         // Copy and archive the ZAP scan results
        //         sh 'cp /zap/wrk/zapbaseline.html ./zapbaseline.html'
        //         sh 'cp /zap/wrk/zapbaseline.xml ./zapbaseline.xml'
        //         archiveArtifacts artifacts: 'zapbaseline.html'
        //         archiveArtifacts artifacts: 'zapbaseline.xml'
        //     }
        // }
    }
}
