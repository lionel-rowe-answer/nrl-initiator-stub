const {testRunnerHelper} = require('./lib/newman-test-runner');
const {utilsHelper} = require('./lib/utilsHelper');
const {configHelper} = require('./lib/configHelper');

let useCaCert = utilsHelper.validString(configHelper.config().sslCACert);
let runningInsecure = useCaCert == false && configHelper.config().sslInsecure == true;

let getDependencies = testRunnerHelper.checkDependencies();

let stdin = process.stdin;

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

if(runningInsecure){
  process.stdout.write('\x1b[31mWARNING! App running in insecure mode, proceed with caution or exit the app.\x1b[0m');
}

process.stdout.write("\n");
process.stdout.write('\x1b[36m### Welcome to NRL Retrieval conformance test runner ###\x1b[0m');
process.stdout.write("\n\n");

stdin.on( 'data', function( key ){
  
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  if ( key === '\u0079' && getDependencies) {
  
    progressMessage.start("depInstaller", "Installing Dependencies", process.stdout);

    const exec = require('child_process').exec;

    const child = exec('npm install --loglevel=error', (error, stdout, stderr) => {

        progressMessage.stop("depInstaller", process.stdout);

        if (!utilsHelper.isNullOrEmpty(error) || !utilsHelper.isNullOrEmpty(stderr)) {

            process.stdout.write("\x1b[31mFailed to install dependencies. Conformance tests can't run.\x1b[0m");
            process.stdout.write("\n\n");

            process.exit();
        }

        getDependencies = false;

        process.stdout.write("\x1b[32mDependencies installed ok. \x1b[36mRun conformance tests? \x1b[33mPress y or n \x1b[0m");
 
    });

  } else if ( key === '\u0079' && !getDependencies) {

    progressMessage.start("testRunner", "Running conformance tests", process.stdout);

    testRunnerHelper.run(() => {
      progressMessage.stop("testRunner", process.stdout);
    });

  } else {

    let mssgPrefix = getDependencies ? "Installation skipped! " : "";
    process.stdout.write('\x1b[31m'+ mssgPrefix + 'Conformance tests NOT run.\x1b[0m');
    process.stdout.write("\n\n");

    process.exit();
  }

});


if(!getDependencies){

  process.stdout.write("\x1b[36mRun conformance tests? \x1b[33mPress y or n \x1b[0m");

} else {
  
  process.stdout.write('\x1b[36mInstall test runner dependencies? \x1b[33mPress y or n \x1b[0m');
}


let progressMessage = {

    messages:[],

    start: function(key, message, std) {

      let mssgIntv = {
        progress: 1,
        message: message,
        intv: null
      };
      
      mssgIntv.intv = setInterval(() => { 

        let padding = "....................";
        let mssgPadding = String(padding).slice(-1 * mssgIntv.progress); 

        std.clearLine();
        std.cursorTo(0);
        std.write('\x1b[35m' + mssgIntv.message + '\x1b[33m' + mssgPadding + '\x1b[0m');     
  
        mssgIntv.progress++; 

        if(mssgIntv.progress > padding.length){
          mssgIntv.progress = 0;
        }
      
      }, 500);

      this.messages[key] = mssgIntv;
    },

    stop: function(key, std){

      let mssgIntv = this.messages[key].intv;
      clearInterval(mssgIntv);

      std.clearLine();
      std.cursorTo(0);

      delete this.messages[key];
    }
};

//more colours at: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color