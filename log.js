var Log  = require('log'),
    fs   = require('fs'),
    path = './logs/';

module.exports = {
    file: function(name) {
        return {
            log: new Log('error', fs.createWriteStream(path + name, { flags: 'a' })),

            check: function(condition, message) {
                if (condition) {
                    if (message == undefined) {
                        message = condition;
                    }

                    console.log(message);
                    this.log.error(message);
                    
                    process.exit(1);
                }
            }
        };
    }
};