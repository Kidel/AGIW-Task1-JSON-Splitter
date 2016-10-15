var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

var sanitizeHtml = require('sanitize-html');

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var request = require('request');

var fetchHelper = {

    getPage: function(url, callback)
    {

        console.log("fetching: " + url);
        // use a timeout value of 10 seconds
        var timeoutInMilliseconds = 10 * 1000;
        var opts = {
            url: url,
            timeout: timeoutInMilliseconds,
            headers: {'user-agent': 'node.js'}
        };

        request(opts, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(null, body);
                console.log("FETCHED");
            }
            else {
                if(typeof response == "undefined") {var response = {statusCode: "timeout"}}
                console.log("error fetching " + error + " --- " + response.statusCode);
                callback(error + response.statusCode, null);
            }
        });
    },

    sanitize: function(html) {
        var body = sanitizeHtml(html, {
            allowedTags: ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'],
            // all except iframe, style and script
            allowedAttributes: false
        });
        console.log("sanitized");
        return body;
    },

    applyXPath: function(doc, path, callback) {
        console.log("applying Xpath: " + path);
        var nodes = xpath.select(path, doc);
        console.log("done, " + nodes.length + " results");
        callback(nodes);
    },

    /*
     {"alibaba.com": {
     "52-camera": [
     {
     "rule": "//title/text()",
     "attribute_name": "Titolo"
     },
     {
     "rule": "//h1/text()",
     "attribute_name": "h1"
     }
     ]
     }
     }
    * */
    applyEveryPath: function(url, body, paths, callback) {
        var doc = new dom().parseFromString(body);
        var results = [];
        paths.forEach(function(pathObj, i) {
                if (pathObj["rule"] == null) return; //in array.forEach it's the same as 'continue' for a normal for
                var path = pathObj["rule"].trim().replace(/(\r\n|\n|\r)/gm, "");
                fetchHelper.applyXPath(doc, path, function (nodes) {
                    if (typeof nodes != 'undefined' && typeof nodes[0] != 'undefined') {
                        //console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
                        console.log("node: " + nodes[0].toString());
                        var app = {
                            outcome: 'success',
                            message: pathObj["attribute_name"] + ": [ " + path + " -> " + nodes[0].localName + " ]: " + entities.decode(nodes[0].toString()),
                            url: url,
                            object: {}
                        };
                        app.object[url] = {};
                        app.object[url][pathObj["attribute_name"]] = entities.decode(nodes[0].toString());
                        results.push(app);
                    }
                    else results.push({
                        outcome: 'warning',
                        message: pathObj["attribute_name"] + ": no results for " + path,
                        url: url,
                        object: {}
                    });
                });
                if (results.length > paths.length) return;
                if (i == paths.length - 1) callback(results);
            });
    }

};

module.exports = fetchHelper;