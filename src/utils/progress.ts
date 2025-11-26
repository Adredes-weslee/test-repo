export const simulateProgress = (
  duration: number, // in ms
  onProgress: (progress: number) => void,
  targetProgress: number = 95
): number => {
  const intervalTime = 100; // update every 100ms
  let progress = 0;

  const progressInterval = window.setInterval(() => {
    // More natural easing
    const increment = (targetProgress - progress) * 0.1;
    progress = Math.min(targetProgress, progress + increment);
    
    if (progress >= targetProgress - 0.1) {
        progress = targetProgress;
        window.clearInterval(progressInterval);
    }
    onProgress(progress);
  }, intervalTime);

  return progressInterval;
};
