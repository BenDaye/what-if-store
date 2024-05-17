export function toPascalCase(str: string) {
  return str
    .replace(/\w+/g, function (word) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .replace(/\s+/g, '');
}
