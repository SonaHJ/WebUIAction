const core = require('@actions/core');
const github = require('@actions/github');
const path = require("path");

const os = require('os');
const fs = require('fs');

const main = async () => {
    try {
        /**
         * We need to fetch all the inputs that were provided to our action
         * and store them in variables for us to use.
         **/

        const productpath = getProductPath();
        const projectdir = core.getInput('projectdir', { required: false });
        const imshared = core.getInput('imshared', { required: false });
        const workspace = core.getInput('workspace', { required: false });
        const project = core.getInput('project', { required: false });
        const suite = core.getInput('suite', { required: false });
        const labels = core.getInput('labels', { required: false });
        const varfile = core.getInput('varfile', { required: false });
        const swapdatasets = core.getInput('swapdatasets', { required: false });
        const configfile = core.getInput('configfile', { required: false });
        const results = core.getInput('results', { required: false });
        const overwrite = core.getInput('overwrite', { required: false });
        const exportstats = core.getInput('exportstats', { required: false });
        const exportstatreportlist = core.getInput('exportstatreportlist', { required: false });
        const exportstatshtml = core.getInput('exportstatshtml', { required: false });
        const usercomments = core.getInput('usercomments', { required: false });
        const protocolinput = core.getInput('protocolinput', { required: false });
        const exportreport = core.getInput('exportreport', { required: false });
        const imports = core.getInput('imports', { imports: false });
        const exportstatsformat = core.getInput('exportstatsformat', { required: false });
        const publish = core.getInput('publish', { required: false });
        const publish_for = core.getInput('publish_for', { required: false });
        const publishreports = core.getInput('publishreports', { required: false });
        if (imshared == null) {
            imshared = getImsharedLoc(productpath);
        }
        if (configfile) {
            if (process.platform == 'linux') {
                script = 'cd ' + '"' + productpath + '/cmdline"' + '\n'
                    + 'bash cmdline.sh'
                    + ' -configfile ' + '"' + configfile + '"';
            }
            if (process.platform == 'win32') {
                script = 'cd ' + '"' + productpath + '\\cmdline"' + '\n'
                    + './cmdline.bat'
                    + ' -configfile ' + '"' + configfile + '"';
            }
        }
        else {
            if (workspace == null || project == null || suite == null || imshared == null) {
                core.setFailed("WorkSpace,Project & Suite are mandotory parameters");
            }
            if (process.platform == 'linux') {
                script = 'cd ' + '"' + productpath + '/cmdline"' + '\n'
                    + 'bash cmdline.sh'
                    + ' -workspace ' + '"' + workspace + '"'
                    + ' -project ' + '"' + project + '"'
                    + ' -eclipsehome ' + '"' + productpath + '"'
                    + ' -plugins ' + '"' + imshared + '/plugins"';
            }
            else
                if (process.platform == 'win32') {
                    script = 'cd ' + '"' + productpath + '\\cmdline"' + '\n'
                        + './cmdline.bat'
                        + ' -workspace ' + '"' + workspace + '"'
                        + ' -project ' + '"' + project + '"'
                        + ' -eclipsehome ' + '"' + productpath + '"'
                        + ' -plugins ' + '"' + imshared + '\\plugins"';
                }
            if (suite.indexOf(".xml") != -1) {
                script = script.concat(' -aftsuite ' + '"' + suite + '"')
            }
            else {
                script = script.concat(' -suite ' + '"' + suite + '"')
            }
            if (labels) {
                script = script.concat(' -labels ' + '"' + labels + '"')
            }
            if (varfile) {
                script = script.concat(' -varfile ' + '"' + varfile + '"')
            }
            if (swapdatasets) {
                script = script.concat(' -swapdatasets ' + '"' + swapdatasets + '"')
            }
            if (results) {
                script = script.concat(' -results ' + '"' + results + '"')
            }
            if (overwrite) {
                script = script.concat(' -overwrite ' + '"' + overwrite + '"')
            }
            if (exportstats) {
                script = script.concat(' -exportstats ' + '"' + exportstats + '"')
            }
            if (exportstatreportlist) {
                script = script.concat(' -exportstatreportlist ' + '"' + exportstatreportlist + '"')
            }
            if (exportstatshtml) {
                script = script.concat(' -exportstatshtml ' + '"' + exportstatshtml + '"')
            }
            if (usercomments) {
                script = script.concat(' -usercomments ' + '"' + usercomments + '"')
            }
            if (protocolinput) {
                script = script.concat(' -protocolinput ' + '"' + protocolinput + '"')
            }
            if (exportreport) {
                script = script.concat(' -exportReport ' + '"' + exportreport + '"')
            }
            if (imports) {
                script = script.concat(' -import ' + '"' + imports + '"')
            }
            if (exportstatsformat) {
                script = script.concat(' -exportstatsformat ' + '"' + exportstatsformat + '"')
            }
            if (publish) {
                script = script.concat(' -publish ' + '"' + publish + '"')
            }
            if (publish_for) {
                script = script.concat(' -publish_for ' + '"' + publish_for + '"')
            }
            if (publishreports) {
                script = script.concat(' -publishreports ' + '"' + publishreports + '"')
            }
        }


        let tempDir = os.tmpdir();
        let filePath = path.join(tempDir, suite + '.ps1');
        await fs.writeFileSync(
            filePath,
            script,
            { encoding: 'utf8' });

        console.log(script);
        console.log('========================== Starting Command Output ===========================');
        var spawn = require("child_process").spawn, child;
        child = spawn("powershell.exe", [filePath]);
        child.stdout.on("data", function (data) {
            console.log(" " + data);
        });
        child.stderr.on("data", function (data) {
            console.log("Errors: " + data);
        });
        child.on("exit", function () {
            console.log("Powershell Script finished");

        });
        await new Promise((resolve) => {
            child.on('close', resolve)
        });
        child.stdin.end();


        var fResultFile = tempDir + path.sep + "CommandLineLog.txt";


        if (fs.existsSync(fResultFile)) {

            var verdictRegex = /--VERDICT=(INCONCLUSIVE|ERROR|PASS|FAIL).*/
            var serverRegex = /--PUBLISH_URL=(.*)/;
            var reportRegex = /--REPORT=(.*)[|]--URL=(.*)/;
            var reports = {};
            var isVerdictSet = false;
            var verdict;
            var publishURL;
            var reportSet = false;

            var data = fs.readFileSync(fResultFile, 'utf-8')
                .split('\n');
            data.forEach(line => {
                if (!isVerdictSet && verdictRegex.test(line)) {
                    var result = verdictRegex.exec(line);
                    verdict = result[1];
                    console.log("Test Result is: " + verdict);
                    isVerdictSet = true;
                    if (verdict == 'ERROR' || verdict == 'FAIL') {
                        core.setFailed("Test Result is: FAIL");
                    }
                }
                else if (publishURL == undefined && serverRegex.test(line)) {
                    var result = serverRegex.exec(line);
                    publishURL = result[1];
                }
                else if (reportRegex.test(line)) {
                    var reps = reportRegex.exec(line);
                    reports[reps[1]] = reps[2];
                    reportSet = true;
                }
            });

            if (!isVerdictSet) {
                console.log("Test Result is: FAIL");
                core.setFailed("Test Result is: FAIL");
            }
            if (publishURL != undefined && reportSet) {
                console.log("");
                console.log("Published Reports information:");
                for (var i in reports) {
                    console.log(i + " : " + url.resolve(publishURL, reports[i]));
                }
            }
        }
        else {
            console.log("Test Result is: FAIL");
            core.setFailed("Test Result is: FAIL");
        }

        console.log("");
    }

    catch (error) {
        core.setFailed(error.message);
    }
}

function getProductPath() {
    var productPathVal = process.env.TEST_WORKBENCH_HOME;
    var isValid = isValidEnvVar(productPathVal);
    if (isValid) {
        var stats = fs.statSync(productPathVal);
        isValid = stats.isDirectory();
    }

    if (!isValid) {
        throw new Error("Could not find a valid TEST_WORKBENCH_HOME environment variable pointing to installation directory.");
    }
    return productPathVal;
}
function isValidEnvVar(productPathVal) {
    var valid = true;
    if (productPathVal == null)
        valid = false;

    else {
        productPathVal = productPathVal.toLowerCase();
        if (productPathVal.includes("*") || productPathVal.includes("?") ||
            productPathVal.startsWith("del ") || productPathVal.startsWith("rm "))
            valid = false;
    }

    return valid;
}

function getImsharedLoc(productpath) {
    let ibmloc = null;
    var rollupIndex = productpath.lastIndexOf(path.sep);
    if (productpath.length == rollupIndex + 1) {
        ibmloc = productpath.substring(0, rollupIndex);
        rollupIndex = ibmloc.lastIndexOf("/");
    }
    ibmloc = productpath.substring(0, rollupIndex);
    return ibmloc + path.sep + "_prop_task_IMShared_";
}
// Call the main function to run the action
main();
