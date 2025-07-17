function mergeAndDeduplicateTags(tags1 = [], tags2 =[]) {
  const allTags = [...tags1, ...tags2];
  return [...new Set(allTags.map(tag => tag.toLowerCase()))];
}

module.exports = {mergeAndDeduplicateTags};