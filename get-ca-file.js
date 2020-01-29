const { configHelper } = require('./lib/configHelper');

const { sslCACert, sslClientCert } = configHelper.config();

if (sslCACert && sslClientCert) {
    process.stdout.write(sslCACert);
} else {
    process.stdout.write('null');
}

process.exit();
