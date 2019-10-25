const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

function authorizeUser(role, done) {
  User.create({
    email: `${role}@example.com`,
    password: "123456",
    role: role
  })
  .then((user) => {
    request.get({
      url: "http://localhost:3000/auth/fake",
      form: {
        role: user.role,
        userId: user.id,
        email: user.email
      }
    },
      (err, res, body) => {
        done();
      }
    );
  });
}

describe("routes : topics", () => {

  beforeEach((done) => {
    this.topic;
    sequelize.sync({force: true}).then((res) => {

      Topic.create({
        title: "Javascript Frameworks",
        description: "There is a lot of them"
      })
      .then((topic) => {
        this.topic = topic;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("admin user performing CRUD actions for Topic", () => {

 beforeEach((done) => {
   authorizeUser("admin", done);
 });

  describe("GET /topics", () => {

    it("should respond with all topics", (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Topics");
        expect(body).toContain("Javascript Frameworks");
        done();
      });
    });
  });


 describe("GET /topics/new", () => {

      it("should render a new topic form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Topic");
          done();
        });
      });

    });

   describe("POST /topics/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?"
        }
      };

      it("should create a new topic and redirect", (done) => {
        request.post(options,
          (err, res, body) => {
            Topic.findOne({where: {title: "blink-182 songs"}})
            .then((topic) => {
              expect(topic.title).toBe("blink-182 songs");
              expect(topic.description).toBe("What's your favorite blink-182 song?");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });

  describe("GET /topics/:id", () => {

     it("should render a view with the selected topic", (done) => {
       request.get(`${base}${this.topic.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Javascript Frameworks");
         done();
       });
     });

   });

 describe("POST /topics/:id/destroy", () => {

     it("should delete the topic with the associated ID", (done) => {
       Topic.findAll()
       .then((topics) => {
         const topicCountBeforeDelete = topics.length;

         expect(topicCountBeforeDelete).toBe(1);

         request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
           Topic.findAll()
           .then((topics) => {
             expect(err).toBeNull();
             expect(topics.length).toBe(topicCountBeforeDelete - 1);
             done();
           })

         });
       })

     });

   });

   describe("GET /topics/:id/edit", () => {

     it("should render a view with an edit topic form", (done) => {
       request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Edit Topic");
         expect(body).toContain("Javascript Frameworks");
         done();
       });
     });

   });

   describe("POST /topics/:id/update", () => {

     it("should update the topic with the given values", (done) => {
        request.post({
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "Javascript Frameworks",
            description: "There are a lot of them"
          }
        }, (err, res, body) => {
          expect(err).toBeNull();
          Topic.findOne({
            where: {id:1}
          })
          .then((topic) => {
            expect(topic.title).toBe("Javascript Frameworks");
            done();
          });
        });
      });
    });
  });


   describe("member user performing CRUD actions for Topic", () => {

     beforeEach((done) => {
      authorizeUser("member", done);
    });

     describe("GET /topics", () => {

       it("should respond with all topics", (done) => {
         request.get(base, (err, res, body) => {
           expect(err).toBeNull();
           expect(body).toContain("Topics");
           expect(body).toContain("Javascript Frameworks");
           done();
         });
       });
     });

     describe("GET /topics/new", () => {

         it("should redirect to topics view", (done) => {
           request.get(`${base}new`, (err, res, body) => {
             expect(err).toBeNull();
             expect(body).toContain("Topics");
             done();
           });
         });

       });

       describe("POST /topics/create", () => {
         const options = {
           url: `${base}create`,
           form: {
             title: "blink-182 songs",
             description: "What's your favorite blink-182 song?"
           }
         };

         it("should not create a new topic", (done) => {
           request.post(options,
             (err, res, body) => {
               Topic.findOne({where: {title: "blink-182 songs"}})
               .then((topic) => {
                 expect(topic).toBeNull();
                 done();
               })
               .catch((err) => {
                 console.log(err);
                 done();
               });
             }
           );
         });
       });

       describe("GET /topics/:id", () => {

        it("should render a view with the selected topic", (done) => {
          request.get(`${base}${this.topic.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Javascript Frameworks");
            done();
          });
        });
      });

      describe("POST /topics/:id/destroy", () => {

        it("should not delete the topic with the associated ID", (done) => {

          Topic.findAll()
          .then((topics) => {
            const topicCountBeforeDelete = topics.length;
            expect(topicCountBeforeDelete).toBe(1);

            request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
              Topic.findAll()
              .then((topics) => {
                expect(topics.length).toBe(topicCountBeforeDelete);
                done();
              })

            });
          })

        });

      });

      describe("GET /topics/:id/edit", () => {

        it("should not render a view with an edit topic form", (done) => {
          request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).not.toContain("Edit Topic");
            expect(body).toContain("Javascript Frameworks");
            done();
          });
        });

      });

      describe("POST /topics/:id/update", () => {

        it("should not update the topic with the given values", (done) => {
           const options = {
              url: `${base}${this.topic.id}/update`,
              form: {
                title: "Javascript Frameworks",
                description: "There are a lot of them"
              }
            }

            request.post(options,
              (err, res, body) => {
              expect(err).toBeNull();
              Topic.findOne({
                where: { id:1 }
              })
              .then((topic) => {
                expect(topic.title).toBe("Javascript Frameworks");
                done();
              });
            });
        });

      });

});

});
