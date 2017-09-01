const fs = require('fs-extra')
var find = require('find');
const path = require('path')
var shell = require('shelljs')

shell.mkdir('-p', "output")

shell.cd('../')

var GitHome = shell.pwd()
//shell.echo(GitHome)

var exportPath = path.join(`${GitHome}`,"ExportScript", "output")

shell.echo("Nls folders will be exported in: " + exportPath)

// Check if directory is empty or delete folders
if(fs.existsSync(exportPath)) {
    fs.removeSync(exportPath)
}

//console.log(fs.existsSync(exportPath))

var dashboard = path.join("ui-dashboard","src", "angular", "nls")

var homepage = path.join("ui-homepage","src", "nls")

var quickstart = path.join("ui-quickstart", "src", "nls")

var common = path.join("iotcloud.ui.common","nls")

var re = new RegExp(/\-en.json$|\-en.ai$/);

var tranversePathArray = [dashboard, homepage, quickstart, common]

tranversePathArray.forEach((tranversePath) => {
  find.file(re, tranversePath, function(files) {
    //console.log(files);
    files.forEach((file) => {
      var outputFile = path.join(`${exportPath}`, `${file}`)
      //console.log(outputFile)
      fs.ensureFileSync(outputFile)
    });
  })
});

shell.echo("Folders were exported")