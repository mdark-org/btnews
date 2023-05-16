import { type PluginFunction } from "@vuepress/core";
import { getDirname, path } from "@vuepress/utils";
import { useSassPalettePlugin } from "vuepress-plugin-sass-palette";
import {
//   addCustomElement,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrExternal,
//   checkVersion,
//   getLocales,
} from "vuepress-shared/node";

// import { type CommentPluginOptions } from "./options.js";

const __dirname = getDirname(import.meta.url);

/** Comment Plugin */
export const commentPlugin =
  (options: any): PluginFunction =>
  (app) => {
    // remove locales so that they won’t be injected in client twice
    if (options.provider === "Waline" && "locales" in options)
      delete options.locales;

    useSassPalettePlugin(app, { id: "hope" });

    return {
      name: "waline-vuepress-plugin",

      alias: {
        // [`${PLUGIN_NAME}/provider`]: ${path.resolve(__dirname, "../client")}components/${provider}.js,
      },

      define: () => ({
        COMMENT_OPTIONS: options,
        ...({}),
      }),

      extendsBundlerOptions: (bundlerOptions: unknown, app): void => {
            addViteOptimizeDepsInclude(bundlerOptions, app, "autosize");
            addViteOptimizeDepsExclude(bundlerOptions, app, "@waline/client");
            addViteSsrExternal(bundlerOptions, app, "@waline/client");
      },

      clientConfigFile: path.resolve(__dirname, "../client/config.ts"),
    };
  };