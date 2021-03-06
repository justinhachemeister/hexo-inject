export default class Router {
  constructor (hexo) {
    this.hexo = hexo
    this._routes = []
  }
  register () {
    let { generator } = this.hexo.extend
    generator.register('inject', (locals) => this._routes)
  }
  serve (module, opts) {
    let src = opts.src || `/injected/${module.name}${module.ext}`
    let content = module.content
    this._routes.push({ path: src, data: () => content })
    return src
  }
}
