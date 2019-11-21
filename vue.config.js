const Path = require("path")
module.exports = {
  devServer: {
    port: process.env.VUE_APP_CLIENT_PORT,
    disableHostCheck: true,
  },
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: true
    }
  },
  configureWebpack: config => {
    config.module.rules.find(rule => rule.test.test("*.scss")).oneOf.forEach((item, index, array) => {
      array[index].use.push({
        loader: "sass-resources-loader",
        options: {
          resources: [
            Path.resolve(__dirname, "src/modules/oa/common.scss")
          ]
        }
      })
    })
    config.resolve.alias = {
      "src": Path.resolve(__dirname, "src"),
      "apollo-server": Path.resolve(__dirname, "apollo-server"),
      "types": Path.resolve(__dirname, "types"),
    }
  }

}