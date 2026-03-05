import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rawYaml = fs.readFileSync(
  path.join(__dirname, '../public/values.yaml'),
  'utf8'
)

console.log('File read successfully')
console.log('File size:', rawYaml.length, 'characters')

// Parse the YAML into a JavaScript object
const parsedYaml = yaml.load(rawYaml)

console.log('YAML parsed successfully')
console.log('Top level keys:', Object.keys(parsedYaml))




/*OBJECT FLATTENING */

// Flatten nested object into dot notation paths
function flattenObject(obj, parentPath = '') {
  const result = []

  for (const key of Object.keys(obj)) {
    // Build the full path for this key
    const currentPath = parentPath ? `${parentPath}.${key}` : key
    const value = obj[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // If the value is an object, go deeper
      const nested = flattenObject(value, currentPath)
      result.push(...nested)
    } else {
      // If the value is a primitive (string, number, boolean) or array, save it
      result.push({
        path: currentPath,
        default: value
      })
    }
  }

  return result
}

// Run the flattening
const flatFields = flattenObject(parsedYaml)

console.log('Total fields found:', flatFields.length)
console.log('First 5 fields:', flatFields.slice(0, 5))




/*COMMENTS PARSER */
// Parse ## @param comments from raw yaml text
function parseComments(rawText) {
  const result = {}
  const lines = rawText.split('\n')

  for (const line of lines) {
    if (line.includes('## @param')) {
      // Remove the ## @param part
      const content = line.replace(/.*##\s*@param\s+/, '').trim()
      
      // First word is the path, rest is the description
      const spaceIndex = content.indexOf(' ')
      
      if (spaceIndex !== -1) {
        const path = content.substring(0, spaceIndex)
        const description = content.substring(spaceIndex + 1).trim()
        result[path] = description
      }
    }
  }

  return result
}

const comments = parseComments(rawYaml)

console.log('Total comments found:', Object.keys(comments).length)
console.log('First 5 comments:', Object.entries(comments).slice(0, 5))


/*We have two lists, both using the path as the common key. We just merge them together. */
// Combine flat fields with comments
function combineFieldsAndComments(flatFields, comments) {
  return flatFields.map(field => {
    return {
      path: field.path,
      default: field.default,
      type: Array.isArray(field.default) 
        ? 'array' 
        : typeof field.default,
      description: comments[field.path] || ''
    }
  })
}

const schema = combineFieldsAndComments(flatFields, comments)

console.log('Total schema entries:', schema.length)
console.log('Sample entry:', schema[0])



/*WRITTING TO schema.json */

// Write schema to src/schema.json
const outputPath = path.join(__dirname, '../src/schema.json')

fs.writeFileSync(
  outputPath,
  JSON.stringify(schema, null, 2)
)

console.log('schema.json written successfully to src/schema.json')



/*values.yaml (212,687 chars)
        ↓
js-yaml parses structure → 994 fields with paths and defaults
        ↓
comment parser → 885 descriptions
        ↓
combine both
        ↓
schema.json (198,830 bytes) ← single source of truth*/