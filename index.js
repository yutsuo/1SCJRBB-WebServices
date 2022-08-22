//* Libraries (ES6 import)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as soap from "soap";
import colors from "colors";
import dotenv, { config } from "dotenv";
import fs from "fs";
import { DateTime } from "luxon";
import asciichart from "asciichart";
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json' assert {type: "json"};

//* Modules initialization
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile));

colors.enable();
dotenv.config();

app.listen(process.env.NODEJS_PORT, () => {
  console.log(`[server] running on URL: http://localhost:${process.env.NODEJS_PORT}`.cyan);
});

//* Main Route
const routes = express.Router();
app.use("/", routes);

//* Services
const wsdlClientAsync = async () => {
  const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";
  const client = await soap.createClientAsync(url);
  return client;
}

const fetchValorRangeVOAsync = async (codes, startDate, endDate) => {
  const client = await wsdlClientAsync();
  const args = {
    codigosSeries: codes,
    dataInicio: DateTime.fromFormat(startDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy"),
    dataFim: DateTime.fromFormat(endDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy")
  };
  const result = await client.getValoresSeriesVOAsync(args);
  const valores = result[0].getValoresSeriesVOReturn.getValoresSeriesVOReturn.valores.valores;
  const metricName = result[0].getValoresSeriesVOReturn.getValoresSeriesVOReturn.nomeCompleto["$value"];
  let dataArray = [];

  valores.forEach((item) => { dataArray.push(parseFloat(item.valor["$value"])) });
  const resultObject = {
    title: metricName,
    startDate: startDate,
    endDate: endDate,
    data: dataArray,
    length: dataArray.length
  };
  return resultObject;
}

const fetchData = async (code, date) => {
  const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";
  const args = { codigoSerie: parseInt(code), data: DateTime.fromFormat(date, "dd/MM/yyyy").toFormat("dd/MM/yyyy") };
  const client = await soap.createClientAsync(url);
  const results = await client.getValorAsync(args);

  const result = { [args.data]: results[0].getValorReturn["$value"] };
  console.log(result);
  return result;
}

const fetchInfo = (code) => {
  code = parseInt(code);
  const rawdata = fs.readFileSync('sgs-bacen.json');
  const sgsBacen = JSON.parse(rawdata);

  const found = sgsBacen.filter(item => item.code === code)[0];
  if (found) {
    console.log(`fetchInfo(${code})`.green);
    console.log(`code => ${code}`.red);
    console.log(`name: ${found.short_name}`.yellow);

    return found;
  }
  const error = `[server] error: ${code} not found`;
  return error;
}

const mountChart = async (code, startDate, endDate) => {
  const result = await fetchValorRangeVOAsync([code], startDate, endDate);
  const config = {
    colors: [asciichart.green],
    height: 10
  }
  console.log(`${"#".repeat(result.length)}`.green);
  console.log(`${" ".repeat(result.length - (result.length / 2))} ${result.title}`.red);
  console.log(`${"#".repeat(result.length)}`.green);
  console.log(asciichart.plot([result.data], config));
  console.log(`${" ".repeat(result.length - (result.length / 2))}${result.startDate} - ${result.endDate}`);
  console.log(`${"#".repeat(result.length)}\n\n`.green);

}

//* Controllers
routes.route("/bacen/seriesChart/:code").post(async (req, res) => {
  // #swagger.summary = 'Cria no console um gráfico de uma série do BACEN';
  // #swagger.description = 'Cria no console um gráfico de uma série do BACEN'
  // #swagger.parameters['code'] = { description: 'Código de série temporal do BACEN', type: 'integer', required: true, example: 226 }
  // #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/definitions/RangedDate" } } } }
  /* swagger.responses[200] = {
    description: 'Gráfico desenhado! Verifique o console.',
    schema: { message: 'Gráfico desenhado! Verifique o console.' }
  } */
  /* #swagger.responses[200] = {
    description: "Gráfico desenhado! Verifique o console do NodeJS."
  } */
    /* #swagger.responses[400] = {
    description: "Deu ruim."
  } */

  const code = parseInt(req.params.code);
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  await mountChart(code, startDate, endDate).catch((err) => { console.log(err); res.status(400).send(err) });
  res.status(200).json("Gráfico desenhado! Verifique o console.");
});

routes.route("/bacen/metric/:code").get(async (req, res) => {
  // #swagger.summary = 'Traz o valor de uma série do BACEN';
  // #swagger.description = 'Dado um código válido, retorna o valor de uma série do BACEN para a data requerida.'
  // #swagger.parameters['code'] = { description: 'Código de série temporal do BACEN', type: 'integer', required: true, example: 226 }
  // #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/definitions/RangedDate" } } } }
  /* swagger.responses[200] = {
    description: 'Gráfico desenhado! Verifique o console.',
    schema: { message: 'Gráfico desenhado! Verifique o console.' }
  } */
  /* #swagger.responses[200] = {
    description: "Sucesso."
    "schema": {
    "type": "array",
    "items": {
    "$ref": "#/definitions/SingleResult"
    }
  } */
    /* #swagger.responses[400] = {
    description: "Deu ruim."
  } */
  const code = parseInt(req.params.code);
  const date = req.body.date;
  console.log(`code: ${code}`.red);
  console.log(`date: ${date}`.red);

  res.json(await fetchData(code, date));

});

routes.route("/bacen/metric/info/:code").get((req, res) => {
  res.json(fetchInfo(req.params.code));

});


//? TESTES

routes.route("/testRanged1").get(async (req, res) => {
  // #swagger.ignore = true
  const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";

  const code = parseInt(req.query.code);

  const startDate = DateTime.fromFormat(req.query.startDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy");
  const endDate = DateTime.fromFormat(req.query.endDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy");

  const dates = [];
  for (
    let i = startDate;
    i <= endDate;
    i = DateTime.fromFormat(i, "dd/MM/yyyy").plus({ days: 1 }).toFormat("dd/MM/yyyy")
  ) {
    console.log(`then => ${i}`.yellow);
    dates.push(i);
  };

  console.log('dates :>> ', dates);

  const fetchDataLoop = async (dates) => {
    let array = [];
    for (let i = 0; i < dates.length; i++) {
      console.log(`dates[${i}] => ${dates[i]}`);
      setTimeout(() => { }, 1000);
      let partial = await fetchData(code, dates[i]);
      console.log("partial => ", partial);
      array.push(partial);
    };
    return array;
  };

  await fetchDataLoop(dates);


  res.json("done");

});

routes.route("/testRanged2").get(async (req, res) => {
  // #swagger.ignore = true
  const array = await fetchValorRangeVOAsync([226], "01/07/2022", "25/07/2022");
  let newArray = [];
  array.forEach((item, index) => { console.log(`item[${index}] => `, item) });
  array.forEach((item, index) => { console.log(item.valor["$value"]) });
  array.forEach((item) => { newArray.push(parseFloat(item.valor["$value"])) });
  res.json(newArray);
  console.log(asciichart.plot([array], config));

});

routes.route("/testChart1").get((req, res) => {
  // #swagger.ignore = true
  const arr1 = new Array(120)
  arr1[0] = Math.round(Math.random() * 15)
  for (let i = 1; i < arr1.length; i++)
    arr1[i] = arr1[i - 1] + Math.round(Math.random() * (Math.random() > 0.5 ? 2 : -2))

  const arr2 = new Array(120)
  arr2[0] = Math.round(Math.random() * 15)
  for (let i = 1; i < arr2.length; i++)
    arr2[i] = arr2[i - 1] + Math.round(Math.random() * (Math.random() > 0.5 ? 2 : -2))

  const arr3 = new Array(120)
  arr3[0] = Math.round(Math.random() * 15)
  for (let i = 1; i < arr3.length; i++)
    arr3[i] = arr3[i - 1] + Math.round(Math.random() * (Math.random() > 0.5 ? 2 : -2))

  const arr4 = new Array(120)
  arr4[0] = Math.round(Math.random() * 15)
  for (let i = 1; i < arr4.length; i++)
    arr4[i] = arr4[i - 1] + Math.round(Math.random() * (Math.random() > 0.5 ? 2 : -2))

  const config = {
    colors: [
      asciichart.blue,
      asciichart.green,
      asciichart.magenta, // default color
      asciichart.red, // equivalent to default
    ],
    height: 10
  }

  console.log(`\n\n                                          TESTE DE MONTAGEM DE GRÁFICO\n`);
  console.log(asciichart.plot([arr1, arr2, arr3, arr4], config));
  console.log(`\n                                  Gráfico de teste para verificação de funcionamento\n`);
  res.send("Chart drawn! Look at the console!! LOOK AT IT!!!");
});

routes.route("/testChart2").get(async (req, res) => {
  // #swagger.ignore = true
  const array = await fetchValorRangeVOAsync([226], "01/07/2022", "25/07/2022");
  let newArray = [];
  array.forEach((item) => { newArray.push(parseFloat(item.valor["$value"])) });

  const config = {
    height: 10
  }
  console.log(asciichart.plot([newArray], config));
  res.json(newArray);

});

routes.route("/bazinga").get((req, res) => {
  // #swagger.ignore = true
  res.send("<h1>Bazinga!</h1>");
});