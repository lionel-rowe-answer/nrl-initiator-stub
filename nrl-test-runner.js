const { testRunnerHelper } = require('./lib/newman-test-runner');
const { configHelper } = require('./lib/configHelper');

const config = configHelper.config();

const useCaCert = !!config.sslCACert;
const runningInsecure = useCaCert === false && config.sslInsecure === true;

const nodeVersion = process.versions.node;
const [major, minor] = nodeVersion.split('.').map(n => parseInt(n, 10));

if (major > 10 || major < 7 || (major === 7 && minor < 3)) {
    process.stdout.write(`\x1b[31mWARNING! Current Node.js version is ${nodeVersion}. Version 7.3.0 - 10.x.x required.\x1b[0m`);
}

let getDependencies = testRunnerHelper.checkDependenciesRequired();

const stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

if (runningInsecure) {
    process.stdout.write('\x1b[31mWARNING! App running in insecure mode, proceed with caution or exit the app.\x1b[0m');
}

process.stdout.write('\n');
process.stdout.write('\x1b[36m### Welcome to NRL Retrieval conformance test runner ###\x1b[0m');
process.stdout.write('\n\n');

const prompt = () => {
    if (!getDependencies) {
        process.stdout.write('\x1b[36mRun conformance tests? \x1b[33mPress y or n \x1b[0m');
    } else {
        process.stdout.write('\x1b[36mInstall test runner dependencies? \x1b[33mPress y or n \x1b[0m');
    }
};

stdin.on('data', function (key) {
    if (['y', 'Y', '\r', '\n'].includes(key)) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        if (getDependencies) {
            const { exec } = require('child_process');
            
            progressMessage.start('depInstaller', 'Installing Dependencies', process.stdout);

            exec('npm install --loglevel=error', (error, _stdout, stderr) => {
                progressMessage.stop('depInstaller', process.stdout);

                if (error || stderr) {
                    process.stdout.write('\x1b[31mFailed to install dependencies. Conformance tests can\'t run.\x1b[0m');
                    process.stdout.write('\n\n');

                    process.exit();
                }

                getDependencies = false;

                process.stdout.write('\x1b[32mDependencies installed ok. \x1b[36mRun conformance tests? \x1b[33mPress y or n \x1b[0m');

            });
        } else {
            progressMessage.start('testRunner', 'Running conformance tests', process.stdout);

            testRunnerHelper.run(() => {
                progressMessage.stop('testRunner', process.stdout);
            });
        }
    } else if (['n', 'N', '\x1b' /* ESC */, '\x03' /* ^C */, '\x04' /* ^D */, '\x1a' /* ^Z */].includes(key)) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        const msgPrefix = getDependencies ? 'Installation skipped! ' : '';

        process.stdout.write('\x1b[31m' + msgPrefix + 'Conformance tests NOT run.\x1b[0m');
        process.stdout.write('\n\n');

        process.exit();
    } else {
        console.log('\n');
        prompt();
    }
});

prompt();

const progressMessage = {
    messages: [],

    start: function (key, text, std) {
        const PROGRESS_BAR_LENGTH = 20;

        const msg = {
            text,
            progress: 1,
        };

        msg.interval = setInterval(() => {
            const msgPadding = '.'.repeat(msg.progress);

            std.clearLine();
            std.cursorTo(0);
            std.write('\x1b[35m' + msg.text + '\x1b[33m' + msgPadding + '\x1b[0m');

            msg.progress++;

            if (msg.progress > PROGRESS_BAR_LENGTH) {
                msg.progress = 0;
            }

        }, 500);

        this.messages[key] = msg;
    },

    stop: function (key, std) {
        const { interval } = this.messages[key];

        clearInterval(interval);

        std.clearLine();
        std.cursorTo(0);

        delete this.messages[key];
    },
};

//more colours at: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
