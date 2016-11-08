const docFolder = './documents/';
const fs = require('fs');
const marked = require('marked');
const highlight = require('highlight.js');
const renderer = new marked.Renderer();

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code, lang) {
        return highlight.highlightAuto(code).value;
    }
});

var config = require('./manifest');
var docs = config.docs;

var files = [];
docs.forEach(file => {
    files.push(file.filename);
});

var navIds = [];
var bodyContent = '';
var codeTabs = [];

const lexer = new marked.Lexer();
// lexer.rules.bdoc = /^(\/{4} )(\w+).*$/;
console.log(marked.Lexer.prototype);
// console.log(lexer.rules);
// console.log(renderer.prototype);
// renderer.bdoc = function(text) {
//     console.log('34543534545435', text);
// };
// console.log(renderer);

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

renderer.blockquote = function(quote) {
    var bdregex = /(bdocs-tab:)[^\s]*/;
    var bdoc = quote.match(bdregex);
    if (bdoc) {
        var bdocTab = bdoc[0].split(':')[1];
        var bdquote = quote.replace(bdoc[0], '');
        return '<blockquote class="code-block ' + bdocTab + '">\n' + bdquote + '</blockquote>\n';
    } else {
        return '<blockquote>\n' + quote + '</blockquote>\n';
    }
};

renderer.code = function (code, lang, escaped) {
    var bdocGroup = lang.substring(0, lang.indexOf('_'));
    var bdocTab = bdocGroup.split(':')[1];
    var hlang = lang.substring(lang.indexOf('_')+1);

    if (renderer.options.highlight) {
        var out = renderer.options.highlight(code, hlang);
        if (out !== null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    var tabLang = hlang ? hlang : 'generic';
    if (codeTabs.indexOf(bdocTab) === -1) {
        codeTabs.push(bdocTab);
    }

    if (!hlang) {
        return '<pre class="code-block"><code class="generic">'
            + (escaped ? code : escape(code, true))
            + '\n</code></pre>';
    }

    return '<pre class="code-block '
        + bdocTab
        + '"><code class="'
        + renderer.options.langPrefix
        + escape(hlang, true)
        + '">'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>\n';
};

var path = docFolder;
var index = 0;
// Might need to make synchronous to preserver order of documents
files.forEach(file => {
    fs.readFile(path + file, 'utf8', function (err, data) {
        index++;
        bodyContent += (marked(data, { renderer: renderer }));
        if (index >= files.length) {
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
    return '<li class="nav-level-' + obj.level + '">' + '<a href="#' + obj.id + '" class="nav-item">' + obj.text + '</a></li>';
}

function generateCodeTabItems(tabs) {
    var codeTabList = '';
    tabs.forEach(tab => {
        codeTabList += generateCodeTab(tab);
    });
    return codeTabList;
}

function generateCodeTab(tab) {
    return '<li class="code-tab" id="' + tab + '">' + tab + '</li>';
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
<div id="page-content-wrapper" class="body-content container-fluid">${bodyContent}</div>
<div id="code-tabs-wrapper" class="code-tabs"><ul class="code-tab-list">${codeTabContent}</ul></div>
</div>
<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
<script src="actions.js"></script>
<script src="tabvisibility.js"></script>
</body>
</html>
`;
    fs.writeFile('index.html', doc, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("File saved!");
    });
}