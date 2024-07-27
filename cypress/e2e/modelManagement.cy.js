const { faker } = require("@faker-js/faker");
const {
  postRequest,
  getRequest,
  deleteRequest,
} = require("../requests/apiRequests.js");

describe("Model Management API", () => {
  let modelId;
  let versionId;

  const baseUrl = Cypress.config("baseUrl");
  const name = faker.person.fullName();
  const owner = faker.person.fullName();
  const versionName = faker.person.fullName();
  const huggingFaceModel = "gpt2";

  it("should successfully create a new model", () => {
    const body = { name, owner };
    postRequest(`${baseUrl}/models`, body, 200, true).then((response) => {
      modelId = response.body.id;
    });
  });

  it('should return an error when adding a model with a missing "name" field', () => {
    const body = { owner };
    postRequest(`${baseUrl}/models`, body, 400, true); // Assuming 400 is the expected status for this error
  });

  it("should retrieve the list of models", () => {
    getRequest(`${baseUrl}/models`).then((response) => {
      const foundItem = response.body.find((item) => item.id === modelId);
      expect(foundItem).to.not.be.undefined;
      expect(foundItem).to.include({ id: modelId, name, owner });
    });
  });

  it("should successfully add a new version to a model", () => {
    const body = {
      name: versionName,
      hugging_face_model: huggingFaceModel,
    };
    postRequest(`${baseUrl}/models/${modelId}/versions`, body, 200, true).then(
      (response) => {
        versionId = response.body.id;
      }
    );
  });

  it("should retrieve the version details for a model", () => {
    getRequest(`${baseUrl}/models/${modelId}/versions/`);
  });

  it("should perform inference on a specific model version", () => {
    const body = {
      text: "text48",
      apply_template: false,
      max_new_tokens: 256,
      do_sample: true,
      temperature: 0.7,
      top_k: 50,
      top_p: 0.95,
    };
    cy.request({
      method: "POST",
      url: `${baseUrl}/models/${modelId}/versions/${versionId}/infer`,
      body,
      timeout: 900000,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include("text48");
    });
  });

  it("should successfully delete a version of a model", () => {
    deleteRequest(`${baseUrl}/models/${modelId}/versions/${versionId}`);
  });

  it("should successfully delete the created model", () => {
    deleteRequest(`${baseUrl}/models/${modelId}`);
  });

  it("should throw 404 for deleting an already deleted model", () => {
    deleteRequest(`${baseUrl}/models/${modelId}`, 404);
  });

  it("should return an error when deleting a non-existent model", () => {
    deleteRequest(`${baseUrl}/models/invalidModelId`, 404);
  });

  it("should return an error for adding a model with an invalid owner", () => {
    const body = { name, owner: 12345 };
    postRequest(`${baseUrl}/models`, body, 422, false);
  });

  it("should return an error when adding a version to a non-existent model", () => {
    const body = {
      name: versionName,
      hugging_face_model: huggingFaceModel,
    };
    postRequest(`${baseUrl}/models/24324/versions`, body, 404, false);
  });

  it("should validate the model schema", () => {
    const body = { name, owner };
    postRequest(`${baseUrl}/models`, body).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.all.keys("id", "name", "owner");
    });
  });

  it("should return 404 for an invalid model and version id for inference request", () => {
    const invalidBody = {
      text: "any",
      apply_template: "yes",
    };
    cy.request({
      method: "POST",
      url: `${baseUrl}/models/wr234234/versions/234weadf/infer`,
      body: invalidBody,
      timeout: 900000,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
