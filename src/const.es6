export const INJECTION_POINTS = [
  'head_begin',
  'head_end',
  'body_begin',
  'body_end'
]

export const REGEX = {
  head_begin        : /(<head.*>[\n\r\s\t]*)/i,
  head_end          : /([\n\r\s\t]*<\/head>)/i,
  body_begin        : /(<body.*>[\n\r\s\t]*)/i,
  body_end          : /([\n\r\s\t]*<\/body>)/i,
  injection_begin   : /(<!-- hexo-inject:begin -->)/i,
  injection_end     : /(<!-- hexo-inject:end -->)/i,
  stack_trace       : /\s+at(?:\s(\S*))?(?:\s\[as\s(\S*)\])?\s\(?(\S*?):(\d+):(\d+)\)?/
}

export const API = [
  'raw',
  'tag',
  'script',
  'style',
  'link',
  'require'
]
