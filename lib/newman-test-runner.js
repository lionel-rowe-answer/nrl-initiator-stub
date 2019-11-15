let testRunnerHelper = {

    run: function(callback) {

        const newman = require('newman');
        const {configHelper} = require('./configHelper');
        const {jwtHelper} = require('./jwtHelper');
        const {collectionHelper} = require('./collectionHelper');
        const {utilsHelper} = require('./utilsHelper');

        const collection = require(configHelper.config().collectionPath);

        let jwt = jwtHelper.createJwt(configHelper.config().jwtClaims);

        let useCaCert = utilsHelper.validString(configHelper.config().sslCACert);
        let runningInsecure = useCaCert == false && configHelper.config().sslInsecure == true;

        let newmanOptions = {
            collection: collectionHelper.buildCollection(collection, configHelper.config(), jwt),
            insecure: runningInsecure,
            globals: {
                "id": "ca04658d-e050-4255-b635-8f38e7fb7af9",
                "name": "endpoint-globals",
                "values": [
                    {
                        "key": "SUCCESS_URL",
                        "value": configHelper.config().successEndpoint,
                        "type": "text",
                        "enabled": true
                    },
                    {
                        "key": "ERROR_URL",
                        "value": configHelper.config().errorEndpoint,
                        "type": "text",
                        "enabled": true
                    }
                ],
                "timestamp": 1404119927461,
                "_postman_variable_scope": "globals"
            },
            reporters: 'html',
            reporter: {
                html: {
                    export: configHelper.config().htmlReportExportPath, 
                    template: configHelper.config().htmlReportTemplatePath 
                }
            }  
        };

        if(utilsHelper.validString(configHelper.config().sslClientCert)) {
            newmanOptions.sslClientCert = configHelper.config().sslClientCert;
        }

        if(utilsHelper.validString(configHelper.config().sslClientKey)) {
            newmanOptions.sslClientKey = configHelper.config().sslClientKey;
        }

        if(utilsHelper.validString(configHelper.config().sslClientPassphrase)) {
            newmanOptions.sslClientPassphrase = configHelper.config().sslClientPassphrase;
        }

        newman.run(newmanOptions, function (err) {
            
            if (err) { 
                throw err; 
            }

            if(typeof callback === "function") {
                callback();
            }

            console.log('\x1b[32mPositive and Negative conformance tests executed successfully. \x1b[33mSee the reports folder for results.\x1b[0m');
            console.log("");

            process.exit();
        });
    },

    checkDependencies: function () {

        let requireDependencies = false;
      
        try {
      
          let newmanStatus = require.resolve("newman");
        } 
        catch(e) {
      
          requireDependencies = true;
        }
        
        try {
      
          let newmanReporterHtml = require.resolve("newman-reporter-html");
        } 
        catch(e) {
      
          requireDependencies = true;
        }
      
        return requireDependencies;
      }

}

module.exports.testRunnerHelper = testRunnerHelper;