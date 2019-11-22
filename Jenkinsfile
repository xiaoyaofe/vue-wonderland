pipeline {
    agent { label 'ansible' }
    environment {
        project = "oa"
        ppath = "/data/packages/prod/frontend"
        rpath = "/data/k8s/packages/prod/frontend"
    }
    stages {
        stage('DEPLOY') {
            steps {
                script {
                    try {
                        sh '''
                            workspace=$(pwd)
                            mkdir -p ${rpath}/${project}/$(date '+%Y%m%d')
                            filename="${project}-$(date '+%Y%m%d%H%M%S').zip"
                            zip -qr ${filename} *  -x Jenkinsfile -x ansible/ -x ansible/* 
                            mv ${filename} ${rpath}/${project}/$(date '+%Y%m%d')/

                            cd ansible
                            src_file="${rpath}/${project}/$(date '+%Y%m%d')/${filename}"
                            dest_file="/data/server_new/${filename}"
                            arch_file="${project}-$(date '+%Y%m%d%H%M%S').zip"
                            ansible-playbook -i hosts deploy.yml --extra-var "src_file=${src_file} dest_file=${dest_file} project=oa-management arch_file=${arch_file}"
                            rm -f *.retry
                            /bin/sh notify.sh "deploy success" "${JOB_NAME}" "${BUILD_NUMBER}"
                        '''
                    } catch(err) {
                        echo 'deploy error'
                        sh '/bin/sh ansible/notify.sh "deploy error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
    }
    post {
        success {
            sh '''
                if curl -I http://oas.royale.com 2>&1 | grep -q 200 ; then
                    /bin/sh ansible/notify.sh "http://oas.royale.com check success" "${JOB_NAME}" "${BUILD_NUMBER}"
                else
                    /bin/sh ansible/notify.sh "http://oas.royale.com cannot access" "${JOB_NAME}" "${BUILD_NUMBER}"
                fi
            '''
        }
    }
}
