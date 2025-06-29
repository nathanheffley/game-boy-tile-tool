# Game Boy Tile Tool

A modern, cross-platform Game Boy tile editor and layout tool for use with GBDK.

![A platformer tileset being edited inside of the tool.](assets/tile-editor.png)

## Features

Currently, the tool can create tilesheets. It lets you "export" your tilesheet to C source code for use with GBDK. This exporting happens via copying to the clipboard, although directly exporting to a file is planned.

There is also a basic tile map tool with adjustable width and height. You can place tiles from the tilesheet onto the tile map, and when using the copy to clipboard feature, it will also include the map as part of the exported source code.

You can drag an exported source code file into the tool to reopen it, assuming that it is still a valid tilesheet exported from the tool.

A dedicated saving feature is also possible in the future, although right now focus will be on parsing source code files as a form of loading.

## Running Locally

Install dependencies.

```bash
yarn
```

Run the app.

```bash
yarn start
```
