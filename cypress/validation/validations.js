const logValidationError = (response) => {
    const errors = response.body.detail;
    if (errors) {
      errors.forEach((error) => {
        console.error(`Error Type: ${error.type}`);
        console.error(`Location: ${error.loc.join(" -> ")}`);
        console.error(`Message: ${error.msg}`);
        console.error(`Input: ${JSON.stringify(error.input)}`);
      });
    } else {
      console.error("No detailed error information available.");
    }
  };
  
  module.exports = {
    logValidationError
  };
  