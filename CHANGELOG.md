# Changelog

### 2.8.1

* Add another talkstar s3 bucket, and ideas.ted.com to whitelist

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/2.8.0...2.8.1)

### 2.8.0

* Add a type definitions for TypeScript

### 2.7.0

* add userdata.amara.org to whitelist

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/2.6.0...2.7.0)

### 2.6.0

* add talkstar s3 bucket to whitelist

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/2.5.2...2.6.0)


### 2.5.2

* Use top-aligned crops for best fit by default

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/2.5.1...2.5.2)


### 2.5.1

* [#20](https://github.com/tedconf/js-crushinator-helpers/issues/20) Use top-aligned crops for best fit by default

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/2.5.0...2.5.1)

### 2.5.0

* [#10](https://github.com/tedconf/js-crushinator-helpers/issues/10) Support for additional Crushinator options
* [#18](https://github.com/tedconf/js-crushinator-helpers/issues/18) Add default options to the `crush` method

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/0bb7aa1...2.5.0)

### 2.4.0

* [#14](https://github.com/tedconf/js-crushinator-helpers/issues/14) Allow host override for local testing
* [#15](https://github.com/tedconf/js-crushinator-helpers/issues/15) Add "fit" option
* [#17](https://github.com/tedconf/js-crushinator-helpers/issues/17) Additional image hosts

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/e0c9c11...e8c1b57)

### 2.3.2

* [#13](https://github.com/tedconf/js-crushinator-helpers/pull/13) Add `Object.assign` polyfill

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/82d6435...078e1df)

### 2.3.1

* [#12](https://github.com/tedconf/js-crushinator-helpers/issues/12) Gracefully handle invalid input values

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/ecfe982...50d2beb)

### 2.3.0

* [#11](https://github.com/tedconf/js-crushinator-helpers/issues/11) Accommodate Crushinator's move to `pi.tedcdn.com`

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/fe06606...ea6c48c)

### 2.2.0

* [#5](https://github.com/tedconf/js-crushinator-helpers/issues/5) Allow hyphenated form for Crushinator options
* [#6](https://github.com/tedconf/js-crushinator-helpers/issues/6) Provide AMD-only distribution
* [#9](https://github.com/tedconf/js-crushinator-helpers/issues/9) Add option for custom query parameters
* [#7](https://github.com/tedconf/js-crushinator-helpers/issues/7) Deprecate direct use of string API for query params
* Add `pe.tedcdn.com` to our hosts whitelist

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/03b3c08...e19749f)

### 2.1.0

* [#3](https://github.com/tedconf/js-crushinator-helpers/issues/3) Add object form for Crushinator options
* Move transpiled builds from `lib/` to `dist/` in repo.

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/cb355a0...129f407)

### 2.0.1

* Fix build output to remove ES2015 keywords.
* Make package available on NPM and Bower.
* Add Travis configuration to test PRs.

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/ee3cf5e...cb355a0)

### 2.0.0

* Distribute transpiled ES5 instead of forcing consumers to transpile.
* Add filepicker.io to the hostname whitelist.
* Replace Grunt-based build system with simple NPM scripts.
* Update linter configuration to adopt Airbnb style guide.

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/69880f8...ee3cf5e)

### 1.1.0

* Replace regex-based hostname whitelist with strictly matching strings.
* Add TED2017 to the hostname whitelist.

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/fbccb73...69880f8)

### 1.0.2

Add Akamai and TED Live to the internal whitelist.

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/5c23356...fbccb73)

### 1.0.1

Fix Crushinator URLs to include the `/r/` path.

[(Commit list.)](https://github.com/tedconf/js-crushinator-helpers/compare/c7186ea...5c23356)

### 1.0.0

Initial release.
