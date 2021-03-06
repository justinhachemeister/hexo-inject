Inject = require('../src/inject')
Promise = require('bluebird')
_ = require('underscore')
sinon = require('sinon')

describe 'Content', ->
  inject = new Inject()

  describe 'helper', ->
    beforeEach ->
      sinon.stub(inject, 'raw')
    afterEach ->
      inject.raw.restore()

    should_generate_raw_html = (expected) ->
      inject.raw.calledOnce.should.be.true
      inject.raw.calledWith('test').should.be.true
      [x, html, opts] = inject.raw.getCall(0).args
      html.should.be.a('function')
      expect(opts).to.be.undefined
      html().should.eventually.equal(expected)

    it 'tag', ->
      inject.tag('test', 'h1', class: 'foo', 'heading', true)
      should_generate_raw_html("<h1 class='foo'>heading</h1>")
    it 'script', ->
      inject.script('test', src: 'foo/bar.js')
      should_generate_raw_html("<script src='foo/bar.js'></script>")
    it 'script - with content', ->
      inject.script('test', type: 'text/test', 'this is a test')
      should_generate_raw_html("<script type='text/test'>this is a test</script>")
    it 'style', ->
      inject.style('test', media: 'screen', '* { display: none }')
      should_generate_raw_html("<style media='screen'>* { display: none }</style>")
    it 'link', ->
      inject.link('test', src: 'foo/style.css')
      should_generate_raw_html("<link src='foo/style.css'>")

  describe 'tag', ->
    src = 'foo bar baz'
    it '._buildHTMLTag - link', ->
      css_attrs =
        src: '/foo/bar.css'
        'data-foo': (s) ->
          s.should.equal(src)
          'foo'
        'data-bar': Promise.resolve('bar').delay(1000)
      inject._buildHTMLTag('link', css_attrs, null, false, src)
        .should.eventually.equal("<link src='/foo/bar.css' data-foo='foo' data-bar='bar'>")
    it '._buildHTMLTag - script', ->
      js_attrs =
        type: 'text/foo-config'
        'data-foo': (s) ->
          s.should.equal(src)
          'foo'
        'data-bar': Promise.resolve('bar').delay(1000)
      content = 'var foo = {}'

      getContent = (s) ->
        s.should.equal(src)
        content

      inject._buildHTMLTag('script', js_attrs, getContent, true, src)
        .should.eventually.equal("<script type='text/foo-config' data-foo='foo' data-bar='bar'>#{content}</script>")

  describe 'resolve', ->
    src = 'foo bar baz'
    it 'sync', ->
      content =
        html: 'html content'
        opts:
          shouldInject: false
      inject._resolveContent(src, content).should.eventually.deep.equal({
        html: content.html
        shouldInject: false
      })
      inject._resolveContent(src, _.omit(content, 'opts')).should.eventually.deep.equal({
        html: content.html
        shouldInject: true
      })
    it 'async - function', ->
      content =
        html: (s) ->
          s.should.equal(src)
          Promise.resolve('html content').delay(1000)
        opts:
          shouldInject: (s) ->
            s.should.equal(src)
            false
      inject._resolveContent(src, content).should.eventually.deep.equal({
        html: 'html content'
        shouldInject: false
      })
    it 'async - promise', ->
      content =
        html: Promise.resolve('html content').delay(1000)
        opts:
          shouldInject: Promise.resolve(false).delay(300)
      inject._resolveContent(src, content).should.eventually.deep.equal({
        html: 'html content'
        shouldInject: false
      })
