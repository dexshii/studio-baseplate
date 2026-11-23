# Studio Baseplate

A Roblox Studio inspired theme for the Claude desktop app, plus a small MP3 player.

Claude masaüstü uygulaması için Roblox Studio havasında bir tema ve küçük bir MP3 çalar.

## What it does

- **Colors:** Studio's dark grays in dark mode, Studio's light theme in light mode, with Studio blue as the accent.
- **Backdrop:** a baseplate stud grid with four floating isometric bricks. The blue one is "selected", with a dashed outline and move handles. Luau lines fall from the top and fade out on the way down, colored like the Studio script editor.
- **Messages:** your messages sit in boxes outlined in Studio blue, and tool rows use the code font.
- **Sound:** soft cues when you send a message, when Claude finishes, and when you click the backdrop. Turn them on with the speaker button in the session's title bar.
- **Music (`/studio-muzik`):** add your own MP3 files and play them while you work.

The theme draws in the desktop and mobile apps. The terminal draws no theme.

## Install

In a Claude Code terminal session:

```
/plugin install studio-baseplate --marketplace dexshii/studio-baseplate
```

Answer `y` to add the marketplace, then pick a scope.

## Music commands

| Command | What it does |
| --- | --- |
| `/studio-muzik` | lists your songs |
| `/studio-muzik ekle C:\Music\song.mp3` | copies an MP3 into the mod's music folder |
| `/studio-muzik cal 2` | plays song 2, then the rest in order, looping |
| `/studio-muzik sonraki` | skips to the next song |
| `/studio-muzik dur` | stops |
| `/studio-muzik ses 60` | sets the volume (0-100) |
| `/studio-muzik sil 1` | removes song 1 from the list (your original file stays) |

Songs are kept in the plugin's data folder, so they survive updates of the mod. On Windows they play through PowerShell's built-in media player; on macOS through the app's own audio playback.

## Notes

- Not affiliated with or endorsed by Roblox. All art here is original vector drawing; no Roblox logos or assets are used.
- The chat font can't be changed to a custom font file: themes can only pick the app's built-in font families.

## License

MIT
