var express = require('express');
var router = express.Router();
const chatkit = require('./chatkit');

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
