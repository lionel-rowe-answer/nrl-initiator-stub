const { configHelper } = require('./lib/configHelper');

const { sslInsecure, sslCACert, sslClientCert } = configHelper.config();

if (!sslInsecure && sslCACert && sslClientCert) {
    process.stdout.write(sslCACert);
} else {
    process.stdout.write('null');
}

process.exit();
