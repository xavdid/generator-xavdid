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

### State of the Project

As of time of writing (`2023-08-21`) Yeoman is releasing it's 6.0.0 version and its docs are out of date. The package is back in working order on Node 18+, but the tests don't work.

I could update it to the new framework once everything is ironed out, but I might not be able to use `typed-install` in the same way.

I'm not sure if I wouldn't get better mileage out of a single clean build and a github template repository. Just in case, I've started one [here](https://github.com/xavdid/xavdid-ts-template).

## License

MIT © [David Brownman](https://xavd.id)
