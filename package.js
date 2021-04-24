Package.describe({
  name: 'mybirer:tiny-helper',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Tinymce 5 Module for Meteor.js',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mybirer/tiny-helper.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('templating', 'client');
  api.use('jquery');
  api.use('ecmascript');

  api.mainModule('tinymce-helper.js');

  //add stylesheets
  api.addAssets(["css/inline.css"], 'client');

  //add langauges
  api.addAssets(["lang/tr.js","lang/es_MX.js"], 'client');

  api.export("TinyHelper"); 
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mybirer:tiny-helper');
  api.mainModule('tiny-helper-tests.js');
});
