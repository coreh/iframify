# iframify

Wraps the given HTML code in an iframe that resizes dynamically to fit its contents.

Useful for displaying embeds that use `<script>` tags without exposing your page to foreign code.

## Usage:

```javascript
var iframe = iframify('<h1>Hello, World</h1>');
document.body.appendChild(iframe);
```


