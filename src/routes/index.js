const express = require('express');
const IndexController = require('../controllers/index').IndexController;

function setRoutes(app) {
    const router = express.Router();
    const indexController = new IndexController();

    router.get('/', indexController.getIndex.bind(indexController));

    app.use('/', router);
}

module.exports = setRoutes;