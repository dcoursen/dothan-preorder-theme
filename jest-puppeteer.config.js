module.exports = {
  launch: {
    headless: false, // Set to true for CI/automated testing
    slowMo: 50, // Slow down actions by 50ms to make tests more visible
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080'
    ]
  },
  browserContext: 'default'
};