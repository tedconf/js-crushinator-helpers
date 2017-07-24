## Prerequisites

* This project uses [Yarn](https://yarnpkg.com/lang/en/docs/install/) for dependency management.
* [NVM](https://github.com/creationix/nvm) is recommended to make sure you have the correct Node version installed for local development.

## Installation

* `git clone git@github.com:tedconf/js-crushinator-helpers.git`
* Change into the new directory
* `yarn install`

## Running tests

`yarn test` will lint and test the library.

## Building

1. `yarn run build` to produce new JS in the `dist` directory
2. Update "version" in `package.json`
3. Add details of the new release to `CHANGELOG.md`
4. `git tag` the new semver
5. Push the master branch and new tag upstream to GitHub
6. [`npm publish`](https://docs.npmjs.com/getting-started/publishing-npm-packages) the updated node module
