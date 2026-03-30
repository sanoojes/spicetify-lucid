---
prev:
  text: Credits
  link: ./credits
---

# Uninstallation

Follow these steps to remove Lucid from your Spotify setup.

## Via Marketplace

1. Open Spotify and go to the **Marketplace** section
2. Navigate to the **Installed** tab
3. Find **Lucid** in the list
4. Click **Delete** or **Uninstall**

## Via CLI

1. Switch to a different theme:

   ```bash
   spicetify config current_theme ''
   ```

   Or switch to the default marketplace theme:

   ```bash
   spicetify config current_theme marketplace
   ```

2. Apply the changes:

   ```bash
   spicetify apply
   ```

3. Remove the theme files:

   :::code-group

   ```powershell [Windows]
   Remove-Item -Recurse -Force "$env:APPDATA\spicetify\Themes\Lucid"
   ```

   ```bash [Linux/macOS]
   rm -rf ~/.config/spicetify/Themes/Lucid
   ```

Use `spicetify config-dir` to locate your configuration folder if needed.

Lucid has been removed from your Spotify setup.
