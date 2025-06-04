export function getQueryParamValue(targetKey) {
  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of params) {
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      return value
    }
  }
}

export function search(where, what) {
  where = String(where).toLowerCase()
  what = String(what).toLowerCase()

  if (what.startsWith('==')) {
    return where === what.slice(2)
  } else if (what.startsWith('!=')) {
    return where !== what.slice(2)
  } else {
    return where.includes(what)
  }
}

export function getUniqueTags(websites) {
  const uniqueTags =
    websites.reduce((acc, website) => {
      website.tags.forEach((tag) => acc.add(tag))
      return acc
    }, new Set()) ?? new Set()
  return [...uniqueTags].sort()
}

export function camelCaseToTitleCase(camelCaseString) {
  if (typeof camelCaseString !== 'string' || camelCaseString.length === 0) {
    return ''
  }

  // add a space before all uppercase letters that are not at the beginning
  const result = camelCaseString.replace(/([A-Z])/g, ' $1')

  // capitalize the first letter of the entire string and trim any leading space
  return result.charAt(0).toUpperCase() + result.slice(1).trim()
}

export function camelCaseToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function hex2rgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

// Calculate the luminance for a color.
// See https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
function luminance(color) {
  const _ = hex2rgb(color).map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return _[0] * 0.2126 + _[1] * 0.7152 + _[2] * 0.0722
}

// Calculate the contrast ratio between two colors.
// See https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
function contrast(back, front) {
  const backLum = luminance(back) + 0.05
  const frontLum = luminance(front) + 0.05

  return Math.max(backLum, frontLum) / Math.min(backLum, frontLum)
}

export function getContrastColor(color) {
  const lightContrast = contrast(color, '#fff')
  const darkContrast = contrast(color, '#000')

  return lightContrast > darkContrast ? '#fff' : '#000'
}
