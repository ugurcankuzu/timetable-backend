const express=require('express');

const route= express.Router();
const defaultEndPoint =(req,res)=> {
    res.send("404 not found");
};

route
.route("*")
.get(defaultEndPoint)
.patch(defaultEndPoint)
.post(defaultEndPoint)
.delete(defaultEndPoint);

  module.exports = route
 