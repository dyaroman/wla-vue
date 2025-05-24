export function getQueryParamValue(targetKey: string): string | undefined {
  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of params) {
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      return value
    }
  }
}
