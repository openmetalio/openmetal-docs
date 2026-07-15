// Custom markdownlint rule: flags image alt text that is a generic
// placeholder ("image", "screenshot", "figure 1", ...) instead of a
// description of what the image shows. Complements built-in MD045,
// which only catches images with no alt text at all.
"use strict";

const GENERIC_ALT = new RegExp(
  "^(?:" +
    [
      "image",
      "img",
      "screenshot",
      "screen shot",
      "picture",
      "pic",
      "photo",
      "photograph",
      "graphic",
      "figure",
      "fig",
      "diagram",
      "chart",
      "icon",
      "logo",
      "banner",
      "placeholder",
      "untitled",
      "alt(?:[- ]?text)?",
    ].join("|") +
    ")s?(?:[-_ ]*\\d+)?$",
  "i"
);

module.exports = {
  names: ["OM001", "no-generic-alt-text"],
  description: "Image alt text should describe the image, not be a generic placeholder",
  tags: ["accessibility", "images"],
  function: function noGenericAltText(params, onError) {
    for (const token of params.tokens) {
      if (token.type !== "inline" || !token.children) {
        continue;
      }
      for (const child of token.children) {
        if (child.type !== "image") {
          continue;
        }
        const alt = child.content.replace(/\s+/g, " ").trim();
        if (GENERIC_ALT.test(alt)) {
          onError({
            lineNumber: child.lineNumber,
            detail:
              'Alt text "' +
              alt +
              '" is a generic placeholder; describe what the image shows',
            context: "![" + alt + "]",
          });
        }
      }
    }
  },
};
