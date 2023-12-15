const express = require('express');
const app = express();
const itemRoutes = require('./itemRoutes')
const ExpressError = require('./expressError');

app.use(express.json());
app.use('/items', itemRoutes);

app.use(function(req,res,next){
    return new ExpressError('Page Not Found', 404)
});

app.use((err, req, res, next) => {
    let status = res.status(err.status || 500)
    let msg = err.message
    return res.json({
        error: {message: msg, status: status}
    })
})

module.exports = app;