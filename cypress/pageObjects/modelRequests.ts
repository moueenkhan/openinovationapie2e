class ModelPage {
  createModel(name: string, owner: string) {
    const body = { name, owner };
    return cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/models`,
      body,
      failOnStatusCode: false,
    });
  }

  getModels() {
    return cy.request({
      method: "GET",
      url: `${Cypress.config("baseUrl")}/models`,
    });
  }

  addVersionToModel(modelId: string, name: string, huggingFaceModel: string) {
    const body = { name, hugging_face_model: huggingFaceModel };
    return cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/models/${modelId}/versions`,
      body,
      failOnStatusCode: false,
    });
  }

  getModelVersions(modelId: string) {
    return cy.request({
      method: "GET",
      url: `${Cypress.config("baseUrl")}/models/${modelId}/versions`,
      failOnStatusCode: false,
    });
  }

  performInference(modelId: string, versionId: string, body: object) {
    return cy.request({
      method: "POST",
      url: `${Cypress.config(
        "baseUrl"
      )}/models/${modelId}/versions/${versionId}/infer`,
      body,
      timeout: 900000,
      failOnStatusCode: false,
    });
  }

  deleteModel(modelId: string) {
    return cy.request({
      method: "DELETE",
      url: `${Cypress.config("baseUrl")}/models/${modelId}`,
      failOnStatusCode: false,
    });
  }

  deleteModelVersion(modelId: string, versionId: string) {
    return cy.request({
      method: "DELETE",
      url: `${Cypress.config(
        "baseUrl"
      )}/models/${modelId}/versions/${versionId}`,
      failOnStatusCode: false,
    });
  }

  createModelWithoutName(owner: string) {
    return cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/models`,
      body: { owner },
      failOnStatusCode: true,
    });
  }

  createModelWithExtraFields(name: string, owner: string, extraField: string) {
    const body = {
      name: name,
      owner: owner,
      extrafield: extraField,
    };
    return cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/models`,
      body: body,
      failOnStatusCode: false,
    });
  }
}

export default new ModelPage();
