# generator-xavdid

[![npm](https://img.shields.io/npm/v/generator-xavdid.svg)](https://npmjs.org/package/generator-xavdid)

## The Why

I've been writing a bunch of typescript and had gotten frustrated after setting up the same few tools, build steps, and testing frameworks repeatedly. So, I set up a generator to scaffold out projects just how I like them. Feel free to use it if you want to write typescript code using the same starting setup as I do! Also sets up my [eslint config](https://github.com/xavdid/eslint-config-xavdid).

Built on the awesome shoulders of [Yeoman](http://yeoman.io).

## Installation

First, install [Yeoman](http://yeoman.io) and `generator-xavdid` using the tool of your choice.

```bash
yarn global add yo generator-xavdid
```

Then, generate your new project:

```bash
yo xavdid
```

## Development

Most of the work will take place in `app/index.ts`, to focus there!

To test the unreleased version, run `yo ../path/to/this/folder`

## License

MIT © [David Brownman](https://xavd.id)
