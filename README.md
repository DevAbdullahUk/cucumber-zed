# Gherkin for Zed

Gherkin (Cucumber) language support for the [Zed](https://zed.dev) editor: syntax
highlighting, an outline view, and code snippets for `.feature` files.

## Status

⚠️ **Not yet installable in Zed.** The tree-sitter grammar lives in this repo under
`grammar/` for local development, but Zed extensions load grammars from a git
`repository` + `rev` that Zed clones directly — it can't point at a subfolder of this
repo. `extension.toml` currently has a placeholder grammar `repository`/`rev`. Once
`grammar/` is pushed out as its own repo (see [Splitting the grammar
repo](#splitting-the-grammar-into-its-own-repo) below), update those two fields and
this extension becomes installable as a Zed dev extension.

## Features

- Syntax highlighting for `Feature`, `Rule`, `Background`, `Scenario`, `Scenario
  Outline`, `Examples`, steps (`Given`/`When`/`Then`/`And`/`But`), `@tags`, `#
  comments`, doc strings (`"""..."""`), and data tables (`| ... |`)
- Outline/breadcrumb entries for Feature, Rule, Scenario, and Background
- Snippets: `feature`, `scenario`, `outline`, `background`, `given`, `when`, `then`

Out of scope for this version: a language server / step-definition navigation, and
non-English Gherkin keyword dialects.

## Installing (once the grammar repo is split out)

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

### Splitting the grammar into its own repo

Zed clones grammars by git URL, so `grammar/` needs to become its own repository
before this extension can be installed:

1. Push the contents of `grammar/` to a new repo (e.g. `tree-sitter-gherkin`)
2. Update `extension.toml`'s `[grammars.gherkin]` `repository` and `rev` to point at
   the pushed repo and a real commit SHA
3. Install this repo as a dev extension in Zed and confirm highlighting on a
   `.feature` file

## License

MIT — see [LICENSE](LICENSE)
