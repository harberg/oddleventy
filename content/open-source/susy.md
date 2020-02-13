---
title: Susy
sub: CSS layout framework
date: 2009-07-13
end: ongoing
logo: susy
image:
  type: media
  svg: logos/susy-mark
author:
  - miriam
  - oddbird
oss: owner
tags:
  - _post
  - Open Source
  - OddTools
  - Sass
  - Layout
links:
  source: https://github.com/oddbird/susy
  docs: /susy/docs/
screenshots:
  - img: susy/screenshots/sasslang.jpg
    alt: Sass
  - img: susy/screenshots/virginamerica.jpg
    alt: Virgin America
  - img: susy/screenshots/squaremarket.jpg
    alt: Square Market
  - img: susy/screenshots/esquire.jpg
    alt: Esquire UK
  - img: susy/screenshots/python.jpg
    alt: Python
  - img: susy/screenshots/mediamolecule.jpg
    alt: Media Molecule
  - img: susy/screenshots/simple.jpg
    alt: Simple
  - img: susy/screenshots/smithsonian.jpg
    alt: Smithsonian
press:
  - text: I like the idea of grids-on-demand, rather than a strict framework.
    name: Chris Coyier
    role: CSS-Tricks
    url: http://css-tricks.com/build-web-layouts-easily-susy/
    slug: on-demand
  - text: |
      My experiments have left me impressed.
      The current state of CSS layout
      means that unless you like to spend a lot of time doing calculations
      something like Susy is really useful.
      The output CSS is pretty much what I'd come up with myself,
      which to me is the acid test for tool use.
    name: Rachel Andrew
    role: Invited Expert to the CSS Working Group
    url: https://rachelandrew.co.uk/archives/2015/02/04/css-grid-layout-creating-complex-grids/
    slug: impressed
  - text: |
      If you're interested in reading Sass poetry,
      be sure to look at Susy's source code!
    name: Hugo Giraudel
    role: SitePoint
    url: http://www.sitepoint.com/my-favorite-sass-tools/
    slug: poetry
  - text: |
      **Susy** & **Zendesk** have been getting along magically.
      It's precisely what you need, and nothing more.
    name: Stephany Varga
    role: Zendesk Creative Collection
    url: https://medium.com/zendesk-creative-blog/responsive-a-harrowing-meditation-on-the-brutal-realities-of-web-content-organization-in-5-acts-1d33ce25f062
    slug: zendesk
badges:
  - name: npm
    src: https://badge.fury.io/js/susy.svg
    url: https://www.npmjs.com/package/susy
  - name: build
    src: https://travis-ci.org/oddbird/susy.svg
    url: https://travis-ci.org/oddbird/susy
summary: |
  **Susy was a responsive layout engine for Sass**,
  before `flexbox` and CSS `grid` were availabe.
  These days, we recommend letting the browser handle your layouts.
  If you need help moving off Susy,
  or learning the latest in web layout,
  **we offer [workshops](#@@@)
  and [consulting](#@@@)
  to help bring you up-to-date**.
---

{% import 'embed.macros.njk' as embed %}
{% import 'quotes.macros.njk' as quotes %}

## Lightweight & Flexible

Not everyone can play with the latest specs,
and there will always be edge-cases that require manual grid-math.
Susy3 is trimmed down to the most basic features: a lightweight library
of functions that can be used along with `float`, or `flexbox` or any
other CSS -- anywhere, any time.

Susy is also available in the [CodeKit] editor, with 10% of your
purchase going to [Black Girls Code]
when you follow the link from our site.
You can also still access [Susy2 documentation](https://susy.readthedocs.io/)
if necessary.

{{ embed.figure(
  screenshots,
  'A few of the sites (mobile & desktop) that were built with Susy'
) }}

{{ quotes.grid(press) }}

[CodeKit]: https://codekitapp.com/index.html?referrer=susy
[Black Girls Code]: http://blackgirlscode.com

{% call embed.media_block(
  media=embed.img(
    src='susy/book-cover.png',
    alt='Learning Susy, by Zell Liew'
  ),
  attrs={'data-block': 'center media-page rotate'}
) %}

## Learning Susy (v2)

[Zell Liew] wrote a great book to get you started with Susy.
This book will teach you everything you need to know.
After going through the book and videos,
you’ll never have to pore over the documentation
or spend hours searching through Stackoverflow
to figure out how to make Susy work ever again.

[Get the first seven chapters for free][]!

[Zell Liew]: https://zellwk.com/
[Get the first seven chapters for free]: https://learnsusy.zellwk.com/

{% endcall %}