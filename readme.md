# mapez

Map source object into destination object with ease

## Installation

```
    npm i mapez
```

or

```
    yarn add mapez
```

## Usage

```js
import mapez from "mapez";

const result = mapez(source, spec);
```

A spec object key is the destination object key, and the value is selected value of the source object.

### Map source object property to destination object property

```js
const source = { foo: 1 };
const spec = {
  bar:
    // select foo value from source
    "foo",
};
const result = mapez(source, spec);
/*
    The result is
    {
        bar: 1
    }
 */
```

### Nested mapping

```js
const source = {
  name: "Box",
  width: 100,
  height: 100,
  category: { name: "Misc" },
};
const spec = {
  name: "name",
  // map category.name to category
  category: "category.name",
  // map width and height to dimension object
  dimension: {
    width: "width",
    height: "height",
  },
};
const result = mapez(source, spec);
/*
    The result is
    {
        name: 'Box',
        category: 'Misc',
        dimension: {
            width: 100,
            height: 100
        }
    }
 */
```

### Using transformer

```js
const source = { foo: 1 };
const spec = {
  visible: () => true,
  bar: (source) => source.foo * 2,
};
const result = mapez(source, spec);
/*
    The result is
    {
        visible: true,
        bar: 2
    }
 */
```

### Using transformer with selectors

```js
const source = { a: 1, b: 2 };
const spec = {
  sum: [
    // select a and b values from source
    "a",
    "b",
    // retrieve a and b values as transformer arguments
    (a, b) => a + b,
  ],
};
const result = mapez(source, spec);
/*
    The result is
    {
        sum: 3
    }
 */
```

### Extending destination object properties

```js
const source = {
  name: "Box",
  dimention: { data: { width: 100, height: 100 } },
  description: {
    data: { shortDescription: "hello", longDescription: "world" },
  },
};
const spec = { name: "name", "*": ["dimension.data", "description.data"] };
const result = mapez(source, spec);
/*
    The result is
    {
        name: 'Box',
        width: 100,
        height: 100,
        shortDescription: 'hello',
        longDescription: 'world'
    }
 */
```

## Syntactic sugar

### Selecting source object

```js
"*";
```

### Selecting property

```js
"propertyName";
```

### Selecting nested property

```js
"level1Property.level2Property";
```

### Selecting specified properties

Indicate included properties

```js
"dimension>width|height";
// source: { dimension: { width: 0, height: 0, depth: 0 } }
// value: { width: 0, height: 0 }
```

Indicate excluded properties

```js
"dimension!width|height";
// source: { dimension: { width: 0, height: 0, depth: 0 } }
// value: { depth: 0 }
```
