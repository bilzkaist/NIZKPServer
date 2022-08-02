/**
 * Application Type: Server
 * Route Handler: static
 * Description: Serve static pages for the api domain
 * 
 */


// Dependencies
const ResquestError = require('./../errors/request');
const path = require('path');
const express = require('express');

const winston = require('winston');
const expressWinston = require('express-winston');

let _ = {};

// Load the server
// _.default = async (res, req) => {

//      try {
//           console.log(res)

//                res.render('pages/index');

//              return true
//              // resolve();
//          // }
//      } catch (err) {
 
//          throw( new Error(err));
//      }
     
//  };

// Method to access home
_.home = async (req, res) => {  
     return res.status(200).render('pages/index');
};
 
_.about = async (req, res) => {  
     return res.status(200).render('pages/about');
};

_.apiendpoints = async (req, res) => {  
     return res.status(200).render('pages/apiendpoints');
};
_.contact = async (req, res) => {  
     return res.status(200).render('pages/contact');
};
// Export App Server module as _ to run in index.js entry point
module.exports = _;