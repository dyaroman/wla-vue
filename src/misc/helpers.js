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
