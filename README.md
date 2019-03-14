# match-schema
An npm package for asserting that an object matches a schema

![](https://img.shields.io/appveyor/ci/gruntjs/grunt.svg) ![](https://img.shields.io/badge/license-MIT-green.svg)

## Check for objects matching a schema with ease!

```javascript
const matcher = require('match-schema')
const {matched, errorKey} = matcher.match(json, schema) // Checks if object json fits schema schema.

if(matched) {             // Matched is a true or false variable which tells whether the object in field json matched the schema provided
  console.log('Matched!');
} else {
  console.log('Failed at', errorKey) // If matched is false, then errorKey will be the property where the problem was. e.g. '.foo.bar'
}
```

## Installation:
```
npm install match-schema
```

## Syntax:

```javascript
const matcher = require('match-schema')

const schema = {
  type: 'object', // Makes sure that the object to be matched is an object. MAKE SURE TO DO THIS OR THE SCHEMA WILL ALWAYS MATCH!!!
  
  foo: {          // Makes sure that .foo is a string
    type: 'string'
  },
  bar: {          // Makes sure that .bar is a number
    type: 'number'
  },
  
  thisisanobject: {  // This will make sure that .thisisanobject is an object 
    type: 'object',
    
    aproperty: { // and .thisisanobject.aproperty is a string
      type: 'string'
    }
  },
  
  foobar: {     // Makes sure that .foobar is a number
    type: 'number',
    requires: [  // These are requirements specific to the above type, in this case number.
      'integer'  // Makes sure that .foobar is an integer
    ]
  },
  
  baz: {        // Makes sure that .baz is a nonnegative integer number.
    type: 'number',
    requires: [
      'integer',
      'nonnegative'
    ]
  },
  
  alphabetRestrictedString: {  // Makes sure that alphabetRestrictedString only uses letters from the lowercase alphabet.
    type: 'string',
    alphabet: 'abcdefghijklmnopqrstuvwxyz'
  }
}

const json = loadUntrustedJsonFileFromSomeFarawayPlace()

const {matched, errorKey} = matcher.match(json, schema) // Checks if object json fits schema schema.

if(matched) {             // Matched is a true or false variable which tells whether the object in field json matched the schema provided
  console.log('Matched!');
} else {
  console.log('Failed at', errorKey) // If matched is false, then errorKey will be the property where the problem was. e.g. '.foo.bar'
}
```

### Available Types and Requirements for Each:

`number` Possible requirements:
* `integer`
* `nonnegative`


`string` No possible requirements, but some additional `.alphabet` properties outside of `.type` and `.requires`:
* `.alphabet` - All characters which are legal to exist in the string.
* `.maxLength` - Maximum length of the string.
* `.minLength` - Minimum length of the string.
