declare module "desktop-screenshot" {
  export default (
    filename: string,
    config: { width: number; height: number; quality: number },
    callback: function,
  ) => null;
}
