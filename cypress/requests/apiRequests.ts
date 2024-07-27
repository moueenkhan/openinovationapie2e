export const postRequest = (
  url: string,
  body: object,
  expectedStatus: number = 200,
  failOnStatusCode: boolean = true
) => {
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

export const getRequest = (url: string, expectedStatus: number = 200) => {
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

export const deleteRequest = (url: string, expectedStatus: number = 200) => {
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
