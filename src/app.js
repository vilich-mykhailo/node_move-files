/* eslint-disable no-console */

const { rename } = require('fs/promises');
const { statSync, existsSync } = require('fs');
const path = require('path');

async function app() {
  const [source, destination] = process.argv.slice(2);

  if (!source || !destination) {
    throw new Error('Two arguments was needed');
  }

  if (!existsSync(source)) {
    throw new Error('Source file does not exist');
  }

  if (!statSync(source).isFile()) {
    throw new Error('I can move just files!');
  }

  const endsWithSlash = destination.endsWith(path.sep);
  const slicedDest = endsWithSlash
    ? destination.slice(0, -1)
    : destination;

  const parentDir = endsWithSlash
    ? slicedDest
    : path.dirname(slicedDest);

  if (!existsSync(parentDir) || !statSync(parentDir).isDirectory()) {
    throw new Error('Destination directory does not exist');
  }

  const finalDest = statSync(parentDir).isDirectory() && endsWithSlash
    ? path.join(parentDir, path.basename(source))
    : slicedDest;

await rename(source, finalDest);
console.log(`${source} was moved to ${destination}`);
}

try {
  app();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

module.exports = { app };
