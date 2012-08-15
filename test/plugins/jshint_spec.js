
var path = require('path');
var ProjectFactory = require('../../lib/core/project_factory.js');
var fsExt = require('../../lib/utils/fs_ext.js');
var jshint = require('jshint').JSHINT;
describe('project model constructor', function() {
  var action = "build";
  var dir = path.join(path.dirname(module.filename), "../data/plugins/moduleA/");
 
  it('test jshint plugin', function() {
    getProjectModel('build', dir, function(model) {
      var src = model.srcDirectory;
      var build = model.buildDirectory;
      var result = jshint(fsExt.readFileSync(path.join(src,'widget.js')));
      // console.info('result---->', jshint.errors);
      // console.info('result---->', result);
    });
  });
});

function getProjectModel(action, dir, callback) {
  ProjectFactory.getProjectModel(action, dir, function(projectModel) {
    callback(projectModel);
  });
}


