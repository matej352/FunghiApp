const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jstoxml = require('jstoxml');

const port = 3000;

var jsonParser = bodyParser.json()

const db = require('./database')


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, '/public')));


const myMap = new Map();
let lastFilteredProperty;

app.post('/post', jsonParser, function (req, res) {
    const data = req.body;

    lastFilteredProperty = data.property;
    myMap.set(data.property, data.searchText)

    res.redirect('/');
});

app.get('/', async (req, res) => {

   let isFiltered = false;

   for (const value of myMap.values()) {
    if (value !== '') {
        isFiltered = true;
        break;
    }
  }



    if (isFiltered) {
        try {

            let queryObj = generateQuery();

            const dbResponse = await db.query(queryObj.query, queryObj.data);
            const rows = dbResponse[0];

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
                ZnanstveniNazivValue: myMap.get('ZnanstveniNaziv'),
                PorodicaValue:myMap.get('Porodica'),
                RodValue:myMap.get('Rod'),
                VrstaValue:myMap.get('Vrsta'),
                lastFilteredProperty: lastFilteredProperty,
                xmlRows: jsonToXml(rows)
            });


        } catch (err) {
            console.log(err)
        }

    } else {

        try {
            const dbResponse = await db.query('SELECT * FROM tablicagljiva');
            const rows = dbResponse[0];

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
                ZnanstveniNazivValue: myMap.get('ZnanstveniNaziv'),
                PorodicaValue:myMap.get('Porodica'),
                RodValue:myMap.get('Rod'),
                VrstaValue:myMap.get('Vrsta'),
                lastFilteredProperty: lastFilteredProperty,
                xmlRows: jsonToXml(rows)
            });

        } catch (err) {
            console.log(err)
        }


    }


});


function generateQuery() {

    let query = `SELECT * FROM tablicagljiva WHERE `;
    let data = [];

    for (const [key, value] of myMap.entries()) {
        if (value) {
            query += key + ' LIKE ? AND ';
            data.push('%'+value+'%')
        }
    }

    query = query.substring(0, query.lastIndexOf('AND'));
    return {query: query, data: data};


}

function jsonToXml(rows) {

    const xmlTag = '<?xml version="1.0" encoding="UTF-8" ?>\n'
    const config = {
        indent: '    '
    };

    let xmlRows = []
    rows.forEach( obj => {
        xmlRows.push( xmlTag + jstoxml.toXML(obj, config))
    })

    return xmlRows;
}


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})