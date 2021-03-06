---
title: Resilient Web Systems
sub: Upgrade your app with front-end training & consulting
author: miriam
card: feature
date: 2020-01-01
tags:
  - CSS
  - Sass
  - Design Systems
  - Component Libraries
  - Style Guides
events:
  - venue: Smashing Workshops
    url: https://smashingconf.com/online-workshops/workshops/miriam-suzanne
    date: 2020-05-07
    end: 2020-05-22
    adr: Online
image:
  src: blog/2019/mia-jen-smashing.jpg
  alt: Miriam talking with Jen Simmons and others
  position: top
  width: 1600
  height: 1067
modules:
  - title: CSS Fundamentals In-Depth
    text: |
      It's possible to write CSS for years
      without fully understanding
      the core features of the language:
      from the cascade & inheritance,
      to the declarative & contextual
      programming paradigm.
  - title: Resilient Code
    text: |
      Browser support & device compatibility
      don't have to be difficult and expensive.
      We'll cover a number of techniques
      for building more resilient and universal
      front end code,
      while taking advantage of new browser features
      as they become available.
  - title: Modern Layout
    text: |
      We'll cover the web layout system as a whole --
      grids, flow, flexbox, alignment,
      intrinsic sizing, and queries --
      showing when and how to mix and match techniques
      for fast and dynamic layouts.
  - title: Organizing Conventions
    text: |
      From OOCSS to ITCSS, SMACSS, BEM, and atomic design,
      there are a number of naming and organizing
      conventions that can help us write
      modular & maintainable CSS.
      We'll look at what these systems have in common,
      and how to adapt those principles for the needs
      of your team or project.
  - title: Design Systems
    text: |
      Reusable design & component systems
      can improve consistency,
      code-quality,
      and team communication.
      You don't need a dedicated team and budget
      to get started.
      We'll talk about planning and designing systems
      in an agile and integrated environment.
  - title: Documentation
    text: |
      Documentation is central to maintainable code,
      but how do we make sure the documentation
      itself is maintained and up-to-date?
      We'll look at workflow and tooling
      for automated and integrated style guides
      and documentation.
  - title: Tooling & Testing
    text: |
      The tools we use help define our workflow,
      and the long-term reliability of our code.
      Tools & tests should help encourage best-practice
      without locking us into antiquated systems.
      We'll talk about designing
      the right tooling and testing workflow
      for your team or project.
  - title: Team Process
    text: |
      Struggling with messy handoff
      or communication between designers & developers?
      We can help you find the
      practical workflows that keep your
      process running smoothly.
  - title: Using JS Frameworks
    text: |
      With the proliferation of modern JavaScript frameworks,
      we need to rethink exactly how the
      core web languages relate and work together.
      With some thoughtful integration
      we can take advantage of all the new power
      in tools like React and Vue
      without losing sight of what HTML & CSS provide.
  - title: Sass Modules & Pre-Processing
    text: |
      Sass has become one of the fundamental tools
      for writing clear & maintainable CSS,
      and is growing quickly
      with a new modular syntax,
      more powerful math,
      and new features landing regularly.
      We'll help you get the most out of
      everything Sass has to offer.
summary: |
  **Take full advantage of the universal web, and reduce maintenance over
  the long term** with resilient HTML, CSS, and JS systems. OddBird
  provides **in-depth workshops, with ongoing consulting** on front-end
  architecture and workflow --from advanced HTML/CSS to integrated design
  systems, component libraries, testing, and documentation.
---

{% import 'layout.macros.njk' as layout %}

The web platform is designed to be universally accessible and resilient
across a range of devices and interfaces. That presents a unique set of
challenges and opportunities for our web applications.

We offer 1-3 day workshops with ongoing consulting to help you take full
advantage of the web, improve team process, and reduce maintenance over
the long term. Prices are negotiable,
depending on the event size, location, and context.
[Contact us](/contact/) for details.

{{ layout.title('Choose Your Own Adventure') }}
{{ layout.grid(content=modules) }}
