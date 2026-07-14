# Gherkin for Zed

Gherkin (Cucumber) language support for the [Zed](https://zed.dev) editor: syntax
highlighting, an outline view, and code snippets for `.feature` files.

## Status

The tree-sitter grammar has been split into its own repo,
[tree-sitter-gherkin](https://github.com/DevAbdullahUk/tree-sitter-gherkin), which
`extension.toml`'s `[grammars.gherkin]` points at (pinned to a commit SHA). The
`grammar/` folder still lives in this repo too, for local iteration and testing — see
[Development](#development) below. This extension is installable as a Zed dev
extension; see [Installing](#installing).

## Features

- Syntax highlighting for `Feature`, `Rule`, `Background`, `Scenario`, `Scenario
  Outline`, `Examples`, steps (`Given`/`When`/`Then`/`And`/`But`), `@tags`, `#
  comments`, doc strings (`"""..."""`), and data tables (`| ... |`)
- Outline/breadcrumb entries for Feature, Rule, Scenario, and Background
- Snippets: `feature`, `scenario`, `outline`, `background`, `given`, `when`, `then`

Out of scope for this version: a language server / step-definition navigation, and
non-English Gherkin keyword dialects.

## Installing

1. Open Zed
2. Run `zed: install dev extension` from the command palette
3. Select this repo's directory

## Development

### Grammar

The tree-sitter grammar lives in `grammar/` as its own npm project.

```bash
cd grammar
npm install
npm run generate   # regenerate the parser from grammar.js
npm test            # run the corpus tests in test/corpus/
```

To check parsing or a query file manually against the combined fixture:

```bash
./node_modules/.bin/tree-sitter parse test/fixtures/sample.feature
./node_modules/.bin/tree-sitter query ../languages/gherkin/highlights.scm test/fixtures/sample.feature
./node_modules/.bin/tree-sitter query ../languages/gherkin/outline.scm test/fixtures/sample.feature
```

A parse with any `ERROR` node, or output that changes between repeated runs on the
same file, means an ambiguity has crept into the grammar — see the comments on
`rule_header` and `examples` in `grammar/grammar.js` for the specific pattern to avoid
(giving two sibling rules in the same `repeat()` an overlapping optional `tag_list`
prefix breaks LR(1) parsing and produces GLR conflicts that don't always resolve the
same way twice).

### Keeping the split grammar repo in sync

Zed clones grammars by git URL, so the grammar lives in two places: `grammar/` here
(for local iteration/testing) and
[tree-sitter-gherkin](https://github.com/DevAbdullahUk/tree-sitter-gherkin) (what Zed
actually clones). After changing `grammar/` here:

1. Copy the changes into a checkout of `tree-sitter-gherkin` and push them
2. Update `extension.toml`'s `[grammars.gherkin]` `rev` to the new commit SHA
3. Install this repo as a dev extension in Zed and confirm highlighting on a
   `.feature` file

## License

MIT — see [LICENSE](LICENSE)
