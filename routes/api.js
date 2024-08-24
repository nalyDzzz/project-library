const { MongoClient, ServerApiVersion } = require("mongodb");
const crypto = require("crypto");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

class Books {
  constructor(title) {
    this.comments = [];
    this._id = this.generateId();
    this.title = title;
    this.commentcount = this.comments.length;
    this.__v = this.comments.length;
  }
  generateId() {
    return crypto.randomBytes(12).toString("hex");
  }
  toObject() {
    return {
      comments: this.comments,
      _id: this._id,
      title: this.title,
      commentcount: this.commentcount,
      __v: this.__v,
    };
  }
}

let collection;

const run = async () => {
  try {
    await client.connect();
    const db = client.db("library");
    collection = db.collection("books");
    console.log("You are connected to your DB!");
  } catch (err) {
    console.error(err);
  }
};

run();

("use strict");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      console.log(req.params, req.url, req.method);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const result = await collection.find({}).toArray();
        res.json(result);
      } catch (err) {
        if (err) console.error(err);
      }
    })

    .post(async function (req, res) {
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if (!title) {
        return res.send("missing required field title");
      } else {
        try {
          const newBook = new Books(title);
          const result = await collection.insertOne(newBook.toObject());
          console.log("Insert Result:", result);
          res.json({
            _id: newBook._id,
            title: newBook.title,
          });
        } catch (err) {
          if (err) console.error(err);
        }
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        const result = await collection.deleteMany({});
        if (result) res.send("complete delete successful");
      } catch (err) {
        if (err) console.error(err);
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      console.log(req.params, req.url, req.method);
      let bookid = req.params.id;
      if (!bookid) {
        res.send("no book exists");
      } else {
        try {
          const result = await collection.findOne({ _id: bookid });
          if (!result) {
            return res.send("no book exists");
          } else {
            res.json(result);
          }
        } catch (err) {
          if (err) console.error(err);
        }
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send("missing required field comment");
      }

      try {
        const result = await collection.updateOne(
          { _id: bookid },
          { $push: { comments: comment } }
        );
        if (result.matchedCount === 0) {
          return res.send("no book exists");
        }
        const updatedBook = await collection.findOne({ _id: bookid });
        res.json(updatedBook);
      } catch (err) {
        if (err) console.error(err);
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const result = await collection.deleteOne({ _id: bookid });
        if (result.deletedCount === 0) {
          return res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      } catch (err) {
        if (err) console.error(err);
      }
    });
};
