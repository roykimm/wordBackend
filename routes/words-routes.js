const express = require('express');
const { check } = require('express-validator');

const wordsControllers = require('../controller/words-controller');
const router = express.Router();

router.get('/',wordsControllers.getWords);

router.post(
    '/add',
    [
        check('word')
            .not()
            .isEmpty(),
        check('wordname')
            .not()
            .isEmpty()
    ],
    wordsControllers.addWord
);

router.delete('/:pid', wordsControllers.deleteWord);

module.exports = router;

