/**
Convert values from hyphenated form to an object tree, e.g.:

```
dehyphenate({
  'cat-ears': 'pointy',
  'cat-tail': 'whippy',
  'dog-ears': 'floppy',
  'dog-tail': 'swishy',
})
// => {
//      cat: { ears: 'pointy', tail: 'whippy' },
//      dog: { ears: 'floppy', 'tail: 'swishy' },
//    }
```
*/

export function dehyphenate(values) {
  const dehyphenated = {};

  Object.keys(values).forEach((key) => {
    const value = values[key];
    const splitted = key.match(/([^-]+)-+(.*)/);

    if (splitted) {
      dehyphenated[splitted[1]] = dehyphenated[splitted[1]] || {};
      dehyphenated[splitted[1]][splitted[2]] = value;
    } else {
      dehyphenated[key] = value;
    }
  });

  return dehyphenated;
}

export default dehyphenate;
