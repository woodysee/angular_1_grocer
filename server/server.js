const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");

//Environment variable declarations
dotenv.config();
const NODE_PORT = process.env.NODE_PORT || 3002;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASS = process.env.MYSQL_PASS;

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(express.static(__dirname + "/../client/"));

//Initialising Sequelize
const connection = new Sequelize("grocer", MYSQL_USER, MYSQL_PASS, {
    host: "localhost",
    port: 3306,
    logging: console.log,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
const Op = Sequelize.Op;

const Product = require("./models/product")(connection, Sequelize);

const GROCER_API = "/api/products";

/************//*
METHODS
*//************/

// CREATE product record
server.post(GROCER_API, (req, res) => {
    console.log("Adding one employee:" + JSON.stringify(req.body));
    const newItem = req.body;
    // delete employee.emp_no;
    // const whereClause = {
    //     where: { emp_no: employee.emp_no },
    //     defaults: employee
    // };
    Product.create(newItem)
        .then(result => {
            console.log("Submitting data:");
            res.status(200).json(result);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// UPDATE product record
server.put(GROCER_API, (req, res) => {
    console.log("Updating one product record: " + JSON.stringify(req.body));
    const id = req.body.id;
    console.log(id);
    const whereClause = { limit: 1, where: { id: id } };
    Product.findOne(whereClause)
        .then(result => {
            result.update(req.body);
            res.status(200).json(result);
        })
    .catch(error => {
        res.status(500).json(error);
    });
});

// GET all product records
server.get(GROCER_API, (req, res) => {
    console.log(req.query);
    console.log("Searching for: " + req.query.keyword);
    const keyword = req.query.keyword;
    if (keyword == "") {
        return;
    };
    const searchType = req.query.searchType;
    let orderBy = req.query.orderBy;
    console.log(orderBy);
    if (typeof orderBy == "null") {
        orderBy = "ASC";
    };

    const itemsPerPage = parseInt(req.query.itemsPerPage);
    const currentPage = parseInt(req.query.currentPage);
    const offset = (currentPage - 1) * itemsPerPage;
    let whereClause;
    switch (searchType) {
        case "name":
            
            whereClause = {
                offset: offset,
                limit: itemsPerPage,
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%'
                    }
                },
                order: [
                    ['name', orderBy],
                    ['brand', 'asc']
                ]
            };
            break;

        case "brand":

            whereClause = {
                offset: offset,
                limit: itemsPerPage,
                where: {
                    brand: {
                        [Op.like]: '%' + keyword + '%'
                    }
                },
                order: [
                    ['name', 'asc'],
                    ['brand', orderBy]
                ]
            };
            break;

        case "name_brand":
            whereClause = {
                offset: offset,
                limit: itemsPerPage,
                where: {
                    [Op.or]: {
                        name: {
                            [Op.like]: '%' + keyword + '%'
                        },
                        brand: {
                            [Op.like]: '%' + keyword + '%'
                        }
                    }
                },
                order: [
                    ['name', orderBy],
                    ['brand', orderBy]
                ]
            };
            break;

        default: 
            whereClause = {
                offset: offset,
                limit: itemsPerPage,
                where: {
                    [Op.or]: {
                        name: {
                            [Op.like]: '%' + keyword + '%'
                        },
                        brand: {
                            [Op.like]: '%' + keyword + '%'
                        }
                    }
                },
                order: [
                    ['name', orderBy],
                    ['brand', orderBy]
                ]
            };
            
    };

    Product.findAndCountAll(whereClause)
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            res.status(500).json(error);
    });
});

//GET 1 product record
server.get(GROCER_API + "/:id", (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    console.log(id);
    const whereClause = { limit: 1, where: { id: id } };
    Product.findOne(whereClause)
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
    });
});

//DELETE product record
server.delete(GROCER_API + "/:id", (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    console.log(id);
    const whereClause = { limit: 1, where: { id: id } };
    Product.findOne(whereClause)
        .then(result => {
            result.destroy();
            res.status(200).json({});
        })
    .catch(error => {
        console.log("Deletion unsuccessful:", error);
        res.staus(410).json(error);
    });
});

/************//*
NODE.JS SERVER TO ANGULAR v1.x CLIENT REDIRECTS
(Place only at the bottom)
*//************/

server.get('/add', (req, res) => {
    console.log("Angular 1.x redirect from backend initiated:");
    res.redirect("/");
});

server.get('/edit', (req, res) => {
    console.log("Angular v1.x redirect from backend initiated:");
    res.redirect("/");
});


//Mandatory server listener
server.listen(NODE_PORT, () => {
    console.log(
    "server/server.js: express server is now running locally on port: " +
        NODE_PORT
    );
});