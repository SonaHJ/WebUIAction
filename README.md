# Web-UI Action

This action enables you to run HCL OneTest UI tests.

## How this works

You can use the Web-UI Action that enables you to select any type of test created in HCL OneTest™ UI that you can add to the job in the GitHub action.

## Pre requisites

1. Create a github repository
2. Create a folder named ".github" in the root of the repository
3. Create a folder named "workflows" inside the ".github" folder.
5. Create a .yml file with any name , inside the "workflow" folder and you need to code as following example in that yml file
## Example usage

```yaml
name: WebUI Action

on: workflow_dispatch

jobs:

    WebUI-Action:
        runs-on: self-hosted
        name: Execute WebUI Test
        steps:
         - name: WebUI Action
           uses: SonaHJ/WebUIActio@WebUI_Release
          with:
            workspace: D:\workspace_pt
            project: Test
            suite: Test
            imshared: C:\Program Files\HCL\HCLIMShared\plugins
```
7. Replace the example input values with your details.
8. Push it into the main branch
9. Go to the Actions section in the repository and select the workflow.
10. Click the Run workflow dropdown and the list of input boxes get displayed.

To configure agent:
1. Go to settings (Repo).
2. Select action -> runner.
3. Click Create self-hosted runner, follow the download and configure instruction

## Inputs

### `workspace`

**Required** Complete path to Eclipse workspace.

### `project`

**Required** The name of the project containing the test.	

### `suite`

**Required** Specify the relative path from the project to the test including the file name of the test. A test can be WebUI test, Compound test, Performance schedule or Accelerated Functional Test (AFT) suite. The test suite name must contain the file extension when it is an AFT suite. To run multiple tests from the same project sequentially, you must separate the tests by a colon (:). If you provide multiple tests, you cannot include an AFT suite along with it.

### `imshared`

Complete path to HCLIMShared location, if it is not at default location.

### `configfile`

**Required** The complete path to a file that contains the parameters for a test or schedule run, If Config file is specified then no other fields will be required.

### `swapdatasets`

Use this option to replace dataset values during a test or schedule run. You must ensure that both original and new datasets are in the same workspace and have the same column names. You must also include the path to the dataset. For example, /project_name/ds_path/ds_filename.csv:/project_name/ds_path/new_ds_filename.csv

### `exportreport`

Export the unified report.

### `exportstats`

The complete path to a directory in which to store exported statistical report data.

### `exportstatshtml`

Specify the complete path to a directory in which to export web analytic results. Analyze the results on a web browser without using the HCL OneTest Studio. If you are running multiple tests, do not provide a value in this field. The web analytic results will be exported to Jenkins workspace.

### `multipleValues`

you may only define up to 10 inputs for a workflow_dispatch event. Remaining inputs need to be Key=Value pair.

https://github.community/t/you-may-only-define-up-to-10-inputs-for-a-workflow-dispatch-event/160733

https://github.com/github/docs/issues/15710

Specify the below inputs in the Key=Value format.
Ex: Key1=Value1|Key2=Value2

## Multiplevalue inputs

### `exportstatsformat`
Use this option to set the report type json or csv.

### `exportstatreportlist`
A comma-separated list of absolute paths to custom report format files (.view files) to use when exporting statistical report data with the-exportstats option.

### `imports`
Path of the Project location to be imported.

### `labels`
Use this option to add labels to test results. To add multiple labels to a test result, you must separate each label by using a comma.

### `overwrite`
Determines whether a results file with the same name is overwritten. The default value, true, means that the results file is overwritten.

### `protocolinput`
Use this argument to run a Web UI test in parallel on different browsers.

### `publish`
You can use this parameter to publish test results to the Server.

### `publish_for`
You can use this option to publish the test results based on the completion status of the tests.

### `publishreports`
You can use this option to publish specific test results to the Server.

### `results`
Specify a name for the results file. If you do not specify a name, the test or schedule name appended by the timestamp is used for the name. The results file is stored in the Results directory. If you are running multiple tests, do not provide a name for the results file.

### `usercomments`
Add text within double quotation mark to display it in the User Comments row of the report.

### `varfile`
The complete path to the XML file that contains the variable name and value pairs.

