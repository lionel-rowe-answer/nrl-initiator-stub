const {configHelper} = require('./lib/configHelper');
const {utilsHelper} = require('./lib/utilsHelper');

let sslCACert = configHelper.config().sslCACert;
let sslClientCert = configHelper.config().sslClientCert;

if(utilsHelper.validString(sslCACert) && utilsHelper.validString(sslClientCert)){
  process.stdout.write(sslCACert);
}else{
  process.stdout.write("null");
}
process.exit();