const docFolder = './documents/';
const fs = require('fs');
const marked = require('marked');
const highlight = require('highlight.js');
const renderer = new marked.Renderer();
const brodocDec = require('./markedDecorations.js');

// brodocDec.decorateMarked(renderer);

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
var fileArray = [];
docs.forEach(file => {
    files.push(file.filename);
    fileArray.push(file);
});

var navIds = [];
var bodyContent = '';
var codeTabs = [];

// const lexer = new marked.Lexer();
// lexer.rules.bdoc = /^(\/{4} )(\w+).*$/;

var idAffix = 0;
var uniqueNav = [];
renderer.heading = (text, level, raw) => {
    var id = raw.toLowerCase().replace(/[^\w]+/g, '-');
    if ((uniqueNav.indexOf(id) !== -1) && (level === 2)) {
        idAffix++;
        id += '-' + idAffix;
    } else {
        uniqueNav.push(id);
    }
    if (level < 3) {
        navIds.push(
            {
                id: id,
                text: text,
                level: level
            }
        );
    }
    return '<h'
        + level
        + ' id="'
        + renderer.options.headerPrefix
        + id
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
var fIndex = 0;
var rIndex = 0;
var fileObj = {toc: [], content: [], tabs: []};
fileArray.forEach((file, index) => {
    fs.readFile(path + file.filename, 'utf8', (err, data) => {
        rIndex++;
        file.content = data;

        if (rIndex >= files.length) {
            // do the things
            parseFileContent(fileArray);
            var navData = generateNavItems(navIds);
            var navContent = navData.content;
            var navDataArray = navData.navDataArray;
            var codeTabContent = generateCodeTabItems(codeTabs);
            var bodyContent = flattenContent(parsedContentArray);
            generateDoc(navContent, bodyContent, codeTabContent);
            generateNavJson(navDataArray);
        }
    });
});

function flattenContent(content) {
    var flattenedContent = content.reduce(function(accum, val) {
        return accum + val;
    });
    return flattenedContent;
}

var parsedContentArray = [];
function parseFileContent(files) {
    files.forEach((file, index) => {
        parsedContentArray[index] = parseDoc(file.content);
    });
}
function parseDoc(doc) {
    return marked(doc, { renderer: renderer });
}

function generateNavItems(navObjs) {
    var reversedNavs = navObjs.reverse();
    var currentNestArray = [];
    var currentStrongArray = [];
    var flattenedNest = '';
    var nestedNavArray = []; // Array containing generated html menu items - is flattened into a string.
    var navArrayInvert = []; // Deals with data layer of navigation;
    var navSectionArray = [];
    var navStrongSectionArray = [];
    var navSectionArrayClone;
    reversedNavs.forEach(obj => {
        var strong = (obj.id.indexOf('-strong-') !== -1);
        if (obj.level !== 1) {
            if (strong && currentNestArray.length !== 0) {
                flattenedNest = flattenContent(currentNestArray.reverse());
                currentStrongArray.push(generateNestedNav(obj, flattenedNest));
                currentNestArray.length = 0;

                navSectionArrayClone = Object.assign([], navSectionArray);
                console.log("$$$$$$    ", navSectionArray);
                navStrongSectionArray.push({section: obj.id, subsections: navSectionArrayClone});
                navSectionArray.length = 0;
            } else {
                currentNestArray.push(generateNav(obj));
                navSectionArray.push({section: obj.id});
            }
        } else if (obj.level === 1) {
            if (currentStrongArray.length !== 0) {
                currentNestArray.forEach(obj => {
                    currentStrongArray.push(obj);
                });
                flattenedNest = flattenContent(currentStrongArray.reverse());
            } else if (currentNestArray.length !== 0) {
                flattenedNest = flattenContent(currentNestArray.reverse());
            }
            nestedNavArray.push(generateNestedNav(obj, flattenedNest));
            currentNestArray.length = 0;
            currentStrongArray.length = 0;
            flattenedNest = '';

            navSectionArray.forEach(obj => {
                navStrongSectionArray.push(obj);
            });
            navSectionArrayClone = Object.assign([], navStrongSectionArray);
            navStrongSectionArray.length = 0;
            navArrayInvert.push({section: obj.id, subsections: navSectionArrayClone});
            navSectionArray.length = 0;
        }
    });
    
    var navContent = flattenContent(nestedNavArray.reverse());
    return {content: navContent, navDataArray: {toc: navArrayInvert}};
}

function generateNav(obj) {
    return '<li class="nav-level-' + obj.level + '">' + '<a href="#' + obj.id + '" class="nav-item">' + obj.text + '</a></li>';
}

function generateNestedNav(parent, nest) {
    var nestContent = '';
    if (nest.length > 0) {
        nestContent = nest ? '<ul id="' + parent.id + '-nav" style="display: none;">' + nest + '</ul>' : '';
    }
    return '<ul>' + generateNav(parent) + nestContent + '</ul>';
}

function generateNavJson(data) {
    var navJson = JSON.stringify(data);
    navScript = `(function(){navData = ${navJson}})();`;
    fs.writeFile('./navData.js', navScript, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("navData.js saved!");
    });
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
    var doc = 
`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>title</title>
<link rel="shortcut icon" href="favicon.ico" type="image/vnd.microsoft.icon">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="./node_modules/highlight.js/styles/default.css" type="text/css">
<link rel="stylesheet" href="github.css" type="text/css">
<link rel="stylesheet" href="stylesheet.css" type="text/css">
</head>
<body>
<div id="sidebar-wrapper" class="side-nav side-bar-nav">${navContent}</div>
<div id="wrapper">
<div id="code-tabs-wrapper" class="code-tabs"><ul class="code-tab-list">${codeTabContent}</ul></div>
<div id="page-content-wrapper" class="body-content container-fluid">${bodyContent}</div>
</div>
<script src="jquery-3.1.1.min.js"></script>
<script src="jquery.visible.min.js"></script>
<script src="navData.js"></script>
<script src="scroll.js"></script>
<!--<script src="actions.js"></script>-->
<script src="tabvisibility.js"></script>
</body>
</html>`;
    fs.writeFile('./index.html', doc, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("index.html saved!");
    });
}