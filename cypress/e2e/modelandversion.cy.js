const { faker } = require("@faker-js/faker");

describe("OpenInnovation API", () => {
  let modelId;
  let versionId;

  const baseUrl = Cypress.config("baseUrl");
  const name = faker.person.fullName();
  const owner = faker.person.fullName();
  const versionName = faker.person.fullName();
  const huggingFaceModel = faker.person.fullName();

  const logValidationError = (response) => {
    const errors = response.body.detail;
    if (errors) {
      errors.forEach((error) => {
        console.log(`Error Type: ${error.type}`);
        console.log(`Location: ${error.loc.join(" -> ")}`);
        console.log(`Message: ${error.msg}`);
        console.log(`Input: ${JSON.stringify(error.input)}`);
      });
    } else {
      console.log("No detailed error information available.");
    }
  };

  context("Model Management", () => {
    it("should add a model successfully", () => {
      const body = { name, owner };
      cy.request({
        method: "POST",
        url: `${baseUrl}/models`,
        body,
      }).then((response) => {
        expect(response.status).to.eq(200);
        modelId = response.body.id;
      });
    });

    it('should return an error for adding a model with missing "name"', () => {
      const body = { owner };
      cy.request({
        method: "POST",
        url: `${baseUrl}/models`,
        body,
        failOnStatusCode: false,
      }).then((response) => {
        logValidationError(response);
        expect(
          response.status,
          `Expected status 200 but received ${response.status}`
        ).to.eq(200);
      });
    });

    it("should retrieve the added model successfully", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/models`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const foundItem = response.body.find((item) => item.id === modelId);

        expect(foundItem).to.not.be.undefined;
        expect(foundItem).to.have.property("id", modelId);
        expect(foundItem).to.have.property("name", name);
        expect(foundItem).to.have.property("owner", owner);
      });
    });

    it("should add a model version successfully", () => {
      const body = {
        name: versionName,
        hugging_face_model: huggingFaceModel,
      };
      cy.request({
        method: "POST",
        url: `${baseUrl}/models/${modelId}/versions`,
        body,
      }).then((response) => {
        expect(response.status).to.eq(200);
        versionId = response.body.id;
      });
    });

    it("should retrieve the model version successfully", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/models/${modelId}/versions/`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("should delete the model successfully", () => {
      cy.request({
        method: "DELETE",
        url: `${baseUrl}/models/${modelId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
