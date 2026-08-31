---
layout: page
title: Starting with hexes and Godot
description: Why Rogue Provisions is beginning with a hexagonal world in Godot.
date: 2026-08-30
---

<div class="rogue-site">
  <nav class="rogue-nav" aria-label="Rogue Provisions">
    <a class="rogue-nav__brand" href="/projects/rogue-provisions/">Rogue Provisions</a>
    <div class="rogue-nav__links"><a href="/projects/rogue-provisions/about">About</a><a href="/projects/rogue-provisions/blog/">Blog</a><a href="/projects/rogue-provisions/screenshots">Screenshots</a></div>
  </nav>
  <article class="rogue-content rogue-article">

<p class="rogue-eyebrow">Development log · August 30, 2026</p>

# Starting with hexes and Godot

Rogue Provisions is going to be a 2D game built around a world of hexagonal tiles. We are still early, but that choice already gives the game a useful shape. A hex grid makes every neighboring space equally reachable, opens up interesting movement and placement decisions, and gives the map a character that a conventional square grid would not have.

The first goal is not to build the whole game at once. It is to establish the grid, make movement feel clear, and learn what kinds of interactions are enjoyable on it. Once those fundamentals work, we can begin layering in the systems that make the world worth exploring.

We are using Godot because it gives us a focused environment for building a 2D game without making the engine itself the project. Its scene system should let us keep tiles, actors, and interface elements modular, while its scripting workflow makes it quick to test an idea and throw it away when it does not work.

There are plenty of questions ahead: how much information each tile should communicate, how the camera should frame the board, and how movement should look and feel. For now, though, we have a direction: hexes, Godot, and a small playable foundation we can keep improving.

[← Back to the development blog](/projects/rogue-provisions/blog/)

  </article>
</div>
