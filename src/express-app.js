const express = require("express");
const cors = require("cors");
const { admin } = require("./api");
const path = require("path");
const fs = require('fs'); 
const { CreateChannel } = require("./utils");

module.exports = async (app) => {

  // Directory where you want to save images
  const dir = path.join(__dirname, '../images');

  // Check if directory exists, if not, create it
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
  
  app.use(express.json());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  app.use('/images', express.static(path.join(__dirname, '../images')));
  console.log('dirname:', __dirname);

  const channel = await CreateChannel();

  admin(app, channel);
};
