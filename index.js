
// Recursively iterates through object checking for schema
function match(value, schema) {
  if(value !== undefined) {
    if(schema.type === 'object') { // If it's an object, call match() for all ITS properties
      if(typeof value === 'object') {
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
      } else {
        return {
          matched: false,
          errorKey: undefined
        }
      }
    } else if(schema.type === 'string') {            // For string
      if(typeof value === 'string') {
        if(schema.alphabet !== undefined) {
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
