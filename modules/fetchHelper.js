var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

var sanitizeHtml = require('sanitize-html');

var request = require('request');

module.exports = {

    getPage: function(url, callback)
    {

        console.log("fetching: " + url);
        // use a timeout value of 10 seconds
        var timeoutInMilliseconds = 10 * 1000;
        var opts = {
            url: url,
            timeout: timeoutInMilliseconds
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
        console.log("sanitizing");
        var body = sanitizeHtml(html, {
            allowedTags: ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'],
            allowedAttributes: false
        });
        console.log("sanitized");
        return body;
    },

    applyXPath: function(body, path, callback) {
        console.log("applying Xpath: " + path);

        var doc = new dom().parseFromString(body);
        var nodes = xpath.select(path, doc);

        console.log("done, " + nodes.length + " results");

        callback(nodes);

    },

    applyEveryPath: function(url, body, paths, callback) {
    var results = [];
    var keys = Object.keys(paths);
    var timeout = keys.length*1000; // max 1 second for each xpath
    console.log(keys);
    for( var j = 0,length = keys.length; j < length; j++ ) {
        if (paths[keys[j]] == null) continue;
        paths[keys[j]] = paths[keys[j]].trim().replace(/(\r\n|\n|\r)/gm, "");
        this.applyXPath(body, paths[keys[j]], function (nodes) {
            console.log("path: " + paths[keys[j]]);
            console.log("returning from calls");
            if (typeof nodes != 'undefined' && typeof nodes[0] != 'undefined') {
                //console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
                console.log("node: " + nodes[0].toString());
                results.push({
                    outcome: 'success',
                    message: keys[j] + ": [ " + paths[keys[j]] + " -> " + nodes[0].localName + " ]: " + nodes[0].toString(),
                    url: url
                });
            }
            else results.push({outcome: 'warning', message: keys[j] + ": no results for " + paths[keys[j]], url: url});
        });
    }

    // since this library doesn't have callbacks I'll leave this here to wait for all the results to be processed
    while(timeout>0){
        if(results.length >= keys.length || timeout <= 1) {
            if(timeout <= 1) results[results.length] = {outcome: 'warning', message: "results truncated (page too big?)", url: url}
            callback(results);
            return;
        }
        timeout--;
    }
}

};