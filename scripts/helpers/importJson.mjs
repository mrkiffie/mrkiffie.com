import { readFile } from 'fs/promises';

/**
 * @param {string} path
 * @param {string} base
 * @return {Promise<unknown>}
 */
export default async function (path, base = import.meta.url) {
  const file = await readFile(
    new URL(path, base)
  )
  return JSON.parse(file.toString());
}
