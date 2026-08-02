(() => {
  const VERSION = 'tops-v4-responsive-models';
  const savedVersion = localStorage.getItem('topsPlatformVersion');
  if (savedVersion !== VERSION) {
    localStorage.removeItem('topsPlatformData');
    localStorage.setItem('topsPlatformVersion', VERSION);
  }
})();
