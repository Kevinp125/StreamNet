function mergeAndDeduplicateTags(tags1 = [], tags2 =[]) {
  const safeTag1 = Array.isArray(tags1) ? tags1 : [];
  const safeTag2 = Array.isArray(tags2) ? tags2 : [];
  
  const allTags = [...safeTag1, ...safeTag2];
  return [...new Set(allTags.map(tag => tag.toLowerCase()))];
}

module.exports = {mergeAndDeduplicateTags};