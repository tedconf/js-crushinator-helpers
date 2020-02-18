nodeBuild {
  deploy_callback = {
    build ->
      stage('archive') {
        try {
          step([
            $class: 'CloverPublisher',
            cloverReportDir: 'artifacts',
            cloverReportFileName: 'clover.xml',
          ])
        } catch (caughtError) {
          echo "Clover Archive step failed ... check 'artifacts/clover.xml'?"
        }
      }
  }
}
