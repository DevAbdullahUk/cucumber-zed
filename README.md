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
- Step text parameters highlighted separately: `"quoted strings"` and
  `<placeholders>` (e.g. in `Scenario Outline` steps)
- `As a`/`I want`/`So that` user-story lines in a `Feature` description are
  highlighted as documentation
- Outline/breadcrumb entries for Feature, Rule, Scenario, and Background
- Snippets: `feature`, `scenario`, `outline`, `background`, `given`, `when`, `then`

Out of scope for this version: a language server / step-definition navigation, and
non-English Gherkin keyword dialects.

## Installing

This extension isn't published to Zed's extension marketplace — install it as a dev
extension:

1. Clone this repo: `git clone https://github.com/DevAbdullahUk/cucumber-zed.git`
2. Open Zed
3. Open the command palette (`cmd-shift-p` / `ctrl-shift-p`) and run
   `zed: install dev extension`
4. Select the `cucumber-zed` directory you cloned
5. Open any `.feature` file — Zed should recognize it as Gherkin (check the language
   indicator in the bottom status bar)

If Zed reports a build/grammar error on install, check that
`extension.toml`'s `[grammars.gherkin]` `rev` still matches a commit that exists on
[tree-sitter-gherkin](https://github.com/DevAbdullahUk/tree-sitter-gherkin) — see
[Keeping the split grammar repo in sync](#keeping-the-split-grammar-repo-in-sync).

## Usage

Open or create a `.feature` file. `Feature`/`Rule`/`Background`/`Scenario`/`Scenario
Outline`/`Examples`/`Given`/`When`/`Then`/`And`/`But`, `@tags`, `# comments`, doc
strings, and data tables are all highlighted:

```gherkin
@smoke
Feature: Guess the word
  As a player
  I want to guess the secret word
  So that I can win the game

  Background: Common setup
    Given a logged in user

  Scenario: Adding a test case
    Given John Smith adds a test case named "Login Flow" to the test plan named "Regression Plan"

  Scenario Outline: Eating cucumbers
    Given there are <start> cucumbers
    When I eat <eat> cucumbers
    Then I should have <left> cucumbers

    Examples:
      | start | eat | left |
      |    12 |   5 |    7 |
```

`"Login Flow"`/`"Regression Plan"` and `<start>`/`<eat>`/`<left>` are highlighted as
parameters (distinct colors — quoted strings vs. placeholders); the `As a`/`I want`/`So
that` lines are highlighted as documentation.

Use the outline view (`cmd-shift-o` / `ctrl-shift-o`, or the breadcrumb bar) to jump
between Features, Rules, Scenarios, and Backgrounds in a file.

### Snippets

Type a prefix and hit tab to expand:

| Prefix | Expands to |
| --- | --- |
| `feature` | `Feature:` header with a description line and a starter Scenario |
| `scenario` | `Scenario:` with Given/When/Then |
| `outline` | `Scenario Outline:` with an Examples table (the `<param>` placeholder is linked between the step and the table header) |
| `background` | `Background:` block |
| `given` | a single `Given` step |
| `when` | a single `When` step |
| `then` | a single `Then` step |

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
