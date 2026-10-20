/**
 * Inline script applied from the root <head> before first paint.
 *
 * Documentation pages default to dark mode when the visitor has never picked
 * a theme, matching the Social SDK reference design; every other page keeps
 * its light default. Stored choices always win. Keeping this in the root head
 * (instead of inside a React component) means it executes before the body
 * renders and React never warns about a script tag in component output.
 */
export const docsThemeBootstrapScript = `try{if(location.pathname.startsWith("/docs")&&localStorage.getItem("maillayer-docs-theme")===null){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark";}}catch{};`;
