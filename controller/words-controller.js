const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Word = require('../models/word');

const getWords = async (req, res, next) => {
    let words;
    try {
        words = await Word.find();
    } catch (err) {
        const error = new HttpError(
            'Fetching words failed, please try again!',
            500
        );
        return next(error);
    }
    console.log("words : " + words);
    res.json({ words : words.map(word => word.toObject({getters : true}))
            });
}

const addWord = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { word, wordname, worddvcd, wordlevel, inputname, inputdate, note} = req.body;

    const createdWord = new Word({
        word,
        wordname,
        worddvcd,
        wordlevel,
        inputname,
        inputdate,
        note
    });

    try {
        await createdWord.save();
    } catch (err) {
        const error = new HttpError(
            '저장하는데 에러가 발생하였습니다.',
            500
        );
        return next(error);
    }
    res.status(200).json({word : createdWord.toObject({ getters : true })});
}

const deleteWord = async (req, res, next) => {
    const wordId = req.params.pid;

    let word;
    try {
        word = await Word.findById(wordId);
      } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not delete word.',
          500
        );
        return next(error);
      }
    
      if (!word) {
        const error = new HttpError('Could not find word for this id.', 404);
        return next(error);
      }
    
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await word.remove({session: sess});
        Word.pull(word);
        await Word.save({session: sess});
        await sess.commitTransaction();
      } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not delete word.',
          500
        );
        return next(error);
      }
      
      res.status(200).json({ message: 'Deleted place.' });
}


exports.getWords = getWords;
exports.addWord = addWord;
exports.deleteWord = deleteWord;