# HTML Offline Package

An offline package is an optional Windows x64 delivery for environments that cannot access the canonical repository or install dependencies. It must carry the same HTML component contracts, renderer, shared styles, Tokens, and Skill files. This compact Skill includes those source packages, and its HTML generation scripts, but it does not include a bundled Node runtime or preinstalled page-build dependencies needed for offline execution.

## Create and use

Build the package from a verified repository snapshot. Before distribution, unpack it into a clean path and confirm that it can create a project, generate HTML, build, and open the browser preview with its bundled Node runtime. Do not call it verified until that clean-machine check is recorded.

The package launcher supports doctor, new-project, fork-source, refresh-index, generate, build, and preview. Doctor proves package integrity, not page quality. Generated pages still need the Blueprint, Context Packet, Pattern, component-selection, Token, and browser evidence gates.

## Component changes

Use fork-source to make a writable copy before changing a shared component. Update the HTML contract, renderer, styles, and Tokens together; refresh the indexes; run the relevant repository validation; then return reviewed changes to the canonical source. Never edit the installed bundle in place.
