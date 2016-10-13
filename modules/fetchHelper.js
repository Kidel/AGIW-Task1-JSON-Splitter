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
            }
            else callback(error, null);
        });
    },

    sanitize: function(html) {
        var body = sanitizeHtml(html, {
            allowedTags: ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'],
            allowedAttributes: false
        });
        return body;
    },

    applyXPath: function(body, path) {
        var doc = new dom().parseFromString(body);
        var nodes = xpath.select(path, doc);

        console.log("path: " + path);

        return nodes;
    }

};