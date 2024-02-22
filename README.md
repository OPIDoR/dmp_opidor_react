# Dynamic form generation

## Getting Started with dynamic form generation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## steps

- Copy the content of src file
- Copy the app.js
- Add this css to app.css

```sh
.outline-red {
  outline: 1px solid #dc3545;
}
```

- Add this to index.js

```sh
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Global from "./components/context/Global";
import { Toaster } from "react-hot-toast";
```

```jsx
<Global>
  <App />
  <Toaster position="top-center" reverseOrder={false} />
</Global>
```

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Global from "./components/context/Global";
import { Toaster } from "react-hot-toast";
import "./i18n";
import "react-tooltip/dist/react-tooltip.css";
```

- Add fontAwesome to index.html

```sh
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.2.0/css/all.min.css"
  integrity="sha512-6c4nX2tn5KbzeBJo9Ywpa0Gkt+mzCzJBrE1RB6fmpcsoN+b/w/euwIMuQKNyUoU/nToKN3a8SgNOtPrbW12fug=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
```

- Delete app.test.js

## Dependencies

Dynamic form generation uses a number of open source projects to work properly:

- [TinyMCE](https://www.tiny.cloud/docs/integrations/react/) - TinyMCE is a rich text editor extensible and Customizable.
- [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js.
- [react-bootstrap](https://react-bootstrap.github.io/) - React-Bootstrap replaces the Bootstrap JavaScript. Each component has been built from scratch as a true React component, without unneeded dependencies like jQuery!
- [dompurify](https://github.com/cure53/DOMPurify) - DOMPurify is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG.
- [i18next](https://www.i18next.com/) - i18next is a localization framework for internationalization and translation in software development.
- [moment](https://www.npmjs.com/package/moment) - JavaScript library for parsing, validating, manipulating, and formatting dates.
- [react-hot-toast](https://react-hot-toast.com/) - Add beautiful notifications to your React app with react-hot-toast. Lightweight. Smoking hot by default.
- [react-loader-spinner](https://www.npmjs.com/package/react-loader-spinner) - React-spinner-loader provides simple React SVG spinner component which can be implemented for async await operation before data loads to the view.
- [react-select](https://react-select.com/home) - A flexible and beautiful Select Input control for ReactJS with multiselect, autocomplete, async and creatable support.
- [sweetalert2](https://sweetalert2.github.io/) - A BEAUTIFUL, RESPONSIVE, CUSTOMIZABLE, ACCESSIBLE (WAI-ARIA) REPLACEMENT FOR JAVASCRIPT'S POPUP BOXES

## Installation

Dynamic form generation requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies .

```sh
npm i bootstrap@3.3.0
npm i react-bootstrap@0.33.1
npm i react-hot-toast sweetalert react-loader-spinner dompurify axios react-select moment
npm install --save @tinymce/tinymce-react react-tooltip
npm i i18next i18next-browser-languagedetector i18next-http-backend react-i18next
```

For developement testing environment...

```sh
npm install --save-dev @testing-library/react @testing-library/jest-dom react-test-renderer
npm install --save-dev enzyme @cfaester/enzyme-adapter-react-18
```

> Note: `Reactjs < 18` is required to install a enzyme adapter for every react js version.

```sh
npm install --save-dev npm i enzyme-adapter-react-16
```

## TinyMCE : Text editor

Create new account [tiny.cloud](https://www.tiny.cloud/) for the text editor.

Add domaine [tiny domaine](https://www.tiny.cloud/my-account/domains/).

> Note: `localhost` add it for testing.

## Development

By default, the react js app will expose port 3000.

Open your favorite Terminal and run these commands.

Run project:

```sh
npm start
```

Generating built files for distribution:

```sh
npm run build
```

(optional) run project with build files:

```sh
npx serve -s build
```

### Unit test

For developement:

> Note: `package.json` add this line to scripts.

```sh
"test": "react-scripts test --transformIgnorePatterns 'node_modules/(?!my-library-dir)/'",
```

run tests:

```sh
npm run test
```

## License

MIT

**Free Software, Hell Yeah!**
