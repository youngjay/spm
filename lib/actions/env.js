var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');

var WinOs = require('../utils/win_os.js');
var fsExt = require('../utils/fs_ext.js');
var ActionFactory = require('./action_factory.js');

// 工具类加载

// 项目配置文件解析，产生出项目模型
var ProjectFactory = require('../core/project_factory.js');

var argv = require('optimist').argv;

var Env = ActionFactory.create('env');

Env.MESSAGE = {
  USAGE: 'usage: spm env [--clean --init]',
  DESCRIPTION: 'setup spm environment.'
};

var err = null;
var errMsg = 'setup spm environment failure!';
var succMsg = 'setup spm environment success!';
Env.prototype.run = function() {
  var home = WinOs.home; 

  if (!argv.clean && !argv.init) {
    console.info(Env.MESSAGE.USAGE);
    return;
  }

  var queue = async.queue(function(fn, callback) {
    fn(callback);
  }, 2);

  queue.drain = function() {
    if (err) {
      console.error(errMsg);
    } else {
      console.info(succMsg);
    }
  };

  if (argv.clean) {
    queue.push(function(callback) {
      // del ~/.spm/
      fsExt.rmdirRF(path.join(home, '.spm', 'sources'));
      setTimeout(function() {
        callback();
      }, 10);
    });
  }

  if (argv.init) {
    queue.push(function(callback) {
      var source = 'http://modules.seajs.org';
      if (typeof argv.init !== 'boolean') {
        source = argv.init;
      }
      var configUrl = source + '/config.json';
      request.head(configUrl, function(err, res, body) {
        if (!err && (res.statusCode < 400)) {
          request(configUrl).pipe(fs.createWriteStream(path.join(home, '.spm', 'config.json'))).on('close', function() {
            callback();
          });
        } else {
          err = "err";
        }
      });
    });
  }
};

module.exports = Env;
