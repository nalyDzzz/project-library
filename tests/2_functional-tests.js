/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Sample Title" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id");
              assert.equal(res.body.title, "Sample Title");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            })
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "title");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get('/api/books/1555')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          })
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get('/api/books/123')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments);
            assert.equal(res.body._id, '123');
            assert.equal(res.body.title, "Sample");
            assert.property(res.body, "commentcount");
            assert.property(res.body, "__v");
            done();
          })
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post('/api/books/123')
            .send({ _id: '123', comment: "Sample Comment"})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "Sample");
              assert.equal(res.body._id, "123");
              assert.isArray(res.body.comments);
              assert.isAtLeast(res.body.comments.length, 1);
              assert.isAtLeast(res.body.commentcount, 1);
              assert.isAtLeast(res.body.__v, 1);
              done();
            })
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post('/api/books/123')
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");
              done();
            })
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post('/api/books/1555')
            .send({ comment: "Sample Comment"})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
              done();
            })
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete('/api/books/123')
          .send()
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          })
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete('/api/books/1555')
          .send()
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          })
      });
    });
  });
});
