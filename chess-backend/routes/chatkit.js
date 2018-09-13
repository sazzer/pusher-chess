var Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: 'CHATKIT_INSTANCE_LOCATOR',
    key: 'CHATKIT_SECRET_KEY'
});

module.exports = chatkit;
