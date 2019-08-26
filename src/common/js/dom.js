export function hasClass (el, className) {
  return el.classList.contain(className)
}

export function addClass (el, className) {
  return el.classList.add(className)
}

export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
