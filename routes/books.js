var express = require('express');
var router = express.Router();
var Book = require('../models/book');

// SELECT *
router.get('/', function(req, res, next) {
	Book.find(function(err, books){
		if(err) return res.status().send({error: 'database failure'});
		res.json(books);
	})
});

// SELECT WHERE book_id = $BOOK_ID
router.get('/:book_id', function(req, res){
	Book.find({_id: req.params.book_id}, function(err, book){
		if(err) return res.status(500).json({error: err});
		if(!book) return res.status(200).json({error: 'not found'});
		res.json(book);
	})
});

// SELECT WHERE author = $AUTHOR
router.get('/:author', function(req, res){
    Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
        if(err) return res.status(500).json({error: err});
        if(books.length === 0) return res.status(200).json({error: 'book not found'});
        res.json(books);
    })
});

// CREATE
router.post('/', function(req, res){

	var book = new Book();
	book.title = req.body.title;
	book.author = req.body.author;
	book.published_date = new Date(req.body.published_date);

	book.save(function(err){
		if(err){
			console.log(err);
			return res.status(500).json({ error: 'database failure'});;
		}

		res.json({result: true});
	});

});

// UPDATEß
router.put('/:book_id', function(req, res){
	console.log("UPDATE REQUEST");

	Book.findOne(req.params.book_id, function(err, book){
        if(err) return res.status(500).json({ error: 'database failure' });
        if(!book) return res.status(200).json({ error: 'book not found' });

        if(req.body.title) book.title = req.body.title;
        if(req.body.author) book.author = req.body.author;
        if(req.body.published_date) book.published_date = req.body.published_date;

        book.save(function(err){
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'book updated', output: book});
        });
    });
});

router.delete('/:book_id', function(req, res){

	Book.remove({_id: req.params.book_id}, function(err, result){
		if(err) return res.status(500).json({ error: 'database failure'});
		res.status(200).end();
	})

});
module.exports = router;
