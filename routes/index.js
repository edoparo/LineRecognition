var express = require('express');
var router = express.Router();

const pm = require('../core/point_manager');
const P = require('../utils/Point');


router.get('/space', (req, res) => {
    res.status(200).json(pm.getSpace()).end();
});

router.get('/lines/:n([0-9]{1,})', (req, res) => {
    try {
        let result = pm.getLines(parseInt(req.params.n));
        res.status(200).json(result).end();
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'internal error: ' + e.message}).end();
    }
});

router.post('/point', (req, res) => {
    let p;
    try {
        //all validation checks are demanded to the class
        p = new P(req.body);
    } catch (e) {
        res.status(400).json({message: e.message}).end();
        return;
    }

    try {
        if (pm.isPointInSpace(p)) {
            res.status(209).json({message: 'The point is already part of the space'}).end();
            return;
        }

        pm.addPointToSpace(p);
        res.status(204).json().end();
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'internal error: ' + e.message}).end();
    }
});

router.delete('/space', function (req, res) {
    pm.truncateSpace();
    res.status(204).json().end();
});

module.exports = router;
