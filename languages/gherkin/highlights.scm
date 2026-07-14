"Feature" @keyword
"Rule" @keyword
"Background" @keyword
"Scenario" @keyword
"Scenario Outline" @keyword
"Examples" @keyword
(step_keyword) @keyword

(tag) @tag
(comment) @comment
(doc_string) @string
(quoted_string) @string
(parameter) @variable.parameter
(narrative_line) @comment

"|" @punctuation.special
":" @punctuation.delimiter

(feature name: (name_line) @type)
(rule_header name: (name_line) @type)
(scenario name: (name_line) @type)
(background name: (name_line) @type)
(examples name: (name_line) @type)
