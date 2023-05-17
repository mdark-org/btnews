import { type PluginFunction } from "@vuepress/core";
import { path } from "@vuepress/utils";
export const videoPlugin = (options: any): PluginFunction =>
  (app) => {
    return {
      name: "video-plugin",
      extendsMarkdown: (md) => {
      },
      clientConfigFile: path.resolve(__dirname, "../client/config.ts"),
    };
  };