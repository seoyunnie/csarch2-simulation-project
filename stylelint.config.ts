import type { Config } from "stylelint";

export default {
  ignoreFiles: ["dist/**"],

  extends: ["stylelint-config-standard"],

  rules: {
    /* Deprecated */
    "selector-no-deprecated": true,

    /* Invalid */
    "selector-no-invalid": true,

    /* Pattern */
    "selector-class-pattern": null,
  },
} satisfies Config;
