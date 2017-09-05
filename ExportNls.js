const fs = require('fs-extra')
var find = require('find');
const path = require('path')
var shell = require('shelljs')

var GitHome = path.join(`${shell.pwd()}`,'../')

var currentDir = path.join(`${shell.pwd()}`)

var exportPath = path.join(`${GitHome}`,"translation", "output")

//Check if directory is empty or delete folders
if(shell.test('-e', exportPath)) {
  shell.rm('-r', exportPath)
}
console.log(shell.test('-e', exportPath))

shell.mkdir('output')

shell.echo("Nls folders will be exported in: " + exportPath)


var dashboard = {key : path.join(`${GitHome}`, "ui-dashboard","src", "angular", "nls") , value : path.join("ui-dashboard","src", "angular", "nls")}

var homepage = {key: path.join(`${GitHome}`, "ui-homepage","src", "nls"), value: path.join("ui-homepage","src", "nls")}

var quickstart = {key: path.join(`${GitHome}`, "ui-quickstart", "src", "nls"), value: path.join("ui-quickstart", "src", "nls")}

var common = {key: path.join(`${GitHome}`, "iotcloud.ui.common","nls"), value: path.join("iotcloud.ui.common","nls")}

var re = new RegExp(/\-en.json$|\-en.ai$/);

var tranversePathArray = [dashboard, homepage, quickstart, common]

tranversePathArray.map((tranversePath) => {
  var outputFolder = path.join(`${exportPath}`, `${tranversePath.value}`)
  shell.mkdir('-p', outputFolder)  // Create output directories
  shell.cd(tranversePath.key)
  var files = shell.find('.').filter(function(file) { return file.match(re) });
  files.forEach((file) => {
    shell.cd(outputFolder)
    var outputFile = path.join(`${outputFolder}`, `${file}`)
    var exp = new RegExp(/[\w\-]*.[\w]*$/)
    var searchIndex = outputFile.search(exp)
    var intermediateDir = outputFile.substring(0, searchIndex);
    shell.mkdir('-p', intermediateDir)   // Create intermediate directories
    shell.cp('-R', path.join(`${tranversePath.key}`,file), outputFile)
  });
});

shell.echo("Folders were exported")