var express = require('express');
var router = express.Router();
var Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: 'CHATKIT_INSTANCE_LOCATOR',
    key: 'CHATKIT_SECRET_KEY'
});

router.post('/', (req, res) => {
    const userId = req.query.user_id;

    chatkit.createUser({
        id: userId,
        name: userId
    })
        .catch(() => {})
        .then(() => {
            const authData = chatkit.authenticate({
                userId: userId
            });

            res.status(authData.status)
                .send(authData.body);
        });
});

module.exports = router;
