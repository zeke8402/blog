---
layout: page
title: "Devlog 01: Hexes, terrain, and clouds"
description: Building Rogue Provisions' first visible slice—from a debug hex grid to compressed terrain and procedural clouds.
date: 2026-08-30
---

<div class="rogue-site">
  <nav class="rogue-nav" aria-label="Rogue Provisions">
    <a class="rogue-nav__brand" href="/projects/rogue-provisions/">Rogue Provisions</a>
    <div class="rogue-nav__links"><a href="/projects/rogue-provisions/about">About</a><a href="/projects/rogue-provisions/blog/">Blog</a><a href="/projects/rogue-provisions/screenshots">Screenshots</a></div>
  </nav>
  <article class="rogue-content rogue-article">

<p class="rogue-eyebrow">Devlog 01 · August 30, 2026</p>

# Hexes, terrain, and clouds

Every game has a first moment when it stops being a collection of plans and starts looking like a place. For **Rogue Provisions**, that moment arrived with a field of hexes, two terrain textures, and clouds drifting slowly overhead.

This first development pass was about proving the visual foundation: establishing the map geometry, getting art through a repeatable pipeline, and adding one small atmospheric effect that makes the board feel less static.

## Establishing the grid

The starting point was a Godot debug layer that draws an eight-by-six, pointy-sided hex grid. Each cell is labeled by column and row so that positioning problems are visible immediately. Odd columns receive a half-tile vertical offset, while neighboring columns overlap by one quarter of a tile's width.

<figure class="rogue-media">
  <img src="/rogue-provisions/devlog-01/hex-debug-grid.png" alt="A cyan debug overlay showing an eight-column by six-row hexagonal grid with coordinate labels.">
  <figcaption>The first useful view: a coordinate-labeled grid for checking spacing and alignment.</figcaption>
</figure>

Those labels and bright cyan outlines are temporary, but they are useful scaffolding. Before characters, movement, or combat enter the picture, the grid needs to be predictable enough that every other system can trust it.

## From Pixaki to Godot

The terrain workflow starts with **144×144 pixel source tiles**. That gives me a consistent canvas to draw in Pixaki and matches the dimensions expected by the debug hex.

An exporter then performs the less intuitive part of the process. It compresses the source artwork vertically by two thirds—turning the artwork into a 144×96 strip—repeats that strip into a 144×144 output frame, and applies the hexagonal transparency mask. The final PNG still occupies a 144×144 frame, which keeps placement simple in Godot, while the artwork inside it carries the vertical compression.

That two-thirds vertical compression comes from [Mesilliac's Essay on Terrain Perspective](https://wiki.wesnoth.org/Mesilliac%27s_Essay_on_Terrain_Perspective) on the Battle for Wesnoth Wiki. Mesilliac explains the geometry behind Wesnoth's distinctive terrain perspective and how top-down artwork can be compressed to 66.67% of its original height to fit it. This project’s terrain exporter is a direct implementation of that idea at a 144-pixel scale.

The current loop is:

1. Draw a 144×144 tile in Pixaki.
2. Export it into the project's `uncompressed` art folder.
3. Run the terrain compression script.
4. Let Godot import the generated, masked PNG from the `compressed` folder.

Grass and dirt were the first two tiles through that pipeline. A seeded map generator now chooses between them across the grid, so the same test map can be reproduced while the rendering code changes.

Battle for Wesnoth is an important reference for this project, both in how a readable hex world can be constructed and through the open-source work its contributors have published. I am still learning what parts of its art workflow make sense for Rogue Provisions, so the current exporter is as much an experiment as it is a tool.

## Weather overhead

Once the terrain was in place, we added a procedural cloud layer. Each cloud begins as a seeded `FastNoiseLite` texture, shaped with an oval falloff so the noise resolves into an irregular cloud instead of filling a rectangle. The clouds receive small variations in size and speed, drift horizontally, and wrap back around when they leave the map.

Every bright cloud has a paired, translucent dark copy below it. The pair moves together, but the dark mask is offset across the terrain to read as a soft shadow. It is a simple effect, but it immediately gives the flat test board a sense of height and motion.

<figure class="rogue-media rogue-media--motion">
  <img src="/rogue-provisions/devlog-01/clouds-drifting.gif" alt="Animated procedural white clouds drifting over green and brown hex terrain while soft shadows move below them.">
  <figcaption>Seven seconds from the running Godot scene, cropped down to the game viewport and set to loop.</figcaption>
</figure>

<figure class="rogue-media">
  <img src="/rogue-provisions/devlog-01/clouds-over-terrain.png" alt="The current Rogue Provisions test map with grass and dirt hexes, coordinate labels, procedural clouds, and shadows.">
  <figcaption>The complete test scene so far: terrain, debug geometry, clouds, and their shadows.</figcaption>
</figure>

## What comes next

This is still a debug view. The coordinates and cyan outlines will not remain this loud forever, and the terrain palette, cloud shapes, density, and shadows all need tuning. But the important pieces now exist as separate layers: map geometry, source art, processed terrain, procedural placement, and atmosphere.

That is a modest first milestone, but it is enough to establish the rhythm of development: build a small system, make it visible, learn from it, and keep moving.

[← Back to the development blog](/projects/rogue-provisions/blog/)

  </article>
</div>
