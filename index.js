// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

// Consts
const PLUGIN_NAME = 'gulp-text-editor-snipppets';

// Plugin level function(dealing with files)
function gulpin(obj) {

  if(obj.hasOwnProperty('dest')){
    mkdirp(obj.dest, function (err) {
      if (err){
        throw new gutil.PluginError(PLUGIN_NAME, err);
      }else{

        mkdirp(path.join(obj.dest,'sublime-snippets'), function(err){});

        mkdirp(path.join(obj.dest,'atom-snippets'), function(err){
          mkdirp(path.join(obj.dest,'atom-snippets','snippets'), function(err){});
        });

      }
    });
  }else{
    throw new gutil.PluginError(PLUGIN_NAME, 'no destination folder specified. use {dest:FOLDER}');
  }

  return through.obj(function(file, enc, cb) {



    var str = file.contents.toString();
    var arr = str.split('---');

    if(arr.length < 2){
      cb(null,file);
      return;
    }
    
    var metaArr = arr[0].split(/\n/);
    var content = arr[1];
    var meta = {};

    var len = metaArr.length;
    for(var ii = 0; ii < len; ii++){
      var cur = metaArr[ii];
      
      if(cur !== ''){
        var item = cur.split(/=(.+)/);
        if(item.length < 2){ continue; }
        meta[item[0]] = item[1];
      }

    }
    
    var snippetFileName = meta.hasOwnProperty('tab') ? meta.tab : 'snippet-' + new Date().getTime();

    fs.writeFile(path.join(obj.dest,'sublime-snippets',snippetFileName + '.sublime-snippet'), makeSublimeSnippet(meta,content), (err) => {
      if (err){
        throw new gutil.PluginError(PLUGIN_NAME, err);
      }
    });

    fs.writeFile(path.join(obj.dest,'atom-snippets','snippets',snippetFileName + '.cson'), makeAtomSnippet(meta,content), (err) => {
      if (err){
        throw new gutil.PluginError(PLUGIN_NAME, err);
      }
    });
  
    cb(null, file);
    return;

  });

}

// Exporting the plugin main function
module.exports = gulpin;

/*
tab=_boom
description=
scope=html,ejs
---
content

 */

/* atom
'.source.js':
  'Snippet Name':
    'prefix': 'hello'
    'body': 'Hello World!'
*/

/* sublime
<snippet>
    <content><![CDATA[Type your snippet here]]></content>
    <!-- Optional: Tab trigger to activate the snippet -->
    <tabTrigger>xyzzy</tabTrigger>
    <!-- Optional: Scope the tab trigger will be active in -->
    <scope>source.python</scope>
    <!-- Optional: Description to show in the menu -->
    <description>My Fancy Snippet</description>
</snippet>
 */
function makeAtomSnippet(meta,content){
  var snippet = '';
  snippet += "'.text."+meta.scope + "':";
  snippet += '\n';
  snippet += "\t'"+meta.description+ "':";
  snippet += '\n';
  snippet += "\t\t'prefix':'"+meta.tab+"'";
  snippet += '\n';
  snippet += "\t\t'body':\"\"\""+content+"\t\"\"\"";
  return snippet;
}

function makeSublimeSnippet(meta,content){
  var snippet = '<snippet>\n';
  for(var key in meta){
    if(meta.hasOwnProperty(key)){
      var value = meta[key];
      key = key == 'tab' ? 'tabTrigger' : key;
      snippet += '\t' + makeTag(key,value) + '\n';
    }
  }
  snippet += '\t'+ makeTag('content','<![CDATA['+content+']]>');
  snippet += '\n</snippet>';
  return snippet;
}

function makeTag(tag,content){
  return '<'+tag+'>'+content+'</'+tag+'>';
}