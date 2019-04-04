var childProcess = require('child_process'),
  TunnelBinary = require('./TunnelBinary'),
  ELKLogger = require('./ELKLogger'),
  split = require('split'),
  request = require('request'),
  getPort = require('get-port'),
  os = require('os'),
  AUTH_API_URL = 'https://accounts.lambdatest.com/api/user/token/auth';

function Tunnel() {

  this.isProcessRunning = false;
  this.options = null;

  this.start = function (options, fnCallback) {
    this.options = options;
    if (typeof options['onlyCommand'] !== 'undefined') {
      return fnCallback(null, true);
    }
    if ((!options['user']) || (!options['key'])) {
      return fnCallback({ message: 'user and key is required' }, false);
    }

    var self = this;
    _verifyToken(options, function (e, res) {
      if (e) {
        ELKLogger(options['user'], options['key'], { filename: __filename }, res || e);
        console.log(res.message || res || e);
        return fnCallback(res || e, false);
      }
      _getBinaryPath(self, options, function (binaryPath) {
        self.binaryPath = binaryPath;
        _runBinary(self, 5, fnCallback);
      });
    });
  };

  this.isRunning = function () {
    return this.isProcessRunning && this.proc && true;
  };

  this.stop = function (fnCallback) {
    try {
      if (!this.isRunning()) return fnCallback();
      var that = this;
      _killRunningProcess(that, function (e) {
        if (e) {
          ELKLogger(that.options['user'], that.options['key'], { filename: __filename }, e);
          return fnCallback(e);
        }
        return fnCallback();
      });
    } catch (e) {
      ELKLogger(this.options['user'], this.options['key'], { filename: __filename }, e);
      return fnCallback(e);
    }
  };

  this.getTunnelName = function (fnCallback) {
    if (this.isRunning()) {
      if (this.infoAPIPort) {
        _retryTunnelName(this, this.infoAPIPort, 5, fnCallback);
      } else {
        return fnCallback(null);
      }
    } else {
      console.log("Tunnel is not Running Currently");
      return fnCallback(null);
    }
  };
}

function _runBinary(self, retries, fnCallback) {
  if (retries >= 0) {
    _addArguments(self, function (e, binaryArguments) {
      if (e) {
        ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, e);
        return fnCallback(null, false);
      }
      self.proc = childProcess.spawn(self.binaryPath, binaryArguments);
      var isCallback = false;
      self.proc.stdout.pipe(split()).on('data', function (data) {
        if (!isCallback) {
          self.isProcessRunning = true;
          isCallback = true
          return fnCallback(null, true);
        }
      });

      self.proc.stderr.pipe(split()).on('data', function (data) {
        ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, data);
        self.isProcessRunning = false;
        if (!isCallback) {
          return fnCallback(null, false);
        }
      });

      self.proc.on('exit', function (code) {
        if (code && code === 10) {
          _runBinary(self, retries - 1, fnCallback);
        }
        ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, code);
        self.isProcessRunning = false;
        if (!isCallback) {
          return fnCallback(null, false);
        }
      });
    });

  } else {
    ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, 'Number of retries to run binary exceeded.');
    return fnCallback(null, false);
  }
}

function _verifyToken(options, fnCallback) {
  try {
    request.post({
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      url: AUTH_API_URL,
      body: JSON.stringify({
        "username": options['user'],
        "token": options['key']
      })
    }, function (e, response, json) {
      if (e) {
        ELKLogger(options['user'], options['key'], { filename: __filename }, e);
        return fnCallback(true, e);
      } else {
        if (typeof json === 'string') {
          json = JSON.parse(json);
        }
        if (json && json.type === 'error') {
          ELKLogger(options['user'], options['key'], { filename: __filename }, json);
          return fnCallback(true, json);
        }
        return fnCallback(false, json);
      }
    });
  } catch (e) {
    ELKLogger(options['user'], options['key'], { filename: __filename }, e);
    return fnCallback(true, e);
  }
};

function _killRunningProcess(that, fnCallback) {
  try {
    if (that.proc) {
      that.proc.on('exit', function () {
        return fnCallback();
      });
      that.proc.kill('SIGINT');
    } else {
      return fnCallback();
    }
  } catch (e) {
    ELKLogger(that.options['user'], that.options['key'], { filename: __filename }, e);
    return fnCallback(e);
  }
};

function _addArguments(self, fnCallback) {
  try {
    var options = self.options;
    var binaryArgs = [];
    for (var key in options) {
      var value = options[key];
      switch (key) {
        case 'user':
        case 'key':
        case 'port':
          if (value) {
            binaryArgs.push('--' + key);
            binaryArgs.push(value);
          }
          break;

        case 'tunnelName':
        case 'tunnelname':
          if (value) {
            binaryArgs.push('--tunnelName');
            binaryArgs.push(value);
          }
          break;

        case 'proxyHost':
        case 'proxyhost':
          if (value) {
            binaryArgs.push('--proxy-host');
            binaryArgs.push(value);
          }
          break;

        case 'proxyPort':
        case 'proxyport':
          if (value) {
            binaryArgs.push('--proxy-port');
            binaryArgs.push(value);
          }
          break;

        case 'proxyUser':
        case 'proxyuser':
          if (value) {
            binaryArgs.push('--proxy-user');
            binaryArgs.push(value);
          }
          break;

        case 'proxyPass':
        case 'proxypass':
          if (value) {
            binaryArgs.push('--proxy-pass');
            binaryArgs.push(value);
          }
          break;

        case 'localDirectory':
        case 'localdirectory':
        case 'localDir':
        case 'localdir':
        case 'dir':
          if (value) {
            binaryArgs.push('--dir');
            binaryArgs.push(value);
          }
          break;

        case 'env':
        case 'environment':
          if (value) {
            binaryArgs.push('--env');
            binaryArgs.push(value);
          }
          break;

        case 'verbose':
        case 'v':
          if (value) {
            binaryArgs.push('--v');
            binaryArgs.push(value);
          }
          break;

        case 'configurationFile':
        case 'configurationfile':
        case 'confFile':
        case 'conffile':
        case 'configFile':
        case 'configfile':
          if (value) {
            binaryArgs.push('--config');
            binaryArgs.push(value);
          }
          break;

        case 'sharedTunnel':
        case 'sharedtunnel':
        case 'shared-tunnel':
          if (value) {
            binaryArgs.push('--shared-tunnel');
            binaryArgs.push(value);
          }
          break;

        case 'localDomains':
        case 'localdomains':
        case 'local-domains':
          if (value) {
            binaryArgs.push('--local-domains');
            binaryArgs.push(value);
          }
          break;

        case 'outputConfiguration':
        case 'outputconfiguration':
        case 'outputConf':
        case 'outputconf':
        case 'outputConfig':
        case 'outputconfig':
        case 'output-config':
          if (value) {
            binaryArgs.push('--output-config');
            binaryArgs.push(value);
          }
          break;

        case 'dns':
        case 'DNS':
        case 'Dns':
          if (value) {
            binaryArgs.push('--dns');
            binaryArgs.push(value);
          }
          break;

        case 'pidFile':
        case 'pidfile':
          if (value) {
            binaryArgs.push('--pidfile');
            binaryArgs.push(value);
          }
          break;

        case 'pac':
        case 'Pac':
        case 'PAC':
          if (value) {
            binaryArgs.push('--pac');
            binaryArgs.push(value);
          }
          break;
      }
    }
    _getFreePort(options, 5, function (e, port) {
      if (typeof port === 'number') {
        binaryArgs.push('--infoAPIPort');
        binaryArgs.push(port);

        var tunnelNameIndex = binaryArgs.indexOf('--tunnelName');
        if (tunnelNameIndex === -1) {
          binaryArgs.push('--tunnelName');
          binaryArgs.push(os.hostname() + port);
        }
      }
      self.infoAPIPort = port;
      ELKLogger(options['user'], options['key'], { filename: __filename }, binaryArgs);
      return fnCallback(false, binaryArgs);
    })
  } catch (e) {
    return fnCallback(true, e);
  }
};

function _getFreePort(options, retries, fnCallback) {
  try {
    getPort(function (e, port) {
      if (e) {
        if (retries >= 0) {
          _getFreePort(options, retries - 1, fnCallback);
        } else {
          ELKLogger(options['user'], options['key'], { filename: __filename }, ('Error trying to get Free Port on LambdaTest Tunnel' + e));
          throw Error('Error trying to get Free Port on LambdaTest Tunnel, Please contact support' + e);
        }
      }
      return fnCallback(false, port);
    });
  } catch (e) {
    ELKLogger(options['user'], options['key'], { filename: __filename }, ('Error trying to get Free Port on LambdaTest Tunnel' + e));
    throw Error('Error trying to get Free Port on LambdaTest Tunnel, Please contact support' + e);
  }
}

function _getBinaryPath(that, options, fnCallback) {
  if (typeof (that.binaryPath) == 'undefined') {
    that.binary = new TunnelBinary();
    var conf = {
      user: options['user'],
      key: options['key']
    };
    if ((options['proxyHost'] || options['proxyhost']) && (options['proxyPort'] || options['proxyport'])) {
      conf.proxyHost = options['proxyHost'] || options['proxyhost'];
      conf.proxyPort = options['proxyPort'] || options['proxyport'];
    }
    that.binary._binaryPath(conf, fnCallback);
  } else {
    return fnCallback(that.binaryPath);
  }
};

function _retryTunnelName(self, infoAPIPort, retries, fnCallback) {
  try {
    var timeoutId = null;
    if (retries >= 0) {
      var url = 'http://127.0.0.1:' + infoAPIPort + '/api/v1.0/info';
      request.get(url, function (e, response, json) {
        if (e) {
          ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, e);
          _clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            _retryTunnelName(self, infoAPIPort, retries - 1, fnCallback);
          }, 30000);
        } else {
          if (response.statusCode === 200) {
            _clearTimeout(timeoutId);
            if (typeof json === 'string') json = JSON.parse(json);
            return fnCallback((json.data && json.data.tunnelName) || null);
          } else {
            _clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
              _retryTunnelName(self, infoAPIPort, retries - 1, fnCallback);
            }, 30000);
          }
        }
      })
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, 'Number of retries to to get tunnel name exceeded.');
      return fnCallback(null);
    }
  } catch (e) {
    ELKLogger(self.options['user'], self.options['key'], { filename: __filename }, e);
    return fnCallback(null);
  }
}

function _clearTimeout(timeoutId) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

module.exports = Tunnel;
