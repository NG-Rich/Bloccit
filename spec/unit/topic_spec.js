const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;


describe("TOPIC", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        })
      });

    });

  });

  describe("#create()", () => {

    it("should create a topic object and store it in the database", (done) => {

      Topic.create({
        title: "The Pros and Cons of Driving",
        description: "A list of pros and cons to driving"
      })
      .then((topic) => {
        expect(topic.title).toBe("The Pros and Cons of Driving");
        expect(topic.description).toBe("A list of pros and cons to driving");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

    });

  });


  describe("#getPosts()", () => {

    it("should return the post object with the topic in scope", (done) => {

      this.topic.getPosts()
      .then((associatedPosts) => {
        expect(associatedPosts[0].title).toContain("My first visit to Proxima Centauri b");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

    });

  });

});
