# Building

## Prerequisites

- Install [Node.js](https://nodejs.org/en/download/) 22.13.0 or later in the 22.x
  series, or any 24.x or 26.x release.

## Build

- Run `npm install`
- Run `npm run build`

The extension root is the [addon](addon/) directory which can be packaged/tested
as appropriate. A package is output in the `web-ext-artifacts` directory for
upload.

## Lint

- Run `npm run lint`

If there are errors:

- Run `npm run lint-fix`

Fixable errors will be resolved and unfixable ones will be output for manual
fixes.

## Test

- Run `npm test` for automated tests.

### Manual testing

### Firefox

- `npm start`

### Chrome

Enable developer mode and load the `addon` directory as an unpacked extension.
