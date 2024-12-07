import { greet } from 'qvog-engine'

// get all arguments passed to the script
const args = process.argv
console.log(args);

console.log(greet('TypeScript'))
