Parser = require('../src/parser')
_ = require('underscore')

describe "Parser", ->
  parser = Parser.get()

  html = """\
    <!DOCTYPE html>
    <html>
      <head>
        <!-- hexo-inject:begin -->
        injected stuff at beginning
        <!-- hexo-inject:end -->
        <meta charset="utf-8">
        <title></title>
        <!-- hexo-inject:begin -->
        injected stuff at end
        <!-- hexo-inject:end -->
      </head>
      <body class='some-class'>
        <!-- hexo-inject:begin -->
        injected stuff at beginning
        <!-- hexo-inject:end -->
        <div>body and stuff</div>
        <!-- hexo-inject:begin -->
        injected stuff at end
        <!-- hexo-inject:end -->
      </body>
    </html>
    """

  it "._tokenize", ->
    tokens = parser._tokenize(html)
    content = ''
    _.pluck(tokens, 'type').should.deep.equal([
      'text',
      'head_begin'
      'injection_begin'
      'injection_text'
      'injection_end'
      'head_text'
      'injection_begin'
      'injection_text'
      'injection_end'
      'head_end'
      'text'
      'body_begin'
      'injection_begin'
      'injection_text'
      'injection_end'
      'body_text'
      'injection_begin'
      'injection_text'
      'injection_end'
      'body_end'
      'text'
    ])
    _.pluck(tokens, 'content').join('').should.equal(html)

  it ".parse", ->
    doc = parser.parse(html)
    doc.content.should.equal(html)
    doc.head.should.be.an('object')
    doc.body.should.be.an('object')
    doc.isComplete.should.be.true

  it ".parse - missing begin token", ->
    expect(-> parser.parse('</body>')).to.throw(SyntaxError, "No matching 'body_begin'")

  it ".parse - missing end token", ->
    expect(-> parser.parse('<body>')).to.throw(SyntaxError, "No matching 'body_end'")
