const core = require('@actions/core');
const github = require('@actions/github');
const path = require("path");
const url = require("url");

const os = require('os');
const fs = require('fs');

const main = async () => {
    try {
        /**
         * We need to fetch all the inputs that were provided to our action
         * and store them in variables for us to use.
         **/

        const productpath = getProductPath();
        var imshared = core.getInput('imshared', { required: false });
        const workspace = core.getInput('workspace', { required: false });
        const project = core.getInput('project', { required: false });
        const suite = core.getInput('suite', { required: false });

        const configfile = core.getInput('configFile', { required: false });
        const swapdatasets = core.getInput('swapDatasets', { required: false });
        const exportreport = core.getInput('exportReport', { required: false });
        const exportstats = core.getInput('exportStats', { required: false });
        const exportstatshtml = core.getInput('exportStatsHtml', { required: false });
        const multipleValues = core.getInput('multipleValues', { required: false });

        var exportstatsformat;
        var exportstatreportlist;
        var imports;
        var labels;
        var overwrite;
        var protocolinput;
        var publish;
        var publish_for;
        var publishreports;
        var results;
        var usercomments;
        var varfile;
        var vmargs;
        
        if (!imshared) {
            imshared = getImsharedLoc(productpath);
        }

        if (!isEmptyOrSpaces(multipleValues)) {
            var mult_value = multipleValues.split('|');
            for (var i = 0; i < mult_value.length; i++) {
                var value = new Array(); 
                value[0] = mult_value[i].toString().substring(0, mult_value[i].indexOf('='));
                value[1] = mult_value[i].toString().substring(mult_value[i].indexOf('=')+1);
                if (value.length != 2) {
                    throw new Error(
                        "Please enter input in keyvalue format seperated by '|'"
                    );
                } else if (isEmptyOrSpaces(value[0])) {
                    throw new Error(
                        "Input key is not given"
                    );
                } else if (isEmptyOrSpaces(value[1])) {
                    throw new Error(
                        "Input key value is not given"
                    );
                }
                if (value[0] == 'exportStatsFormat') {
                    exportstatsformat = value[1];
                } else if (value[0] == 'exportStatReportList') {
                    exportstatreportlist = value[1];
                } else if (value[0] == 'imports') {
                    imports = value[1];
                }else if (value[0] == 'labels') {
                    labels = value[1];
                } else if (value[0] == 'overwrite') {
                    overwrite = value[1];
                } else if (value[0] == 'protocolInput') {
                    protocolinput = value[1];
                }else if (value[0] == 'publish') {
                    publish = value[1];
                } else if (value[0] == 'publishFor') {
                    publish_for = value[1];
                } else if (value[0] == 'publishReports') {
                    publishreports = value[1];
                } else if (value[0] == 'results') {
                    results = value[1];
                }else if (value[0] == 'users') {
                    users = value[1];
                }else if (value[0] == 'userComments') {
                    usercomments = value[1];
                }else if (value[0] == 'varFile') {
                    varfile = value[1];
                }else if (value[0] == 'vmArgs') {
                    vmargs = value[1];
                }
            }
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
    // Need to add proper sharedlocation HCL/IBM - hardcoded to HCL
    return ibmloc + path.sep + "HCLIMShared";
}
function isEmptyOrSpaces(dataset) {
    return dataset === null || dataset.match(/^ *$/) !== null;
}
// Call the main function to run the action
main();
