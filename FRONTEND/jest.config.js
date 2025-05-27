export default {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  // Optional: If you face issues with ES Modules in dependencies, you might need transformIgnorePatterns
  // transformIgnorePatterns: [
  //   "/node_modules/(?!your-es-module-dependency)/",
  // ],
};
