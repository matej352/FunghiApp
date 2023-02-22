const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;

var jsonParser = bodyParser.json()

const db = require('./database')


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, '/public')));


app.post('/post', jsonParser, function (req, res) {
    const data = req.body;
    console.log('iz backa ' + data.searchText)
    req.app.set('searchText', data.searchText);
    req.app.set('property', data.property);
    res.redirect('/');
});

app.get('/', async (req, res) => {

    const searchText = req.app.get('searchText');
    const property = req.app.get('property');

    if (searchText) {
        try {

            let helper = '%'+searchText+'%';

            const dbResponse = await db.promise().query('SELECT * FROM tablicagljiva LIMIT 5', [property, "Velikus Gljivikus"],);
            const rows = dbResponse[0];

            //<% var perPage=3; var pageCount=4; var itemsCount=11; var forPagination=-1; var lastPageCount=2; %>

            let forPagination = -1;
            let perPage = 10;
            let itemsCount = rows.length;
            let pageCount = (Math.ceil(itemsCount / perPage));
            let lastPageCount = (itemsCount % perPage) === 0 ? perPage : (itemsCount % perPage);

            res.render('home', {
                forPagination: forPagination,
                perPage: perPage,
                itemsCount: itemsCount,
                pageCount: pageCount,
                lastPageCount: lastPageCount,
                rows: rows,
                value: searchText

            });




            //console.log(rows)
        } catch (err) {
            console.log(err)
        }

    } else {

        try {
            const dbResponse = await db.promise().query('SELECT * FROM tablicagljiva');
            const rows = dbResponse[0];

            //<% var perPage=3; var pageCount=4; var itemsCount=11; var forPagination=-1; var lastPageCount=2; %>

            let forPagination = -1;
            let perPage = 10;
            let itemsCount = rows.length;
            let pageCount = (Math.ceil(itemsCount / perPage));
            let lastPageCount = (itemsCount % perPage) === 0 ? perPage : (itemsCount % perPage);

            res.render('home', {
                forPagination: forPagination,
                perPage: perPage,
                itemsCount: itemsCount,
                pageCount: pageCount,
                lastPageCount: lastPageCount,
                rows: rows,
                value: ''

            });




            //console.log(rows)
        } catch (err) {
            console.log(err)
        }


    }


});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})