const URI_PROTOCOL_REGEX = /([a-z]+):\/\//

class Url {
  constructor (url) {
    this.url = ''
    this.queryString = ''
    this.useProxy = false

    const elements = url.split('?')
    if (elements.length > 1) {
      this.url = elements[0]
      this.queryString = elements[1]
    } else {
      this.url = url
      this.queryString = ''
    }

    this.protocol = URI_PROTOCOL_REGEX.exec(url).splice(1).toString()
  }

  setProxy (isProxied) {
    this.useProxy = isProxied
  }

  getQueryString () {
    return this.queryString
  }

  getUrl () {
    return this.resolveChildUrl(this.url)
  }

  resolveChildUrl (childUrl) {
    let url = ''
    if (this.useProxy) {
      url = '/proxy/?url=' + encodeURIComponent(childUrl)
    } else {
      url = childUrl
    }

    if (this.queryString !== '') {
      url += `?${this.queryString}`
    }

    return url
  }
}

export default Url
