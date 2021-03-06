import path from 'path'
import ViewPatch from './view'

export default function patch (hexo) {
  function requireSiteModule (m) {
    return require(path.join(hexo.base_dir, 'node_modules/', m))
  }

  let { log } = hexo
  let [major, minor] = hexo.version.split('.').map((v) => parseInt(v))
  if (major === 3 && minor === 2) {
    log.info(`[hexo-inject] installing hotfix for hexojs/hexo#1791`)
    ViewPatch(requireSiteModule('hexo/lib/theme/view'))
  }
}
