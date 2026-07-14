# Gherkin/Cucumber Zed Extension — Design

## Goal

A Zed editor extension that provides Gherkin (Cucumber) `.feature` file support: syntax
highlighting via a tree-sitter grammar, plus code snippets for common Gherkin constructs.

## Scope (v1)

In scope:
- Syntax highlighting for `.feature` files (English keywords only)
- Code snippets for common Gherkin blocks
- A working, testable tree-sitter grammar

Out of scope (deferred to later projects):
- Language server / step-definition navigation
- Non-English Gherkin keyword dialects (i18n)
- Step argument regex/parameter parsing

## Naming

- Extension id: `gherkin`
- Language name: `Gherkin`
- File extension: `.feature`

## Repository Layout

This repo (`cucumber-zed`) hosts the Zed extension. It also hosts the tree-sitter grammar
as a subfolder for now, since it needs local iteration and testing. Zed extensions must
reference grammars by git `repository` + `rev` (Zed clones the grammar repo directly), so
the `grammar/` folder is designed to be split out into its own repo and pushed to GitHub
later. Until that split happens, `extension.toml`'s grammar entry carries a placeholder
`repository` URL and `rev`, clearly marked TODO, and the extension will not build/install
in Zed until that's filled in with a real pushed repo.

```
cucumber-zed/
├── extension.toml
├── languages/
│   └── gherkin/
│       ├── config.toml
│       ├── highlights.scm
│       ├── snippets.json
│       └── outline.scm
├── grammar/
│   ├── grammar.js
│   ├── package.json
│   ├── src/                  (generated via `tree-sitter generate`)
│   └── test/corpus/          (tree-sitter test cases)
├── README.md
└── LICENSE
```

## Grammar

Tree-sitter grammar named `tree-sitter-gherkin`, English keywords only. Constructs covered:

- `Feature:` header + free-text description
- `Rule:`
- `Background:`
- `Scenario:` / `Scenario Outline:`
- `Examples:` (data table)
- Steps: `Given`, `When`, `Then`, `And`, `But`
- `@tags` (on Feature, Rule, Scenario, Examples)
- `# comments`
- Doc strings (`"""` or ` ``` ` delimited blocks)
- Data tables (`| cell | cell |` rows)

Grammar is developed and tested locally with the `tree-sitter` CLI (`tree-sitter generate`,
`tree-sitter test`) against corpus files in `grammar/test/corpus/`.

## Highlights

`languages/gherkin/highlights.scm` maps grammar nodes to Zed's standard capture names:

- `@keyword` — Feature/Rule/Background/Scenario/Scenario Outline/Examples/Given/When/Then/And/But
- `@tag` — `@tags`
- `@comment` — `# comments`
- `@string` — doc string contents
- `@punctuation.special` — table pipes `|`
- `@title` / `@type` — Feature and Scenario names

## Snippets

`languages/gherkin/snippets.json` defines tabstop-based templates for:

- `feature` — Feature header + description skeleton
- `scenario` — Scenario + Given/When/Then skeleton
- `outline` — Scenario Outline + Examples table skeleton
- `background` — Background block
- `given` / `when` / `then` — single step lines

## README

Root `README.md` covers: what the extension does, install instructions (Zed "Install Dev
Extension" pointed at this repo), current feature list, an explicit note that the grammar
repo split is pending (so highlighting won't work in Zed until that's done), and a
contribution note on running grammar tests (`cd grammar && tree-sitter test`).

## Testing / Validation

- Grammar: `tree-sitter test` against corpus files covering all constructs above.
- Extension: manual install as a Zed dev extension once the grammar repo split is complete;
  open a sample `.feature` file and confirm highlighting + snippet expansion.
