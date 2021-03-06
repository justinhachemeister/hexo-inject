import _ from 'underscore'
import Promise from 'bluebird'

const Register = {
  register () {
    let { hexo } = this
    let { filter } = hexo.extend
    hexo.inject = this
    filter.register('after_render:html', this._transform.bind(this))
    filter.register('after_init', () => {
      hexo.log.debug('[hexo-inject] firing inject_ready')
      hexo.execFilter('inject_ready', this, { context: hexo })
    })
    this.router.register()
  }
}

export default Register
