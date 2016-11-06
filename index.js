const docFolder = './documents/';
const fs = require('fs');
const marked = require('marked');
const highlight = require('highlight.js');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang) {
    //   if (lang) {
    //       return highlight(code, lang);
    //   }
      return highlight.highlightAuto(code).value;
    // return require('highlight.js').highlightAuto(code).value;
  }
});
const renderer = new marked.Renderer();

var config = require('./manifest');
var docs = config.docs;

var files = [];
docs.forEach(file => {
    files.push(file.filename);
    // console.log(files.length);
});

var navIds = [];
var bodyContent = '';
var codeTabs = [];

renderer.heading = (text, level, raw) => {
    navIds.push(
        {
            id: raw.toLowerCase().replace(/[^\w]+/g, '-'),
            text: text,
            level: level
        }
    );
    return '<h'
        + level
        + ' id="'
        + renderer.options.headerPrefix
        + raw.toLowerCase().replace(/[^\w]+/g, '-')
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
};

renderer.code = function(code, lang, escaped) {
  if (renderer.options.highlight) {
    var out = renderer.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  var tabLang = lang ? lang : 'generic';
  if (codeTabs.indexOf(tabLang) === -1) {
    codeTabs.push(tabLang);
  }

  if (!lang) {
    return '<pre class="code-block"><code class="generic">'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre class="code-block"><code class="'
    + renderer.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

var path = docFolder;
var index = 0;
// Might need to make synchronous to preserver order of documents
files.forEach(file => {
    fs.readFile(path + file, 'utf8', function(err, data) {
        index++;
        bodyContent += (marked(data, { renderer: renderer }));
        if ( index >= files.length) {
            var navContent = generateNavItems(navIds);
            var codeTabContent = generateCodeTabItems(codeTabs);
            generateDoc(navContent, bodyContent, codeTabContent);
        }
    });
});

function generateNavItems(navObjs) {
    var navList = '';
    navObjs.forEach(obj => {
        navList += generateNav(obj);
    });
    return navList;
}

function generateNav(obj) {
    return '<li class="nav-level-' + obj.level + '">' + '<a " href="#' + obj.id + '">' + obj.text + '</a></li>';
}

function generateCodeTabItems(tabs) {
    var codeTabList = '';
    tabs.forEach(tab => {
        codeTabList += generateCodeTab(tab);
    });
    return codeTabList;
}

function generateCodeTab(tab) {
    return '<li class="code-tab">' + tab + '</li>';
}

function generateDoc(navContent, bodyContent, codeTabContent) {
    var doc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>title</title>
<link rel="shortcut icon" href="favicon.ico" type="image/vnd.microsoft.icon">
<link rel="stylesheet" href="stylesheet.css" type="text/css">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="./node_modules/highlight.js/styles/default.css" type="text/css">
</head>
<body>
<div id="wrapper">
<div id="sidebar-wrapper" class="side-nav"><ul class="sidebar-nav">${navContent}</ul></div>
<div id="page-content-wrapper" class="body-content"><div class="container-fluid">${bodyContent}</div></div>
<div id="code-tabs-wrapper" class="code-tabs"><ul class="code-tab-list">${codeTabContent}</ul></div>
</div>
</body>
</html>
`;
    fs.writeFile('index.html', doc, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("File saved!");
    });
}