const { exec } = require('child_process');
const packagejson = require('../../package.json');
const boxen = require('boxen');

function checkVerison(callback) {
    console.log("now version is ", packagejson.version);
    exec('npm info changchiakai-cli version', (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }

        // console.log(packagejson.version)
        const npmVersion = stdout.trim();
        // console.log(npmVersion>packagejson.version? 'true':'false');
        if (npmVersion > packagejson.version) {
            console.log("有新版要更新喔 npm update -g changchiakai-cli");
            console.log(boxen("npm update -g changchikaia-cli",{padding:1}))
        }
        callback;

       
        // console.log(`stdout: ${stdout}`);
        // console.log(npmVersion===packagejson.version);
        // console.log(packagejson.version);
        // the *entire* stdout and stderr (buffered)
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);
    });
}

module.exports = {
    checkVerison
}