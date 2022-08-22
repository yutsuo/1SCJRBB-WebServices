import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "SGS Bacen API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    definitions: {
        Metric: {
            code: "4392"
        },
        SingleDate: "15/08/2022",
        RangedDate: {
            startDate: "01/03/2022",
            endDate: "01/05/2022"
        },
        SingleResult: { "15/08/2022": "13.55" },
        Info: {
            "code": 4392,
            "short_name": "Taxa de juros - CDI acumulada no mês anualizada base ",
            "unit": "% a.a.",
            "periodicity": "M",
            "start_date": "31-07-1986",
            "latest_date": "ago/2022",
            "source": "BCB-Demab",
            "special_flag": "N"
        }
    },
    host: "localhost:3001",
    basePath: "/",
    schemes: ['http'],
    paths: {},
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);