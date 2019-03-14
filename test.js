const expect = require('chai').expect

const jsonSchema = require('./index')

describe('The match() function', function() {
  it('Does not match undefined values in json with defined in schema', function() {
    const schema = {
      type: 'object',
      foo: {
        type: 'string'
      },
      bar: {
        type: 'string'
      }
    }

    const json = {
      bar: 'bor'
    }

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Matches defined values in json with defined in schema', function() {
    const schema = {
      type: 'object',
      foo: {
        type: 'string'
      },
      bar: {
        type: 'string'
      }
    }

    const json = {
      bar: 'bao',
      foo: 'for'
    }

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Matches object type in value with object type in schema', function() {
    const schema = {
      type: 'object',
      foo: {
        type: 'object',
        bar: {
          type: 'string'
        }
      }
    }

    const json = {
      foo: {
        bar: 'foobar'
      }
    }

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Does not match string value with object schema', function() {
    const schema = {
      type: 'object',
      foo: {
        type: 'object',
        bar: {
          type: 'string'
        }
      }
    }

    const json = {
      foo: 'thisisastring'
    }

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Does not match string schema to number value', function() {
    const schema = {
      type: 'string'
    }

    const json = 5

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Matches string schema to string value', function() {
    const schema = {
      type: 'string'
    }

    const json = 'thisisastring'

    expect(jsonSchema.match(json, schema).matched).to.equal(true)

  })

  it('Matches number value with number schema', function() {
    const schema = {
      type: 'number'
    }

    const json = -53.23

    expect(jsonSchema.match(json, schema).matched).to.equal(true);
  })

  it('Does not match string value with number schema', function() {
    const schema = {
      type: 'number'
    }

    const json = 'thisisastring'

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Matches integer value with integer schema', function() {
    const schema = {
      type: 'number',
      requires: [
        'integer'
      ]
    }

    const json = -32

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Does not match noninteger value with integer schema', function() {
    const schema = {
      type: 'number',
      requires: [
        'integer'
      ]
    }

    const json = 34352.64

    expect(jsonSchema.match(json, schema).matched).to.equal(false)

  })

  it('Matches nonnegative value with nonnegative schema', function() {
    const schema = {
      type: 'number',
      requires: [
        'nonnegative'
      ]
    }

    const json = 34352.64

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Does not match negative value with nonnegative schema', function() {
    const schema = {
      type: 'number',
      requires: [
        'nonnegative'
      ]
    }

    const json = -34352.64

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('With multiple requirements but only matching 1, returns false', function()  {
    const schema = {
      type: 'number',
      requires: [
        'nonnegative',
        'integer'
      ]
    }

    const json = 33.421

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('With multiple requirements and matching both, returns true', function()  {
    const schema = {
      type: 'number',
      requires: [
        'nonnegative',
        'integer'
      ]
    }

    const json = 334

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Allows a string that fits the required alphabet', function() {
    const schema = {
      type: 'string',
      alphabet: 'hetnskae-_$'
    }

    const json = 'the-snake'

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Does not allow a string that does not fit alphabet', function() {
    const schema = {
      type: 'string',
      alphabet: 'hetnskae-_$'
    }

    const json = 'the-snake#'

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Does not allow an array with schema as object', function() {
    const schema = {
      type: 'object'
    }

    const json = ['element', 'element2']

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Allows an array with no element schema', function() {
    const schema = {
      type: 'array'
    }

    const json = ['element', 'element2']

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Allows an array with correct elements', function() {
    const schema = {
      type: 'array',
      element: {
        type: 'string',
        alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789'
      }
    }

    const json = ['element', 'element2']

    expect(jsonSchema.match(json, schema).matched).to.equal(true)
  })

  it('Does not allow an array with incorrect elements', function() {
    const schema = {
      type: 'object',
      foo: {
        type: 'array',
        element: {
          type: 'string',
          alphabet: 'abcdefghijklmnopqrstuvwxyz'
        }
      }
    }

    const json = {
      foo:['element', 'element2']
    }

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
    expect(jsonSchema.match(json, schema).errorKey).to.equal('.foo[1]')
  })

  it('Does not allow a string that is too long', function() {
    const schema = {
      type: 'string',
      maxLength: 5
    }

    const json = 'toolong'

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })

  it('Does not allow a string that is too short', function() {
    const schema = {
      type: 'string',
      maxLength: 5,
      minLength: 3
    }

    const json = 'st'

    expect(jsonSchema.match(json, schema).matched).to.equal(false)
  })
})
