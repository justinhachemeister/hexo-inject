import path from 'path'
import Promise from 'bluebird'

export default function (View) {
  View.prototype._precompile = function() {
    var render = this._render;
    var ctx = render.context;
    var log = ctx.log;
    var ext = path.extname(this.path);
    var renderer = render.getRenderer(ext);
    var data = {
      path: this.source,
      text: this.data._content
    };

    function buildFilterArguments(result) {
      var output = render.getOutput(ext) || ext;
      return [
        'after_render:' + output,
        result,
        {
          context: ctx,
          args: [data]
        }
      ];
    }

    if (typeof renderer.compile === 'function') {
      var compiled = renderer.compile(data);

      this._compiledSync = function(locals) {
        var result = compiled(locals);
        log.debug('[hexo-inject] patched execFilterSync("after_render")');
        result = ctx.execFilterSync.apply(ctx, buildFilterArguments(result));
        return result
      };

      this._compiled = (function(locals) {
        return Promise.resolve(compiled(locals))
          .then(function(result) {
            log.debug('[hexo-inject] patched execFilter("after_render")');
            return ctx.execFilter.apply(ctx, buildFilterArguments(result));
          });
      });
    } else {
      this._compiledSync = function(locals) {
        return render.renderSync(data, locals);
      };

      this._compiled = function(locals) {
        return render.render(data, locals);
      };
    }
  };
}
