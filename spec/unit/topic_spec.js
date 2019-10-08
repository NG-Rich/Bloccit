const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;


describe("TOPIC", () => {

  beforeEach((done) => {
    this.topic;
    this.post;

    sequelize.sync({force: true}).then((res) => {

      Topic.create({
        title: "Are motorbikes dangerous?",
        description: "Are motorbikes more dangerous than cars?"
      })
      .then((topic) => {
        this.topic = topic;

        Post.create({
          title: "Motorbikes are cool",
          body: "They are too cool to be dangerous.",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
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
        expect(associatedPosts[0].title).toContain("Motorbikes are cool");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

    });

  });

});
