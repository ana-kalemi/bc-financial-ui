const filePrefix = 'bcfui_';

const buildPaths = {
  prod: '/Users/jpmacprom1/Documents/Repos/github/NetSuite/Kirt/blue-collar-budget-module-ns/src/FileCabinet/SuiteScripts/BudgetCollarModule/BCFinancialToolSuitelet/BCFinancialToolAssets',
  dev: '/Users/jpmacprom1/Documents/Repos/github/NetSuite/Kirt/blue-collar-budget-module-ns/src/FileCabinet/SuiteScripts/BudgetCollarModule/BCFinancialToolSuitelet/BCFinancialToolAssetsDev',
};

module.exports = {
  filenameHashing: false,

  outputDir: buildPaths.dev, // Change to buildPaths.prod for production builds.

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // Prefix js files.
      config.output.filename = `${filePrefix}js/${filePrefix}[name].min.js`;
      config.output.chunkFilename = `${filePrefix}js/${filePrefix}[name].min.js`;
    }
  },

  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // Prefix css files.
      if (config.plugins.has('extract-css')) {
        const extractCSSPlugin = config.plugin('extract-css');

        if (extractCSSPlugin) {
          extractCSSPlugin.tap(() => [
            {
              filename: `${filePrefix}css/${filePrefix}[name].css`,
              chunkFilename: `${filePrefix}css/${filePrefix}[name].css`,
            },
          ]);
        }
      }
      // Change index.html name
      config
        .plugin('html')
        .tap((args) => {
          args[0].filename = `${filePrefix}index.html`;
          return args;
        });
    }
  },
};
