const router = require("express").Router();

router.get('/', async (req, res) => {
    res.render('index.ejs', { title: "Eagle Dashboard" })
});
router.get('/crawl', async (req, res) => {
    res.render('crawlingForm.ejs', { title: "Eagle Dashboard" })
});
router.post('/crawl', async (req, res) => {
    console.log(req.body)
    res.render('crawlingForm.ejs', { title: "Eagle Dashboard" })
});
router.get('/login', async (req, res) => {
    res.render('login.ejs', { title: "Eagle Dashboard" })
});
module.exports = router;