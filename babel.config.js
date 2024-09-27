module.exports = {
  plugins: [
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: "css", // Automatically imports the CSS for the component
      },
    ],
  ],
};
