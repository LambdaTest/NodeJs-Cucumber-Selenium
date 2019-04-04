var https = require('https'),
  ELKLogger = require('./ELKLogger'),
  request = require('request'),
  unzip = require('unzip'),
  fs = require('fs'),
  path = require('path'),
  os = require('os'),
  httpHashPath = 'https://s3.amazonaws.com/lambda-downloads/mac/latest';

function TunnelBinary() {
  this.hostOS = process.platform;
  this.is64bits = process.arch === 'x64';
  if (this.hostOS.match(/darwin|mac os/i)) {
    this.httpPath = 'https://s3.amazonaws.com/lambda-tunnel/LT_Mac.zip';
    this.binaryName = 'LT_Mac.zip';
    httpHashPath = 'https://stage-downloads.lambdatest.com/tunnel/mac/latest';
  } else if (this.hostOS.match(/mswin|msys|mingw|cygwin|bccwin|wince|emc|win32/i)) {
    this.windows = true;
    this.httpPath = 'https://s3.amazonaws.com/lambda-tunnel/LT_Windows.zip';
    this.binaryName = 'LT_Windows.zip';
    httpHashPath = 'https://stage-downloads.lambdatest.com/tunnel/windows/latest';
  } else {
    if (this.is64bits) {
      this.httpPath = 'https://stage-downloads.lambdatest.com/tunnel/linux/LT_Linux.zip';
      this.binaryName = 'LT_Linux.zip';
    } else {
      this.httpPath = 'https://stage-downloads.lambdatest.com/tunnel/linux/LT_Linux.zip';
      this.binaryName = 'LT_Linux.zip';
    }
    httpHashPath = 'https://stage-downloads.lambdatest.com/tunnel/linux/latest';
  }

  this._retryBinaryDownload = function (conf, destParentDir, fnCallback, retries, binaryPath) {
    var self = this;
    if (retries > 0) {
      console.log('Retrying Download. Retries left', retries);
      fs.stat(binaryPath, function (e) {
        if (!e) {
          fs.unlinkSync(binaryPath);
        }
        self._download(conf, destParentDir, fnCallback, retries - 1);
      });
    } else {
      console.error('Number of retries to download exceeded.');
    }
  };

  this._download = function (conf, destParentDir, fnCallback, retries) {
    try {
      if (!this._checkPath(destParentDir)) {
        fs.mkdirSync(destParentDir);
      }
      var binaryPath = path.join(destParentDir, this.binaryName);

      var self = this;
      var pathConfig = { url: this.httpPath };
      if (conf.proxyHost && conf.proxyPort) {
        pathConfig.proxy = conf.proxyHost + ':' + conf.proxyPort;
      }
      request.get(pathConfig)
        .pipe(fs.createWriteStream(binaryPath))
        .on('close', function () {
          if (self._checkPath(binaryPath)) {
            var destBinaryName = (this.windows) ? 'LT.exe' : 'LT';
            var destBinaryPath = path.join(destParentDir, destBinaryName);

            if (self._checkPath(destBinaryPath)) {
              return fnCallback(destBinaryPath);
            } else {
              fs.createReadStream(binaryPath).pipe(unzip.Extract({ path: destParentDir }))
                .on('error', function (e) {
                  ELKLogger(conf['user'], conf['key'], { filename: __filename }, 'Got Error while unzip downloading binary' + e);
                  self._retryBinaryDownload(conf, destParentDir, fnCallback, retries, binaryPath);
                })
                .on('close', function () {
                  fs.chmod(destBinaryPath, '0755', function () {
                    return fnCallback(destBinaryPath);
                  });
                });
            }
          } else {
            console.error('Got Error while downloading binary zip');
            ELKLogger(conf['user'], conf['key'], { filename: __filename }, 'Got Error while downloading binary zip');
            self._retryBinaryDownload(conf, destParentDir, fnCallback, retries, binaryPath);
          }
        })
    } catch (e) {
      console.error('Got Error while downloading binary zip');
      ELKLogger(conf['user'], conf['key'], { filename: __filename }, { message: 'Got Error while Extracting binary zip', e: e });
    }
  };

  this._binaryPath = function (conf, fnCallback) {
    try {
      var destParentDir = this._availableDirs();
      var destBinaryName = (this.windows) ? 'LT.exe' : 'LT';
      var binaryPath = path.join(destParentDir, destBinaryName);

      if (this._checkPath(binaryPath, fs.X_OK)) {
        var that = this;
        this._fetchHash(conf, 5, function (httpHashContents) {
          var localHashPath = __dirname + '/hash.txt';
          if (!that._checkPath(localHashPath)) {
            var writeStream = fs.createWriteStream(localHashPath);
            writeStream.write(httpHashContents);
            writeStream.end();
            that._download(conf, destParentDir, fnCallback, 5);
          } else {
            var localHashContents = fs.readFileSync(localHashPath, 'utf8');
            localHashContents = localHashContents.trim();
            if (httpHashContents === localHashContents) {
              return fnCallback(binaryPath);
            } else {
              fs.writeFileSync(localHashPath, httpHashContents);
              that._download(conf, destParentDir, fnCallback, 5);
            }
          }
        })
      } else {
        this._download(conf, destParentDir, fnCallback, 5);
      }
    } catch (e) {
      console.log(e);
      ELKLogger(conf['user'], conf['key'], { filename: __filename }, e);
    }
  };

  this._checkPath = function (path, mode) {
    try {
      mode = mode || (fs.R_OK | fs.W_OK);
      fs.accessSync(path, mode);
      return true;
    } catch (e) {
      if (typeof fs.accessSync !== 'undefined') return false;
      try {
        fs.statSync(path);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  this._availableDirs = function () {
    var orderedPathLength = this.orderedPaths.length;
    for (var i = 0; i < orderedPathLength; i++) {
      var path = this.orderedPaths[i];
      if (this._makePath(path)) {
        return path;
      }
    }
    throw Error('Error trying to download LambdaTest Tunnel binary');
  };

  this._makePath = function (path) {
    try {
      if (!this._checkPath(path)) {
        fs.mkdirSync(path);
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  this._homeDir = function () {
    if (typeof os.homedir === 'function') return os.homedir();

    var env = process.env;
    var home = env.HOME;
    var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

    if (process.platform === 'win32') {
      return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
    }

    if (process.platform === 'darwin') {
      return home || (user ? '/Users/' + user : null);
    }

    if (process.platform === 'linux') {
      return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
    }

    return home || null;
  };

  this._fetchHash = function (conf, retries, fnCallback) {
    try {
      var that = this;
      if (retries >= 0) {
        var httpHashContents = '';
        https.get(httpHashPath, function (response) {
          response.on('error', function (e) {
            console.error('Got Error in binary download response', e);
            ELKLogger(conf['user'], conf['key'], { filename: __filename }, e);
            that._fetchHash(conf, retries - 1, fnCallback);
          });
          response.on('data', function (chunk) {
            httpHashContents += chunk;
          });
          response.on('end', () => {
            httpHashContents = httpHashContents.trim();
            return fnCallback(httpHashContents);
          });
        }).on('error', function (e) {
          console.error('Got Error in hash downloading request', e);
          ELKLogger(conf['user'], conf['key'], { filename: __filename }, e);
          that._fetchHash(conf, retries - 1, fnCallback);
        });
      } else {
        console.error('Number of retries to download hash exceeded.');
        ELKLogger(conf['user'], conf['key'], { filename: __filename }, 'Number of retries to download hash exceeded.');
        throw Error('Error trying to download hash. Please reinstall this newly updated package');
      }
    } catch (e) {
      ELKLogger(conf['user'], conf['key'], { filename: __filename }, e);
      throw Error('Error trying to download hash. Please reinstall this newly updated package');
    }
  };

  this.orderedPaths = [
    path.join(this._homeDir(), '.lambdatest'),
    process.cwd(),
    os.tmpdir()
  ];
}

module.exports = TunnelBinary;
