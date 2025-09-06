export async function api(path, options={}){
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) },
    ...options
  })
  if(!res.ok){
    const msg = await res.text()
    throw new Error(msg || 'Request failed')
  }
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}
