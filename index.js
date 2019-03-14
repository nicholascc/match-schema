
// Recursively iterates through object checking for schema
function match(value, schema) {
  if(value !== undefined) {
    if(schema.type === 'object') { // If it's an object, call match() for all ITS properties
      if(typeof value === 'object') {
        if(Object.prototype.toString.call(value) === '[object Array]') {  // Check if is array
          return {    // Don't accept arrays as objects
            matched: false,
            errorKey: undefined
          }
        } else {
          for (const key in schema) {
            if(key !== 'type' && key !== 'requires') {
              const {matched, errorKey} = match(value[key], schema[key]) // Here's the recursion
              if(!matched) {
                return {
                  matched: false,
                  errorKey: '.' + key + (errorKey || '')
                }
              }
            }
          }
        }
      } else {
        return {
          matched: false,
          errorKey: undefined
        }
      }
    } else if(schema.type === 'array') {
      if(Object.prototype.toString.call(value) === '[object Array]') {  // Check if is array
        if(schema.element) { // If using the element property to apply a schema to all elements of the array
          for(const i in value) {
            const {matched, errorKey} = match(value[i], schema.element);  // Here's more recursion
            if(!matched) {
              return {
                matched: false,
                errorKey: '[' + i + ']' + (errorKey || '')
              }
            }
          }
        }
      } else {
        return {    // Don't accept arrays as objects
          matched: false,
          errorKey: undefined
        }
      }
    } else if(schema.type === 'string') {            // For string
      if(typeof value === 'string') {
        if(schema.alphabet) {
          for(i in value) {
            const char = value[i];
            if(!schema.alphabet.includes(char)) {
              return {
                matched: false,
                errorKey: undefined
              }
            }
          }
        }

        if(schema.maxLength) {
          if(value.length > schema.maxLength) {
            return {
              matched: false,
              errorKey: undefined
            }
          }
        }

        if(schema.minLength) {
          if(value.length < schema.minLength) {
            return {
              matched: false,
              errorKey: undefined
            }
          }
        }
      } else {
        return {
          matched: false,
          errorKey: undefined
        }
      }
    } else if(schema.type === 'number') {             // For number
      if(typeof value === 'number') {
        if(schema.requires) {
          for(const i in schema.requires) { // Check for extra requirements like is integer or not, nonnegative, etc.
            if(schema.requires[i] === 'integer') {  // Check for integer
              if(value % 1 !== 0) {
                return {
                  matched: false,
                  errorKey: undefined
                }
              }
            } else if(schema.requires[i] === 'nonnegative') {
              if(value < 0) {
                return {
                  matched: false,
                  errorKey: undefined
                }
              }
            }
          }
        }
      } else {
        return {
          matched: false,
          errorKey: undefined
        }
      }
    }
  } else {
    return {
      matched: false,
      errorKey: undefined
    }
  }

  return {
    matched: true,
    errorKey: undefined
  }
}

module.exports = {
  match: match
}
