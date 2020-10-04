const debug = require('debug')('request')

module.exports = function (promiseRequest, maxQueue = 5, delay = 300) {

    let requestCount = 0;
    const queue = [];

    const request = options => new Promise((resolve, reject) => {
        pushQueue({options, resolve, reject});
    });

    function pushQueue(options) {
        queue.push(options);
        checkQueue();
    }

    function checkQueue() {
        if (requestCount < maxQueue && queue.length) {
            const options = queue.shift();
            debug(`[${promiseRequest.name}] ${options.options.uri || options.options}`);
            requestFn(options);
        }
    }

    function requestFn({options, resolve, reject}) {
        requestCount++;
        promiseRequest(options).then(resolve).catch(reject).finally(() => {
            requestCount--;
            setTimeout(checkQueue, delay);
        })
    }


    return request
}

