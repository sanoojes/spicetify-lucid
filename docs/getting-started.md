---
next:
  text: Screenshots
  link: ./screenshots
prev:
  text: Overview
  link: ./
---

# Getting Started

This guide covers how to install the Lucid theme for Spotify using Spicetify.

## Prerequisites

Before installing, ensure you have:

- **Spotify** (Desktop app) - [Download](https://www.spotify.com/download/)
- **Spicetify CLI** - [Installation guide](https://spicetify.app/docs/getting-started)
- **Bun** (optional, only for building from source) - [Installation guide](https://bun.sh)

## Installation Methods

Choose one of the methods below.

### Spicetify Marketplace

1. If you haven't already, install the [Spicetify Marketplace](https://github.com/spicetify/marketplace/wiki/Installation)
2. Open Spotify and navigate to the **Marketplace** section
3. Go to the **Themes** tab
4. Search for "Lucid" and click **Install**

The theme will be applied automatically.

### Build From Source

If you prefer to build from source, choose one of the methods below.

#### Option A: Auto-Install (Recommended)

1. Clone and install dependencies:

   ```bash
   git clone https://gitlab.com/sanoojes/spicetify-lucid.git
   cd spicetify-lucid
   bun install
   ```

2. Build and apply:

   ```bash
   bun run build -a
   ```

#### Option B: Manual Build

If you prefer manual control over the installation:

1. Clone and install dependencies:

   ```bash
   git clone https://gitlab.com/sanoojes/spicetify-lucid.git
   cd spicetify-lucid
   bun install
   ```

2. Build the theme:

   ```bash
   bun run build
   ```

   This creates the theme files in the `dist` folder.

3. Copy to Spicetify Themes directory:

   Use `spicetify config-dir` to find your Spicetify config folder.

   :::code-group

   ```powershell [Windows]
   Copy-Item -Recurse dist "$env:APPDATA\spicetify\Themes\Lucid"
   ```

   ```bash [Linux/macOS]
   cp -r dist/ ~/.config/spicetify/Themes/Lucid
   ```

4. Enable the theme:

   ```bash
   spicetify config current_theme Lucid
   ```

5. Apply changes:

   ```bash
   spicetify apply
   ```

The theme is now active.
