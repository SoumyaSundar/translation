/*
 * This script integrates a PII shipment, with a returned structure sorted by langauge (CHS/, CHT/, DEU/, etc.) into the appropriate locations in all the repos.
 */
const fs = require('fs-extra')
var shell = require('shelljs')
var find = require('find');
const path = require('path')

// update this to the specific location of the unzipped shipment
const shipmentLocation = '/Users/IBM_ADMIN/workspace_neon/tmp/ui-shipment/IOT17AAP001_NLV_toDev_0815_UI'

// Create input folder
shell.mkdir('-p', 'input')

// Copy contents from shipment location to input folder
var inputFolder = path.join(`${shell.pwd()}`, 'input')
fs.copySync(shipmentLocation, inputFolder, { overwrite: true })

//Get GitHub directory
var GitHome = path.join(`${shell.pwd()}`,'../')
shell.echo("Nls folders will be exported to Github repos in: " + GitHome)

var re = new RegExp(/\-en.json$|\-en.ai$/);

const langToJsonFile = {
  CHS: 'messages-zh-hans.json',
  CHT: 'messages-zh-hant.json',
  DEU: 'messages-de.json',
  ESP: 'messages-es.json',
  FRA: 'messages-fr.json',
  ITA: 'messages-it.json',
  JPA: 'messages-ja.json',
  KOR: 'messages-ko.json',
  PTB: 'messages-pt-br.json'
}

const langToAIFile= {
  CHS: 'landing_flowchart-zh-hans.ai',
  CHT: 'landing_flowchart-zh-hant.ai',
  DEU: 'landing_flowchart-de.ai',
  ESP: 'landing_flowchart-es.ai',
  FRA: 'landing_flowchart-fr.ai',
  ITA: 'landing_flowchart-it.ai',
  JPA: 'landing_flowchart-ja.ai',
  KOR: 'landing_flowchart-ko.ai',
  PTB: 'landing_flowchart-pt-br.ai'
}

const langToMobileAIFile= {
  CHS: 'landing_flowchart_mobile-zh-hans.ai',
  CHT: 'landing_flowchart_mobile-zh-hant.ai',
  DEU: 'landing_flowchart_mobile-de.ai',
  ESP: 'landing_flowchart_mobile-es.ai',
  FRA: 'landing_flowchart_mobile-fr.ai',
  ITA: 'landing_flowchart_mobile-it.ai',
  JPA: 'landing_flowchart_mobile-ja.ai',
  KOR: 'landing_flowchart_mobile-ko.ai',
  PTB: 'landing_flowchart_mobile-pt-br.ai'
}

fs.readdirSync(inputFolder).forEach(lang => {
  var currentDir = path.join(`${inputFolder}`, `${lang}`)
  shell.cd(currentDir)
  var files = shell.find('.').filter(function(file) { return file.match(re) });
  files.forEach((file) => {
    var dir ="", newFile =""
    var exp = new RegExp(/[\w\-]*.[\w]*$/)

    // Substitutes for json and AI files
    if(file.match(/\mobile-en.ai$/)) {
      dir = file.replace(exp, '')
      newFile = dir + langToMobileAIFile[lang]
    } else if(file.match(/\-en.ai$/)) {
      dir = file.replace(exp, '')
      newFile = dir + langToAIFile[lang]
    } else {
      dir = file.replace(exp, '')
      newFile = dir + langToJsonFile[lang]
    }

    var outputFile = path.join(`${GitHome}`, `${newFile}`)
    console.log(outputFile)
    shell.cp(file, outputFile)
  });
});

shell.echo("Folders were merged")

