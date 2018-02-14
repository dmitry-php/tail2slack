var Tail    = require('tail').Tail,
    SlackWebhook = require('slack-webhook'),
    config  = require('./config');

var url = config.url;

var log = function(data) {
    console.log(new Date().toString() + ': ' + data);
};

var slack = new SlackWebhook(url, {
    defaults: {
        username: config.username,
        channel: config.channel,
        icon_emoji: config.icon_emoji
    }
});

var publish = function(logfile, data) {
    if (!data || data.length <= 0) {
        return;
    }

    slack.send(data).then(function(res) {
        log(res);
    }).catch(function (err) {
	    log(error);
    });
};

config.logfiles.forEach(function(item) {

    var tail = new Tail(item);

    tail.on('line', function(data) {
        setTimeout(function () {
            publish(item, data);
        }, 1000);
    });

    tail.on('error', log);
});
