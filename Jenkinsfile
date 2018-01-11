nodeBuild {
  after_test_callback = { build =>
    build.step([
      $class: 'CloverPublisher',
      cloverReportDir: 'coverage',
      cloverReportFileName: 'clover.xml',
      healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80], // optional, default is: method=70, conditional=80, statement=80
      unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50], // optional, default is none
      failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]     // optional, default is none
    ])
  }
}
