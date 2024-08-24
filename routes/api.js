const { MongoClient, ServerApiVersion } = require('mongodb');
const crypto = require('crypto');
const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

class Books {
  constructor(title) {
    this._id = this.generateId();
    this.title = title;
  }
  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }
}

console.log(new Books)

const run = async () => {
  try {
    await client.connect();
    const db = client.db('database');
    const collection = db.collection('documents');
    console.log("You are connected!");
  } catch (err) {
    console.error(err);
  }
}

run()


'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
