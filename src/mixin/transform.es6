import Promise from 'bluebird'
import _ from 'underscore'
import Parser from '../parser'
import { INJECTION_POINTS } from '../const'

const Transform = {
  _transform (src, data) {
    let { log } = this.hexo
    try {
      let doc = Parser.get().parse(src)
      if (!doc.isComplete) throw new Error('Incomplete document')
      return this._doTransform(doc, src, data)
    } catch (e) {
      log.debug(`[hexo-inject] SKIP: ${data.source}`)
      log.debug(e)
    }
    return src
  },
  async _doTransform (doc, src, data) {
    let { log } = this.hexo
    try {
      let injections = _.object(INJECTION_POINTS, INJECTION_POINTS.map(this._resolveInjectionPoint.bind(this, src)))
      let resolved = await Promise.props(injections)
      resolved = _.mapObject(resolved, (value) => {
        return _.chain(value)
          .filter(({ shouldInject }) => shouldInject)
          .pluck('html')
          .value()
      })

      doc.head.clearInjections()
      doc.body.clearInjections()

      doc.head.injectBefore(resolved['head_begin'])
      doc.head.injectAfter(resolved['head_end'])
      doc.body.injectBefore(resolved['body_begin'])
      doc.body.injectAfter(resolved['body_end'])

      if (!doc.head.validate()) {
        log.warn('[hexo-inject] rogue injection block detected in <head> section')
        log.debug(doc.head.content)
      }
      if (!doc.body.validate()) {
        log.warn('[hexo-inject] rogue injection block detected in <body> section')
        log.debug(doc.body.content)
      }

      src = doc.content
    } catch (e) {
      log.error(`[hexo-inject] Error injecting: ${data.source}`)
      log.error(e)
    }
    return src
  }
}

export default Transform
