const fs = require('fs');
const path = require('path');

const testRunnerHelper = {
    run: callback => {
        const newman = require('newman');
        // dependencies must be here, not at top level
        // to allow install on first run

        const { configHelper } = require('./configHelper');
        const { jwtHelper } = require('./jwtHelper');
        const { collectionHelper } = require('./collectionHelper');

        const config = configHelper.config();

        const collection = require(config.collectionPath);

        const jwt = jwtHelper.createJwt(config.jwtClaims);

        const runningInsecure = !config.sslCACert && config.sslInsecure;

        const newmanOptions = {
            collection: collectionHelper.buildCollection(collection, config, jwt),
            insecure: runningInsecure,
            globals: {
                id: 'ca04658d-e050-4255-b635-8f38e7fb7af9',
                name: 'endpoint-globals',
                values: [
                    {
                        key: 'SUCCESS_URL',
                        value: config.successEndpoint,
                        type: 'text',
                        enabled: true,
                    },
                    {
                        key: 'ERROR_URL',
                        value: config.errorEndpoint,
                        type: 'text',
                        enabled: true,
                    }
                ],
                timestamp: 1404119927461,
                _postman_variable_scope: 'globals',
            },
            reporters: 'html',
            reporter: {
                html: {
                    export: config.htmlReportExportPath,
                    template: config.htmlReportTemplatePath,
                }
            }
        };

        if (config.sslClientCert) {
            newmanOptions.sslClientCert = config.sslClientCert;
        }

        if (config.sslClientKey) {
            newmanOptions.sslClientKey = config.sslClientKey;
        }

        if (config.sslClientPassphrase) {
            newmanOptions.sslClientPassphrase = config.sslClientPassphrase;
        }

        const newmanRunner = newman.run(newmanOptions, (err) => {
            if (err) {
                throw err;
            }

            if (typeof callback === 'function') {
                callback();
            }

            console.log(`\x1b[32mPositive and Negative conformance tests executed successfully.\n\n\x1b[33mSee ${config.htmlReportExportPath} for results.\x1b[0m`);
            console.log('');

            process.exit();
        });

        if (config.saveResponsesToFile) {
            let requestIdx = 0;

            newmanRunner.on('request', (err, { response }) => { // This is triggered when a response has been recieved
                requestIdx++;

                if (err) {
                    return console.error(err);
                }

                const { code, stream, headers } = response;

                const contentTypeHeader = headers.reference['content-type'];

                const match = contentTypeHeader && contentTypeHeader.value.match(/\/(.+)/);
                const extension = match && match[1];

                const reportPath = config.htmlReportExportPath.replace(/\.html$/, '');

                if (Math.floor(code / 100) === 2) { // is 2xx response code
                    fs.writeFile(path.join(__dirname, '..', `${reportPath}-response-${requestIdx}${extension ? `.${extension}` : ''}`), stream, error => {
                        if (error) {
                            console.error(error);
                        }
                    });
                }
            });
        }

    },

    checkDependenciesRequired: () => {
        try {
            require.resolve('newman');
            require.resolve('newman-reporter-html');
        } catch (_e) {
            return true;
        }

        return false;
    }
}

module.exports = {
    testRunnerHelper,
};
