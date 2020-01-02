# Advent of Code to Markdown
Converts a given [Advent of Code](https://adventofcode.com) page to a
GitHub-compatible Markdown file.

## Installing

### Firefox

Binaries are available on the [Releases](https://github.com/kfarnung/aoc-to-markdown/releases) page.

### Chrome

The extension must be side-loaded using developer mode.

## Building

 - `npm install`
 - `npm run build`

The extension root is the [addon](addon/) folder which can be packaged/tested
as appropriate.

## Testing

### Firefox

- `npm start`

### Chrome

Enable developer mode and load the `addon` folder as an unpacked extension.

## Packaging/Signing

### Firefox

- Find your developer API key: https://addons.mozilla.org/en-US/developers/addon/api/key/
- Set the required environment variables:
  ```
  export AMO_JWT_ISSUER=<issuer>
  export AMO_JWT_SECRET=<secret>
  ```
- `npm run sign`
