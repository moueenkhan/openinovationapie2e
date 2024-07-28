import { faker } from "@faker-js/faker";
import ModelPage from "../pageObjects/modelRequests";
import ResponseValidator from "../pageObjects/responseValidator";

describe("Model Management API", () => {
  let modelId: string;
  let versionId: string;

  const name = faker.person.fullName();
  const owner = faker.person.fullName();
  const versionName =
    faker.word.adjective() + "-" + faker.number.int({ min: 1, max: 1000 });
  const huggingFaceModel = "gpt2";

  // Test Cases for Model Creation
  it("should successfully create a new model", () => {
    ModelPage.createModel(name, owner).then((response) => {
      ResponseValidator.validateCreateModelResponse(response, name, owner);
      modelId = response.body.id;
    });
  });

  it("should return an error when creating a model with an existing name and owner", () => {
    ModelPage.createModel(name, owner).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.detail).to.equal(`Duplicate name: ${name}`);
    });
  });

  it('should return an error when adding a model with a missing "name" field', () => {
    ModelPage.createModelWithoutName(owner).then((response) => {
      expect(response.status).to.eq(422);
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("name");
    });
  });

  it("should return an error for adding a model with an invalid owner", () => {
    const body = { name, owner: faker.number.int({ min: 1, max: 5 }) as any };
    ModelPage.createModel(body.name, body.owner).then((response) => {
      expect(response.status).to.eq(422);
      expect(response.body).to.have.property("detail").that.is.an("array").that
        .is.not.empty;
      const [error] = response.body.detail;
      expect(error).to.have.property("msg", "Input should be a valid string");
    });
  });

  it("Should return 422 when extra fields are included in the model creation request", () => {
    const name = faker.person.fullName();
    const owner = faker.person.fullName();
    const extraField = "Extra Text";

    ModelPage.createModelWithExtraFields(name, owner, extraField).then(
      (response) => {
        expect(response.status).to.eq(422);
      }
    );
  });

  it("should validate the model schema", () => {
    const modelName = faker.person.fullName();
    const ownerName = faker.person.fullName();
    ModelPage.createModel(modelName, ownerName).then((response) => {
      ResponseValidator.validateModelSchema(response);
    });
  });

  // Test Cases to Get List of Created Models
  it("should retrieve the list of models", () => {
    ModelPage.getModels().then((response) => {
      ResponseValidator.validateGetModelsResponse(
        response,
        modelId,
        name,
        owner
      );
    });
  });

  it("should fail to retrieve the list of models if model id is appended with url", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.config("baseUrl")}/models/${modelId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(405);
    });
  });

  // Test Cases for Adding version to a model
  it("should successfully add a new version to a model", () => {
    ModelPage.addVersionToModel(modelId, versionName, huggingFaceModel).then(
      (response) => {
        ResponseValidator.validateAddVersionResponse(
          response,
          versionName,
          huggingFaceModel
        );
        versionId = response.body.id;
      }
    );
  });

  it("should return an error when adding a version to a non-existent model", () => {
    ModelPage.addVersionToModel("24324", versionName, huggingFaceModel).then(
      (response) => {
        expect(response.status).to.eq(404);
        expect(response.body.detail).to.equal("Model not found");
      }
    );
  });

  // Test Cases to get details of a version added in a model
  it("should retrieve the version details for a model", () => {
    ModelPage.getModelVersions(modelId).then((response) => {
      ResponseValidator.validateGetModelVersionsResponse(
        response,
        versionId,
        versionName,
        huggingFaceModel
      );
    });
  });

  it("should fail to retrieve version details with an invalid model ID", () => {
    const invalidModelId = "invalidModelId";
    ModelPage.getModelVersions(invalidModelId).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("detail");
      expect(response.body.detail).to.equal("Model not found");
    });
  });

  // Test Cases to perform inference on a specfic model version
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
    ModelPage.performInference(modelId, versionId, body).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include("text48");
    });
  });

  it("should return 404 for an invalid model and version id for inference request", () => {
    const invalidBody = {
      text: faker.lorem.sentence(),
      apply_template: 1,
    };
    ModelPage.performInference("wr234234", "234weadf", invalidBody).then(
      (response) => {
        expect(response.status).to.eq(404);
        expect(response.body.detail).to.equal("Model version not found");
      }
    );
  });

  //Test Cases to delete version and model
  it("should successfully delete a version of a model", () => {
    ModelPage.deleteModelVersion(modelId, versionId).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should successfully delete the created model", () => {
    ModelPage.deleteModel(modelId).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should throw 404 for deleting an already deleted model", () => {
    ModelPage.deleteModel(modelId).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("detail");
      expect(response.body.detail).to.equal("Model not found");
    });
  });

  it("should return an error when deleting a non-existent model", () => {
    ModelPage.deleteModel("invalidModelId").then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.detail).to.equal("Model not found");
    });
  });
});
