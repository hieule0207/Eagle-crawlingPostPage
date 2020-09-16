const router = require("express").Router();

const CrawlingRoute = require("./crawling.api");

router.use("/crawling", CrawlingRoute);
module.exports = router;