const postRequest = (url, body, expectedStatus = 200, failOnStatusCode = true) => {
  return cy
    .request({
      method: "POST",
      url,
      body,
      failOnStatusCode,
    })
    .then((response) => {
      if (response.status !== expectedStatus) {
        console.log(response);
      }
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
};

const getRequest = (url, expectedStatus = 200) => {
  return cy
    .request({
      method: "GET",
      url,
      failOnStatusCode: false,
    })
    .then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
};

const deleteRequest = (url, expectedStatus = 200) => {
  return cy
    .request({
      method: "DELETE",
      url,
      failOnStatusCode: false,
    })
    .then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
};

module.exports = {
  postRequest,
  getRequest,
  deleteRequest,
};
