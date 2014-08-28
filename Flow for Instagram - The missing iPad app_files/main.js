require.config({
  'paths':
  {
    "jquery": "libs/jquery.1.9.1.min",
    //"smint": "libs/jquery.smint",
    "dd": "libs/jquery.dd",
    "video": "libs/video"
    // "slides": "vendor/slides.jquery",
  },
  'shim':
  {
    //smint: { 'deps': ['jquery'] },
    dd: { 'deps': ['jquery'] },
    video: { 'deps' : ['jquery'] }
  }
});

require([
  'jquery',
  //'smint',
  'dd',
  'video',
  'app'
],
function(){ /* app init */ });
