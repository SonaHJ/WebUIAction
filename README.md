# HCL OneTest UI-WEBUI

This action enables you to run HCL OneTest WEBUI tests.

## Pre requisites

1. Create a github repository
2. Create a folder named ".github/workflows" in the root of the repository
3. Create a .yml file with any name inside the ".github/workflows" folder and you need to copy example in that yml file

## Example usage

```yaml
name: HCL OneTest WEBUI

on:
    workflow_dispatch:
        inputs:
            workspace:
                description: 'Workspace'
                required: true
            project:
                description: 'Project'
                required: true
            suite:
                description: 'Test Suite Name'
                required: true
            imShared:
                description: 'IMShared Location'
                required: false
            configFile:
                description: 'Configuration File'
                required: false
            swapDatasets:
                description: 'Dataset Override'
                required: false
            exportReport:
                description: 'Export Report'
                required: false
            exportStats:
                description: 'Export Stats'
                required: false
            exportStatsHtml:
                description: 'Export stats html'
                required: false
            multipleValues:
                description: 'Multiplevalue inputs'
                required: false

jobs:

    WebUI-Action:
        runs-on: self-hosted
        name: HCL OneTest WEBUI
        steps:
         - name: HCL OneTest WEBUI
           uses: SonaHJ/WebUIAction@main
           with:
            workspace: '${{ github.event.inputs.workspace }}'
            project: '${{ github.event.inputs.project }}'
            suite: '${{ github.event.inputs.suite }}'
            imShared: '${{ github.event.inputs.imShared }}'
            configFile: '${{ github.event.inputs.configFile }}'
            swapDatasets: '${{ github.event.inputs.swapDatasets }}'
            exportReport: '${{ github.event.inputs.exportReport }}'
            exportStats: '${{ github.event.inputs.exportStats }}'
            exportStatsHtml: '${{ github.event.inputs.exportStatsHtml }}'
            multipleValues: '${{ github.event.inputs.multipleValues }}'

```
4. Push it into the main branch
5. To configure agent:
    1. Go to settings (Repo).
    2. Select action -> runner.
    3. Click Create self-hosted runner, follow the download and configure instruction

6. Go to the Actions section in the repository and select the workflow.
7. Click the Run workflow dropdown and the list of input boxes get displayed.

## Inputs

### `workspace`

**Required** Complete path to Eclipse workspace.

### `project`

**Required** The name of the project containing the test.	

### `suite`

**Required** Specify the relative path from the project to the test including the file name of the test. A test can be WebUI test, Compound test, Performance schedule or Accelerated Functional Test (AFT) suite. The test suite name must contain the file extension when it is an AFT suite. To run multiple tests from the same project sequentially, you must separate the tests by a colon (:). If you provide multiple tests, you cannot include an AFT suite along with it.

### `imShared`

**Optional** Complete path to HCLIMShared location, if it is not at default location.

### `configFile`

**Optional** The complete path to a file that contains the parameters for a test or schedule run, If Config file is specified then no other fields will be required.

### `swapDatasets`

**Optional** Use this option to replace dataset values during a test or schedule run. You must ensure that both original and new datasets are in the same workspace and have the same column names. You must also include the path to the dataset. For example, /project_name/ds_path/ds_filename.csv:/project_name/ds_path/new_ds_filename.csv

### `exportReport`

**Optional** Export the unified report.

### `exportStats`

**Optional** The complete path to a directory in which to store exported statistical report data.

### `exportStatsHtml`

**Optional** Specify the complete path to a directory in which to export web analytic results. Analyze the results on a web browser without using the HCL OneTest Studio. If you are running multiple tests, do not provide a value in this field. The web analytic results will be exported to Jenkins workspace.

### `multipleValues`

you may only define up to 10 inputs for a workflow_dispatch event. Remaining inputs need to be Key=Value pair.

https://github.community/t/you-may-only-define-up-to-10-inputs-for-a-workflow-dispatch-event/160733

https://github.com/github/docs/issues/15710

Specify the below inputs in the Key=Value format.
	Ex: publish=publish_urlVal|labels=Value2
	
**Required** Note that separator between the key-value pairs is '|' character.

## Supported multiplevalue inputs

### `exportStatsFormat`
Use this option to set the report type json or csv.

### `exportStatReportList`
A comma-separated list of absolute paths to custom report format files (.view files) to use when exporting statistical report data with the-exportstats option.

### `imports`
Path of the Project location to be imported.

### `labels`
Use this option to add labels to test results. To add multiple labels to a test result, you must separate each label by using a comma.

### `overwrite`
Determines whether a results file with the same name is overwritten. The default value, true, means that the results file is overwritten.

### `protocolInput`
Use this argument to run a Web UI test in parallel on different browsers.

### `publish`
You can use this parameter to publish test results to the Server.

### `publishFor`
You can use this option to publish the test results based on the completion status of the tests.

### `publishReports`
You can use this option to publish specific test results to the Server.

### `results`
Specify a name for the results file. If you do not specify a name, the test or schedule name appended by the timestamp is used for the name. The results file is stored in the Results directory. If you are running multiple tests, do not provide a name for the results file.

### `userComments`
Add text within double quotation mark to display it in the User Comments row of the report.

### `varFile`
The complete path to the XML file that contains the variable name and value pairs.

