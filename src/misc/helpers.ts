export function getQueryParamValue(targetKey: string): string | undefined {
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
  const uniqueTags = websites.reduce((acc, website) => {
    website.tags.forEach((tag) => acc.add(tag))
    return acc
  }, new Set())
  return [...uniqueTags].sort()
}
