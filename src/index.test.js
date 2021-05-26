import mapez from "./index";

const testData = {
  str1: "a",
  str2: "b",
  bool1: true,
  bool2: false,
  arr1: [1, 2, 3, 4, 5],
  arr2: [
    { key: "a", value: 1 },
    { key: "b", value: 2 },
    { key: "c", value: 3 },
  ],
  nested: {
    level1: {
      level2: {
        a: 1,
        b: 2,
        c: 3,
      },
    },
  },
};

test("using transformer with selectors", () => {
  const expected = mapez(testData, [
    "arr1",
    (x) => x.reduce((a, b) => a + b, 0),
  ]);

  expect(expected).toBe(15);
});

test("using transformer with no selectors", () => {
  const expected = mapez(testData, (x) => x.str1);

  expect(expected).toBe("a");
});

test("complex mapping", () => {
  const expected = mapez(testData, {
    double: ["arr1", (arr) => arr.map((x) => x * 2)],
    toggle: ["bool1", (x) => !x],
    nested: "nested.level1.level2",
    nestedWithoutAB: "nested.level1.level2!a|b",
    nestedWithAB: "nested.level1.level2>a|b",
    extend: {
      custom: () => true,
      "*": "nested.level1.level2",
    },
    nothing: "abcxyz",
  });

  expect(expected).toEqual({
    double: [2, 4, 6, 8, 10],
    toggle: false,
    nested: {
      a: 1,
      b: 2,
      c: 3,
    },
    nestedWithoutAB: {
      c: 3,
    },
    nestedWithAB: {
      a: 1,
      b: 2,
    },
    extend: {
      custom: true,
      a: 1,
      b: 2,
      c: 3,
    },
    nothing: undefined,
  });
});

test("product mapping", () => {
  const product = {
    sku: "12345",
    upc: "99999912345X",
    title: "Test Item",
    description: "Description of test item",
    length: 5,
    width: 2,
    height: 8,
    inventory: {
      onHandQty: 12,
    },
  };
  const expected = mapez(product, {
    Envelope: {
      Request: {
        Item: {
          SKU: "sku",
          UPC: "upc",
          ShortTitle: "title",
          ShortDescription: "description",
          Dimensions: { Length: "length", Width: "width", Height: "height" },
          Inventory: "inventory.onHandQty",
        },
      },
    },
  });

  expect(expected).toEqual({
    Envelope: {
      Request: {
        Item: {
          SKU: "12345",
          UPC: "99999912345X",
          ShortTitle: "Test Item",
          ShortDescription: "Description of test item",
          Dimensions: {
            Length: 5,
            Width: 2,
            Height: 8,
          },
          Inventory: 12,
        },
      },
    },
  });
});

test("multiple transformers", () => {
  const source = { value: 1 };
  const add = (x) => x + 1;
  const double = (x) => x * 2;
  const expected = mapez(source, {
    r1: ["value", add],
    r2: ["value", double, add],
    r3: ["value", add, double],
  });
  expect(expected).toEqual({
    r1: 2,
    r2: 3,
    r3: 4,
  });
});
