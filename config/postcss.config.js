module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'Chrome >= 60',
        'Firefox >= 60',
        'Safari >= 12',
        'Edge >= 79'
      ]
    })
  ]
};
