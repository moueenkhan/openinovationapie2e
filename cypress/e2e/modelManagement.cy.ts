import { faker } from "@faker-js/faker";
import {
  postRequest,
  getRequest,
  deleteRequest,
} from "../requests/apiRequests";

describe("Model Management API", () => {
  let modelId: string;
  let versionId: string;

  const baseUrl = Cypress.config("baseUrl") as string;
  const name = faker.person.fullName();
  const owner = faker.person.fullName();
  const versionName =
    faker.word.adjective() + "-" + faker.number.int({ min: 1, max: 1000 });
  const huggingFaceModel = "gpt2";

  it("should successfully create a new model", () => {
    const body = { name, owner };
    postRequest(`${baseUrl}/models`, body, 200, true).then((response) => {
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("name", name);
      expect(response.body).to.have.property("owner", owner);
      expect(response.body.id)
        .to.be.a("string")
        .and.to.match(/^[a-zA-Z0-9_-]+$/);
      modelId = response.body.id;
    });
  });

  it("should retrieve the list of models", () => {
    getRequest(`${baseUrl}/models`).then((response) => {
      expect(response.body).to.be.an("array");
      const foundItem = response.body.find((item: any) => item.id === modelId);
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
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("name", versionName);
        expect(response.body).to.have.property(
          "hugging_face_model",
          huggingFaceModel
        );
        expect(response.body.id)
          .to.be.a("string")
          .and.to.match(/^[a-zA-Z0-9_-]+$/);
        versionId = response.body.id;
      }
    );
  });

  it("should retrieve the version details for a model", () => {
    getRequest(`${baseUrl}/models/${modelId}/versions/`).then((response) => {
      expect(response.body).to.be.an("array");
      const foundVersion = response.body.find(
        (version: any) => version.id === versionId
      );
      expect(foundVersion).to.not.be.undefined;
      expect(foundVersion).to.include({
        id: versionId,
        name: versionName,
        hugging_face_model: huggingFaceModel,
      });
    });
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

  it("should validate the model schema", () => {
    const body = { name, owner };
    postRequest(`${baseUrl}/models`, body).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.all.keys("id", "name", "owner");
      expect(response.body.id)
        .to.be.a("string")
        .and.to.match(/^[a-zA-Z0-9_-]+$/);
      expect(response.body.name).to.be.a("string");
      expect(response.body.owner).to.be.a("string");
    });
  });

  it("should return an error when creating a model with an existing name and owner", () => {
    const body = { name, owner };
    postRequest(`${baseUrl}/models`, body, 400, false).then((response) => {
      expect(response.body.detail).to.equal(`Duplicate name: ${name}`);
    });
  });

  it('should return an error when adding a model with a missing "name" field', () => {
    const body = { owner };
    postRequest(`${baseUrl}/models`, body, 400, true).then((response) => {
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("name");
    });
  });

  it("should throw 404 for deleting an already deleted model", () => {
    deleteRequest(`${baseUrl}/models/${modelId}`, 404).then((response) => {
      expect(response.body).to.have.property("detail");
      expect(response.body.detail).to.equal("Model not found");
    });
  });

  it("should return an error when deleting a non-existent model", () => {
    deleteRequest(`${baseUrl}/models/invalidModelId`, 404).then((response) => {
      expect(response.body.detail).to.equal("Model not found");
    });
  });

  it("should return an error for adding a model with an invalid owner", () => {
    const body = { name, owner: faker.number.int({ min: 1, max: 5 }) };
    postRequest(`${baseUrl}/models`, body, 422, false).then((response) => {
      expect(response.body).to.have.property("detail").that.is.an("array").that
        .is.not.empty;
      const [error] = response.body.detail;
      expect(error).to.have.property("msg", "Input should be a valid string");
    });
  });

  it("should return an error when adding a version to a non-existent model", () => {
    const body = {
      name: versionName,
      hugging_face_model: huggingFaceModel,
    };
    postRequest(`${baseUrl}/models/24324/versions`, body, 404, false).then(
      (response) => {
        expect(response.body.detail).to.equal("Model not found");
      }
    );
  });

  it("should return 404 for an invalid model and version id for inference request", () => {
    const invalidBody = {
      text: faker.lorem.sentence(),
      apply_template: 1,
    };
    cy.request({
      method: "POST",
      url: `${baseUrl}/models/wr234234/versions/234weadf/infer`,
      body: invalidBody,
      timeout: 900000,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.detail).to.equal("Model version not found");
    });
  });
});
