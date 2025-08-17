export const getTernimalAssets = (ScriptMame: string): [string, string] => {
  var name = ScriptMame.toLowerCase();

  var iconName: string;
  var iconColor: string;

  if (
    name.includes("android") ||
    name.includes("ios") ||
    name.includes("mobile") ||
    name.includes("react-native") ||
    name.includes("expo") ||
    name.includes("rn") ||
    name.includes("reactnative") ||
    name.includes("expo-cli") ||
    name.includes("application") ||
    name.includes("app")
  ) {
    iconName = "device-mobile";
    iconColor = "terminal.ansiGreen";
  } else if (
    name.includes("electron") ||
    name.includes("desktop") ||
    name.includes("electron-app")
  ) {
    iconName = "window";
    iconColor = "terminal.ansiBlue";
  } else if (
    name.includes("web") ||
    name.includes("client") ||
    name.includes("frontend") ||
    name.includes("front-end") ||
    name.includes("react") ||
    name.includes("vue") ||
    name.includes("angular") ||
    name.includes("svelte") ||
    name.includes("next") ||
    name.includes("nuxt")
  ) {
    iconName = "globe";
    iconColor = "terminal.ansiCyan";
  } else if (
    name.includes("server") ||
    name.includes("backend") ||
    name.includes("api") ||
    name.includes("node") ||
    name.includes("express")
  ) {
    iconName = "server";
    iconColor = "terminal.ansiMagenta";
  } else if (
    name.includes("dev") ||
    name.includes("development") ||
    name.includes("dev-server") ||
    name.includes("development-server")
  ) {
    iconName = "tools";
    iconColor = "terminal.ansiYellow";
  } else if (
    name.includes("test") ||
    name.includes("testing") ||
    name.includes("jest") ||
    name.includes("mocha")
  ) {
    iconName = "check";
    iconColor = "terminal.ansiRed";
  } else if (name.includes("lint")) {
    iconName = "checklist";
    iconColor = "terminal.ansiGreen";
  } else if (
    name.includes("build") ||
    name.includes("compile") ||
    name.includes("bundle") ||
    name.includes("pack") ||
    name.includes("package") ||
    name.includes("webpack") ||
    name.includes("rollup") ||
    name.includes("gulp") ||
    name.includes("grunt")
  ) {
    iconName = "package";
    iconColor = "terminal.ansiBrightCyan";
  } else {
    iconName = "rocket";
    iconColor = "terminal.ansiWhite";
  }

  return [iconName, iconColor];
};
// src/ternimalAsset.ts
