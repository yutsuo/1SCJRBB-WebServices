const apiDoc = {
    swagger: "2.0",
    basePath: "/",
    info: {
      title: "SGS Bacen API",
      version: "1.0.0",
    },
    definitions: {
      Metric: {
        type: "object",
        properties: {
          code: {
            type: "number",
          },
          date: {
            type: "string",
          },
        },
        required: ["code", "date"],
      },
    },
    paths: {},
  };
  
  export default apiDoc;
