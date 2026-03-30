import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lucid Theme",
  description:
    "A customizable fluent inspired theme for Spotify. Documentation for installation, customization, and configuration.",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "author", content: "Sanooj E Sanish" }],
    ["meta", { property: "og:url", content: "https://spicetify-lucid.sanooj.uk" }],
    [
      "script",
      {
        src: "https://static.cloudflareinsights.com/beacon.min.js",
        "data-cf-beacon": '{"token": "60008214101f4e6ba5eba5e01866f3a8"}',
        defer: "true",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Guide", link: "/getting-started" }],

    sidebar: [
      {
        text: "Lucid Theme",
        items: [
          { text: "Overview", link: "/" },
          { text: "Installation", link: "/getting-started" },
          { text: "Screenshots", link: "/screenshots" },
          { text: "Uninstallation", link: "/uninstallation" },
          { text: "Credits", link: "/credits" },
        ],
      },
    ],

    socialLinks: [
      { icon: "gitlab", link: "https://gitlab.com/sanoojes/spicetify-lucid" },
      {
        icon: "discord",
        link: "https://discord.gg/Jvw8KFe3xY",
      },
    ],
  },
});
