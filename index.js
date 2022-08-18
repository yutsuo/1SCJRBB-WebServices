//* Libraries (ES6 import)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as soap from "soap";
import colors from "colors";
import dotenv from "dotenv";
import fs from "fs";
import { DateTime } from "luxon";
import Plotly from 'plotly.js-dist-min';

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
const bacenRoutes = express.Router();
app.use("/", bacenRoutes);


//* Controllers
bacenRoutes.route("/").get((req, res) => {
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

bacenRoutes.route("/getInfo").get((req, res) => {
  const code = parseInt(req.query.code);
  const filtered = sgsBacen.filter(item => item.code === code)[0];
  console.log(`code => ${code}`.red);
  console.log(`name: ${filtered.short_name}`.yellow);

  return res.json(sgsBacen.filter(item => item.code === code)[0]);

});

bacenRoutes.route("/getRanged").get((req, res) => {
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