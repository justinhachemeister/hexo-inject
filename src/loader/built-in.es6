export default function registerBuiltInLoader (loader) {
  loader.register('.js', (content, opts) => {
    return opts.inline
      ? `<script>${content}</script>`
      : `<script src='${opts.src}'></script>`
  })
  loader.register('.css', (content, opts) => {
    return opts.inline
      ? `<style>${content}</style>`
      : `<link rel='stylesheet' href='${opts.src}'>`
  })
}
