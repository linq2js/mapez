function mapez(source, specs = {}) {
  // if (arguments.length < 2) {
  //   specs = source;
  //   return (inputSource) => select(inputSource, specs);
  // }
  return select(source, specs);
}

function select(source, selector, key) {
  if (selector === true) {
    selector = key;
  }
  const selectorType = typeof selector;

  if (selectorType === "function") {
    return selector(source);
  }

  /**
   * syntactic sugar:
   *  all properties: *
   *  drill down properties: prop1.prop2.prop3
   *  excluded properties: !prop1|prop2
   *  sample: select prop1.prop2.prop3 except prop4 and prop5
   *  prop1.prop2.prop3!prop4|prop5
   *
   */
  if (selectorType === "string") {
    let [path, sep, execludeOrIncludeProps] = selector.split(/([>!])/);
    if (!path) path = "*";
    let selectedSource;
    switch (path) {
      case "*":
        selectedSource = source;
        break;
      // access select fn
      case "#select":
        selectedSource = select;
        break;
      default:
        const parts = path.split(".");
        selectedSource = parts.reduce((obj, prop) => {
          if (obj && typeof obj === "object") {
            return obj[prop];
          }
          return undefined;
        }, source);
    }

    if (!execludeOrIncludeProps) return selectedSource;

    const propNames = execludeOrIncludeProps.split("|");
    const isExclude = sep === "!";

    return Object.keys(selectedSource).reduce((obj, prop) => {
      if (
        (isExclude && !propNames.includes(prop)) ||
        (!isExclude && propNames.includes(prop))
      ) {
        obj[prop] = selectedSource[prop];
      }
      return obj;
    }, {});
  }

  if (Array.isArray(selector)) {
    const f = selector[selector.length - 1];
    const selectors = selector.slice(0, selector.length - 1);
    return f(...selectors.map((x) => select(source, x)));
  }

  if (selectorType === "object") {
    const result = {};
    let extend = null;
    Object.entries(selector).forEach(([prop, selector]) => {
      if (prop === "*") {
        extend = selector;
        return;
      }
      result[prop] = select(source, selector, prop);
    });
    if (extend) {
      // merge all selected sources
      if (
        Array.isArray(extend) &&
        typeof extend[extend.length - 1] !== "function"
      ) {
        Object.assign(result, ...extend.map((x) => select(source, x)));
      } else {
        Object.assign(result, select(source, extend));
      }
    }
    return result;
  }
  throw new Error("Invalid selector");
}

export default mapez;
