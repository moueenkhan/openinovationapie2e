class ResponseValidator {
  validateCreateModelResponse(
    response: Cypress.Response<any>,
    name: string,
    owner: string
  ) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property("id");
    expect(response.body).to.have.property("name", name);
    expect(response.body).to.have.property("owner", owner);
    expect(response.body.id)
      .to.be.a("string")
      .and.to.match(/^[a-zA-Z0-9_-]+$/);
  }

  validateGetModelsResponse(
    response: Cypress.Response<any>,
    modelId: string,
    name: string,
    owner: string
  ) {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an("array");
    const foundItem = response.body.find((item: any) => item.id === modelId);
    expect(foundItem).to.not.be.undefined;
    expect(foundItem).to.include({ id: modelId, name, owner });
  }

  validateAddVersionResponse(
    response: Cypress.Response<any>,
    versionName: string,
    huggingFaceModel: string
  ) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property("id");
    expect(response.body).to.have.property("name", versionName);
    expect(response.body).to.have.property(
      "hugging_face_model",
      huggingFaceModel
    );
    expect(response.body.id)
      .to.be.a("string")
      .and.to.match(/^[a-zA-Z0-9_-]+$/);
  }

  validateGetModelVersionsResponse(
    response: Cypress.Response<any>,
    versionId: string,
    versionName: string,
    huggingFaceModel: string
  ) {
    expect(response.status).to.eq(200);
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
  }

  validateModelSchema(response: Cypress.Response<any>) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.all.keys("id", "name", "owner");
    expect(response.body.id)
      .to.be.a("string")
      .and.to.match(/^[a-zA-Z0-9_-]+$/);
    expect(response.body.name).to.be.a("string");
    expect(response.body.owner).to.be.a("string");
  }
}

export default new ResponseValidator();
