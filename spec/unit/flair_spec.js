const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {

  beforeEach((done) => {
    this.topic;
    this.flair;

    sequelize.sync({force: true}).then((res) => {

      Topic.create({
        title: "Learning Your ABC's",
        description: "Steps to learning your ABC's."
      })
      .then((topic) => {
        this.topic = topic;

        Flair.create({
          name: "For Kids",
          color: "Yellow",
          topicId: this.topic.id
        })
        .then((flair) => {
          this.flair = flair;
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

    it("should create a flair object to an associated topic", (done) => {

      Flair.create({
        name: "For Ages 5+",
        color: "Orange",
        topicId: this.topic.id
      })
      .then((flair) => {
        expect(flair.name).toBe("For Ages 5+");
        expect(flair.color).toBe("Orange");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a flair with a missing name, color, or associated topic", (done) => {

      Flair.create({
        name: "Just 4 Kidz"
      })
      .then((flair) => {
        // This block will not run and be skipped.
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Flair.color cannot be null");
        expect(err.message).toContain("Flair.topicId cannot be null");
        done();
      })

    });//end of it

  });//end of describe

  describe("#setTopic()", () => {

    it("should associate the topic with the flair", (done) => {

      Topic.create({
        title: "Counting to Ten!",
        description: "Let's learn how to count to ten!"
      })
      .then((newTopic) => {
        expect(this.flair.topicId).toBe(this.topic.id);
        this.flair.setTopic(newTopic)
        .then((flair) => {
          expect(flair.topicId).toBe(newTopic.id);
          done();
        });
      })
    });

  });

  describe("#getTopic()", () => {

    it("should get the topic with the associated flair", (done) => {

      this.flair.getTopic()
      .then((associatedTopic) => {
        expect(associatedTopic.title).toBe("Learning Your ABC's");
        done();
      });
    });

  });

});
