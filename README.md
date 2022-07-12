# Web-UI Action

create tests for your application in HCL OneTest™ UI and run those using this action. 

## How this works

You can use the Web-UI Action that enables you to select any type of test created in HCL OneTest™ UI that you can add to the job in the GitHub action.

## Pre requesits

1. Create a github repository
2. Create a folder named ".github" in the root of the repository
3. Create a folder named "workflows" inside the ".github" folder.
5. Create a .yml file with any name , inside the "workflow" folder and you need to code as following example in that yml file
6. Replace the example input values with your details.
7. Push it into the main branch
8. go to the action section in the repo to see the CICD pipeline working

To configure agent:
1. Go to settings (Repo).
2. Select action -> runner.
3. Click Create self-hosted runner, follow the download and configure instruction

## Inputs

### `imshared`

Complete path to HCLIMShared location, if it is not at default location.

### `workspace`

**Required** Complete path to Eclipse workspace.

### `project`

**Required** The name of the project containing the test.	

### `suite`

**Required** Specify the relative path from the project to the test including the file name of the test. A test can be WebUI test, Compound test, Performance schedule or Accelerated Functional Test (AFT) suite. The test suite name must contain the file extension when it is an AFT suite. To run multiple tests from the same project sequentially, you must separate the tests by a colon (:). If you provide multiple tests, you cannot include an AFT suite along with it.

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

Specify the below inputs in the Key=Value format.
Ex: Key1=Value1|Key2=Value2

## Example usage

```yaml
name: WebUI Action

on: workflow_dispatch

jobs:

    WebUI-Action:
        runs-on: self-hosted
        name: Execute RPT Test
        steps:
         - name: RPT Action
           uses: SonaHJ/RPTAction@RPT_Release
          with:
            productpath: C:\Program Files\HCL\HCLOneTest
            imshared: C:\Program Files\HCL\HCLIMShared\plugins
            workspace: D:\workspace_pt
            project: Test
            suite: Test
```
