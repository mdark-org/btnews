import { type App, inject } from "vue";

declare const __VUEPRESS_DEV__: boolean;
const commentSymbol = Symbol(__VUEPRESS_DEV__ ? "comment" : "");
export const useCommentOptions = <T>(): T =>
  inject(commentSymbol)!;

  type CommentOptions = any

declare const COMMENT_OPTIONS: CommentOptions;

const commentOptions = COMMENT_OPTIONS;

let comment: CommentOptions = commentOptions;
export const useWalineOptions = useCommentOptions<any>;
  export const injectCommentConfig = (app: App): void => {
    console.log(comment)
    app.provide(commentSymbol, comment);
  };