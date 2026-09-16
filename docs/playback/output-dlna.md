---
title: "Audio output and DLNA"
sidebar_position: 6
---

For headphones or Bluetooth speakers, choose the output in your device's system audio controls. DLNA is a separate connection from Musiver to a compatible network renderer.

## Play through DLNA

1. Connect the device running Musiver and the renderer to a network where they can discover each other.
2. Open the player's casting/device selector and choose a discovered DLNA device.
3. Start a song and check playback on the renderer.
4. Use the remote volume control for the renderer. Its volume is separate from local playback volume.
5. Choose local playback to return to this device. Musiver stops the remote session when switching back.

The renderer must be able to access the supplied playback address. Discovery alone does not prove that audio delivery will work. Guest-network isolation and inaccessible server routes can prevent playback.

The Web app does not provide DLNA playback. Equalizer controls are unavailable while casting. Audio may be transcoded for device compatibility; casting is not a guarantee of original-format or lossless output.
