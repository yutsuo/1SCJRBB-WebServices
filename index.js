//* Libraries (ES6 import)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as soap from "soap";
import colors from "colors";
import dotenv from "dotenv";
import fs from "fs";
import { DateTime } from "luxon";
import asciichart from "asciichart";

let rawdata = fs.readFileSync('sgs-bacen.json');
let sgsBacen = JSON.parse(rawdata);
// console.log("sgsBacen => ", sgsBacen);

//* Modules initialization
const app = express();

app.use(cors());
app.use(bodyParser.json());
colors.enable();
dotenv.config();


app.listen(process.env.NODEJS_PORT, () => {
  console.log(`[server] running on URL: http://localhost:${process.env.NODEJS_PORT}`.cyan);
});

//* Main Route
const routes = express.Router();
app.use("/", routes);


//* Controllers
routes.route("/testChart").get((req, res) => {
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

  console.log(asciichart.plot([arr1, arr2, arr3, arr4], config))
  res.send("Chart drawn! Look at the console!! LOOK AT IT!!!");
})

routes.route("/bacen").get((req, res) => {
  const code = parseInt(req.query.code);
  const date = req.query.date;
  console.log(`code: ${code}`.red);
  console.log(`date: ${date}`.red);

  const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";
  const args = { codigoSerie: code, data: date };
  soap
    .createClientAsync(url)
    .then((client) => {
      return new Promise((resolve, reject) => {
        client.getValor(args, (error, result) => {
          error ? reject() : resolve(result);
        });
      });
    })
    .then((result) => {
      console.log(`CDI (${args.data}) : ${result.getValorReturn["$value"]}`.yellow);
      res.json(parseFloat(result.getValorReturn["$value"]));
    })
    .catch(e => {
      console.log("error:", e);
      res.status(500).json(`error: ${e}`);
    });
});

routes.route("/getInfo").get((req, res) => {
  const code = parseInt(req.query.code);
  const filtered = sgsBacen.filter(item => item.code === code)[0];
  console.log(`code => ${code}`.red);
  console.log(`name: ${filtered.short_name}`.yellow);

  return res.json(sgsBacen.filter(item => item.code === code)[0]);

});

routes.route("/getRanged").get((req, res) => {
  const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";
  const code = parseInt(req.query.code);

  const startDate = DateTime.fromFormat(req.query.startDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy");
  const endDate = DateTime.fromFormat(req.query.endDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy");

  async function test(url, code, date) {
    const args = { codigoSerie: code, data: date };
    const client = await soap.createClientAsync(url);
    client.getValor(args, (error, result) => {
      error ? console.log(error) : console.log(`(${args.data}) : ${result.getValorReturn["$value"]}`.yellow);
    });
  };

  const dates = [];

  for (
    let i = startDate;
    i <= endDate;
    i = DateTime.fromFormat(i, "dd/MM/yyyy").setLocale("pt-BR").plus({ days: 1 }).toFormat("dd/MM/yyyy")
  ) {
    console.log(`then => ${i}`.yellow);
    dates.push(i);
  };

  console.log('dates :>> ', dates);

  Promise.all(
    dates.map(date => test(url, code, date))
  ).then(() => { return res.send("done") });

});