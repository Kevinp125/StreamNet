function analyzeActivityWindows(activites) {
  const windows = [
    { start: 0, end: 3, count: 0 },
    { start: 3, end: 6, count: 0 },
    { start: 6, end: 9, count: 0 },
    { start: 9, end: 12, count: 0 },
    { start: 12, end: 15, count: 0 },
    { start: 15, end: 18, count: 0 },
    { start: 18, end: 21, count: 0 },
    { start: 21, end: 24, count: 0 },
  ];

  activities.forEach((activity) => {
    const hour = new Date(activity.created_at).getHours();
    const window = windows.find((w) => hour >= w.start && hour < w.end);
    if (window) window.count++;
  });

  const activeWindow = windows.sort((a, b) => b.count - a.count)[0];
  return activeWindow;
}

module.exports = { analyzeActivityWindows };