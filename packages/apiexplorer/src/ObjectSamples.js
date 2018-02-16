import Im from 'immutable'
// import XML from 'xml'

const primitives = {
  'string': () => 'string',
  'string_email': () => 'user@example.com',
  'string_date-time': () => new Date().toISOString(),
  'number': () => 0,
  'number_float': () => 0.0,
  'integer': () => 0,
  'boolean': (schema) => typeof schema.default === 'boolean' ? schema.default : true
}

const primitive = (schema) => {
  schema = objectify(schema)
  let { type, format } = schema

  let fn = primitives[`${type}_${format}`] || primitives[type]

  if (isFunc(fn)) {
    return fn(schema)
  }

  return 'Unknown Type: ' + schema.type
}

const isImmutable = (maybe) => Im.Iterable.isIterable(maybe)

function normalizeArray (arr) {
  if (Array.isArray(arr)) {
    return arr
  }
  return [arr]
}

function isObject (obj) {
  return !!obj && typeof obj === 'object'
}

function isFunc (thing) {
  return typeof (thing) === 'function'
}

function objectify (thing) {
  if (!isObject(thing)) {
    return {}
  }
  if (isImmutable(thing)) {
    return thing.toObject()
  }
  return thing
}

const sampleFromSchema = (schema, config = {}) => {
  let { type, example, properties, additionalProperties, items } = objectify(schema)
  let { includeReadOnly, includeWriteOnly } = config

  if (example !== undefined) {
    return example
  }

  if (!type) {
    if (properties) {
      type = 'object'
    } else if (items) {
      type = 'array'
    } else {
      return
    }
  }

  if (type === 'object') {
    let props = objectify(properties)
    let obj = {}
    for (var name in props) {
      if (props[name].readOnly && !includeReadOnly) {
        continue
      }
      if (props[name].writeOnly && !includeWriteOnly) {
        continue
      }
      obj[name] = sampleFromSchema(props[name], config)
    }

    if (additionalProperties === true) {
      obj.additionalProp1 = {}
    } else if (additionalProperties) {
      let additionalProps = objectify(additionalProperties)
      let additionalPropVal = sampleFromSchema(additionalProps, config)

      for (let i = 1; i < 4; i++) {
        obj['additionalProp' + i] = additionalPropVal
      }
    }
    return obj
  }

  if (type === 'array') {
    return [ sampleFromSchema(items, config) ]
  }

  if (schema['enum']) {
    if (schema['default']) {
      return schema['default']
    }
    return normalizeArray(schema['enum'])[0]
  }

  if (type === 'file') {
    return
  }

  return primitive(schema)
}

export const getSampleSchema = (schema, contentType = '', config = {}) => {
  return JSON.stringify(sampleFromSchema(schema, config), null, 2)
}
