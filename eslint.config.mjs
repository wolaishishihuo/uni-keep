import uniHelper from "@uni-helper/eslint-config";

export default uniHelper({
  unocss: true,
  vue: true,
  markdown: false,
  format: true,
  stylistic: {
    semi: true,
    commaDangle: "none", // 多行时不要末尾逗号
  },
  ignores: ["src/uni_modules/", "dist", "src/style/iconfont/**"],
  rules: {
    "vue/block-order": ["error", { order: ["template", "script", "style"] }],

    "no-console": "off",
    "no-unused-vars": "off",
    "vue/no-unused-refs": "off",
    "unused-imports/no-unused-vars": "off",
    "eslint-comments/no-unlimited-disable": "off",
    "jsdoc/check-param-names": "off",
    "jsdoc/require-returns-description": "off",
    "ts/no-empty-object-type": "off",
    "no-extend-native": "off",
    // 强制设置末尾逗号规则
    "style/comma-dangle": ["error", "never"],
  },
});
