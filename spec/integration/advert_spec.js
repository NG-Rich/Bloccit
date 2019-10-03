const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertise/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advert = require("../../src/db/models").Advert;

describe("routes : advertisement", () => {

  beforeEach((done) => {
    this.advert;
    sequelize.sync({force: true}).then((res) => {

      Advert.create({
        title: "Advertise Here!",
        description: "You can advertise on this site!"
      })
      .then((advert) => {
        this.advert = advert;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

    });
  });

  describe("GET /advertise", () => {

    it("should return a status code 200 and all adverts", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertise Here!");
        done();
      });
    });

  });

  describe("GET /advertise/new", () => {

    it("should render an advertisement form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });

  });

  describe("POST /advertise/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Google Adspace",
        description: "Earn extra income with Google Adspace"
      }
    };

    it("should create the new ad and redirect", (done) => {

      request.post(options, (err, res, body) => {
        Advert.findOne({where: {title: "Google Adspace"}})
        .then((advert) => {
          expect(res.statusCode).toBe(303);
          expect(advert.title).toBe("Google Adspace");
          expect(advert.description).toBe("Earn extra income with Google Adspace");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });

    });

  });

  describe("GET /advertise/:id", () => {

    it("should render a view with the selected ad", (done) => {
      request.get(`${base}${this.advert.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Advertise Here!");
        done();
      });
    });

  });

  describe("POST /advertise/:id/destroy", () => {

    it("should detroy a selected ad with the associated id", (done) => {

      Advert.findAll()
      .then((adverts) => {

        const advertCountBeforeDelete = adverts.length;

        expect(advertCountBeforeDelete).toBe(1);

        request.post(`${base}${this.advert.id}/destroy`, (err, res, body) => {
          Advert.findAll()
          .then((adverts) => {
            expect(err).toBeNull();
            expect(adverts.length).toBe(advertCountBeforeDelete - 1);
            done();
          })

        });
      });

    });
  });

  describe("GET /advertise/:id/edit", () => {

    it("should render a view in which you can edit your ad", (done) => {
      request.get(`${base}${this.advert.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        expect(body).toContain("Advertise Here!");
        done();
      });
    });


  });

  describe("POST /advertise/:id/update", () => {

    it("should update the ad with the given values", (done) => {
      const options = {
        url: `${base}${this.advert.id}/update`,
        form: {
          title: "Your Ad Here",
          description: "Earn extra income!"
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Advert.findOne({
          where: {id: this.advert.id}
        })
        .then((advert) => {
          expect(advert.title).toBe("Your Ad Here");
          done();
        });
      });
      
    });

  });

});
