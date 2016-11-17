var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

//==================  Routes  ====================

// Route: select genres
router.get('/genreList', function(req, res) {
    console.log('get request for genres');
    // get books from DB
    pg.connect(connectionString, function(err, client, done) {
        console.log('connection started');
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'SELECT DISTINCT genre FROM books',
            function(err, result) {
                done(); // close the connection.

                if (err) {
                    console.log('select query error: ', err);
                    res.sendStatus(500);
                }
                console.log(result.rows);
                res.send(result.rows);
            });
    });
}); // end get genres

// Route: select book by genre
router.get('/:genre', function(req, res) {
    var genreFilter = req.params.genre;
    console.log('get request for:', genreFilter);
    // get books from DB
    pg.connect(connectionString, function(err, client, done) {
        console.log('connection started');
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'SELECT * FROM books WHERE genre = $1 ', [genreFilter],
            function(err, result) {
                done(); // close the connection.

                if (err) {
                    console.log('select query error: ', err);
                    res.sendStatus(500);
                }
                console.log(result.rows);
                res.send(result.rows);
            });
    });
}); // end get books by genre

// Route: Post new book
router.post('/', function(req, res) {
    var newBook = req.body;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'INSERT INTO books (title, author, published, genre, edition, publisher) ' +
            'VALUES ($1, $2, $3, $4, $5, $6)', [newBook.title, newBook.author, newBook.published, newBook.genre, newBook.edition, newBook.publisher],
            function(err, result) {
                done();

                if (err) {
                    console.log('insert query error: ', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });

    });

});  // end post new book

// Route: delete book
router.delete('/:id', function(req, res) {
    bookID = req.params.id;

    console.log('book id to delete: ', bookID);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'DELETE FROM books WHERE id = $1', [bookID],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
    });

}); // end delete book

// Route: Update book
router.put('/:id', function(req, res) {
    bookID = req.params.id;
    book = req.body;

    console.log('book to update ', book);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'UPDATE books SET title=$1, author=$2, genre=$3, published=$4, edition=$5, publisher=$6' +
            ' WHERE id=$7',
            // array of values to use in the query above
            [book.title, book.author, book.genre, book.published, book.edition, book.publisher, bookID],
            function(err, result) {
                if (err) {
                    console.log('update error: ', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
    }); // close connect

}); // end update book route

module.exports = router;
