/**
 * Module Dependencies
 */

var query = require('component-query');

/**
 * A script that periodically checks for changes in page height and notifies the parent
 */

var script = function(){
  var prevHeight, observer;
  var update = function() {
    var height = document.documentElement.getBoundingClientRect().height;
    if (height != prevHeight) {
      window.parent.postMessage({ message: 'iframify height', height: height }, '*');
      prevHeight = height;
    }
  }
  document.addEventListener('DOMContentLoaded', update);
  setInterval(update, 500);
  if (window.MutationObserver) {
    observer = new MutationObserver(update);
    observer.observe(document.documentElement, { childList: true, attributes: true, characterData: true });
  }
};

var PRELUDE = 'data:text/html;charset=utf-8,';
var DOCTYPE = escape('<!DOCTYPE html>');
var BASE = escape('<base href="' + window.location.origin + '" target="_blank">');
var STYLE = escape('<style> body { margin: 0 } </style>');
var SCRIPT = escape('<script>(' + script.toString() + ')();<' + '/script>');

/**
 * Global message handler for height change messages
 */

window.addEventListener('message', function(e) { 
  var iframes = query.all('iframe.iframify');
  for (var i = 0; i < iframes.length; i++) {
    var iframe = iframes[i];
    if (iframe.contentWindow == e.source) {
      switch (e.data.message) {
        case 'iframify height':
          if (iframe.style.height != e.data.height + 'px') {
            iframe.style.height = e.data.height + 'px';
            var ev = new CustomEvent("resize", { cancelable: false, bubbles: true });
            iframe.dispatchEvent(ev);
          }
          break;
      }
    }
  }
});

/**
 * Creates an iframe with the given HTML content
 */

function iframify(html) {
  var iframe = document.createElement('iframe');
  iframe.src = PRELUDE + DOCTYPE + BASE + STYLE + SCRIPT + escape(html);
  iframe.className = 'iframify';
  iframe.scrolling = 'no';
  iframe.style.background = 'transparent';
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '0px';
  iframe.style.display = 'block';
  return iframe;
}

module.exports = iframify;
