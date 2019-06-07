# Chrome Extension Live Reloader

Watches for file changes in your extension's directory. When a change is detected, it reloads the extension and refreshes the active tab (to re-trigger the updated scripts).

Here's [a blog post explaining it](https://60devs.com/hot-reloading-for-chrome-extensions.html) (thanks to [KingOfNothing](https://habrahabr.ru/users/KingOfNothing/) for the translation).

## Features

- Works by checking timestamps of files
- Supports nested directories
- Automatically disables itself in production

## How to use

1. Drop [`live-reload.js`](https://github.com/ulken/crx-livereload/blob/master/live-reload.js) to your extension's directory.

2. Put the following into your `manifest.json` file:

```json
    "background": { "scripts": ["live-reload.js"] }
```

Also, you can simply clone this repository and use it as a boilerplate for your extension.
