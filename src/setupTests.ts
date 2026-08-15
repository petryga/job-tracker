import "@testing-library/jest-dom";

// jsdom 30's CSS.escape enforces a strict WebIDL brand check on `this`.
// MUI v4's styling engine (jss) reads it off the CSS namespace and calls it
// unbound, which real browsers tolerate but jsdom now rejects. Wrap it so any
// caller works regardless of how it's invoked. Drop this once MUI v4 is gone.
if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
  const nativeEscape = CSS.escape.bind(CSS);
  CSS.escape = (value: string) => nativeEscape(value);
}
