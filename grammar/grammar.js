module.exports = grammar({
  name: 'gherkin',

  extras: $ => [/[ \t\r\n]/, $.comment],

  rules: {
    source_file: $ => seq(
      optional($.tag_list),
      $.feature
    ),

    comment: $ => token(prec(1, seq('#', /[^\n]*/))),

    tag_list: $ => repeat1($.tag),
    tag: $ => token(prec(2, /@\S+/)),

    feature: $ => seq(
      'Feature', ':', field('name', $.name_line),
      optional($.description),
      optional($.background),
      repeat(choice($.rule_header, $.scenario))
    ),

    // A Rule is a flat header: the scenarios that follow it are its
    // siblings in `feature`'s repeat, not its children. Nesting scenarios
    // inside `rule` made "does this tag start a new scenario in the rule,
    // or end the rule" ambiguous at the same lookahead as the outer
    // feature-level choice, which produced unstable GLR parses on real
    // files. Flattening removes the ambiguity outright.
    rule_header: $ => seq(
      optional($.tag_list),
      token(prec(2, 'Rule')), ':', field('name', $.name_line),
      optional($.description)
    ),

    background: $ => seq(
      token(prec(2, 'Background')), ':', optional(field('name', $.name_line)),
      repeat($.step)
    ),

    scenario: $ => seq(
      optional($.tag_list),
      token(prec(2, 'Scenario')),
      ':', field('name', $.name_line),
      repeat($.step)
    ),

    step: $ => seq(
      field('keyword', $.step_keyword),
      field('text', $.step_text)
    ),

    step_keyword: $ => choice(
      token(prec(2, 'Given')),
      token(prec(2, 'When')),
      token(prec(2, 'Then')),
      token(prec(2, 'And')),
      token(prec(2, 'But')),
      token(prec(2, '*')),
    ),

    step_text: $ => token(prec(-1, /[^\n]+/)),

    name_line: $ => token(prec(-1, /[^\n]*/)),

    description: $ => repeat1($.description_line),

    description_line: $ => token(prec(-2, /[^\n@#|"][^\n]*/)),
  }
});
