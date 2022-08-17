'use strict';

//* Libraries (ES6 import)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as soap from "soap";
import colors from "colors";
import dotenv from "dotenv";
import fs from "fs";
import moment from "moment";
import { DateTime } from "luxon";

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
  console.log(`[server] Running on URL: http://localhost:${process.env.NODEJS_PORT}`.cyan);
});

//* Route
const bacenRoutes = express.Router();
app.use("/bacen", bacenRoutes);


//* Controller
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

bacenRoutes.route("/test").get((req, res) => {
  const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";
  const code = parseInt(req.query.code);

  console.log('req.query.startDate :>> ', req.query.startDate);
  console.log('req.query.endDate :>> ', req.query.endDate);

  const startDate = DateTime.fromFormat(req.query.startDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy");
  const endDate = DateTime.fromFormat(req.query.endDate, "dd/MM/yyyy").toFormat("dd/MM/yyyy");

  console.log('startDate => ', startDate);
  console.log('endDate => ', endDate);

  const addTestDate = DateTime.fromFormat(req.query.startDate, "dd/MM/yyyy").setLocale("pt-BR").plus({ days: 1 }).toFormat("dd/MM/yyyy");

  console.log('addTestDate :>> ', addTestDate);

    let args = { codigoSerie: codeParam, data: dateParam };
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
      console.log(`(${args.data}) : ${result.getValorReturn["$value"]}`.yellow);
      return res.json(parseFloat(result.getValorReturn["$value"]));
    })
    .catch(e => { console.log("error:", e) });

  // for (
  //   let i = startDate;
  //   i <= endDate;
  //   i = DateTime.fromFormat(i, "dd/MM/yyyy").setLocale("pt-BR").plus({ days: 1 }).toFormat("dd/MM/yyyy")
  // ) {
  //   console.log(`then => ${i}`.yellow);
  // };

});

// bacenRoutes.route("/test").get((req, res) => {
//   const url = "https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS?wsdl";
//   const code = parseInt(req.query.code);

//   const startDate = moment(req.query.startDate, "DD/MM/YYYY").format("YYYY-MM-DD");
//   const endDate = moment(req.query.endDate, "DD/MM/YYYY").format("YYYY-MM-DD");

//   for (let i = startDate; i <= endDate; i = moment(i).add(1, "days").format("YYYY-MM-DD")) {
//     console.log(`then => ${i}`.yellow);
//     let fDate = moment(i).format("DD/MM/YYYY");
//     console.log('fDate :>> ', fDate);

//     let args = { codigoSerie: code, data: fDate };
//     soap
//       .createClientAsync(url)
//       .then((client) => {
//         return new Promise((resolve, reject) => {
//           client.getValor(args, (error, result) => {
//             error ? reject() : resolve(result);
//           });
//         });
//       })
//       .then((result) => {
//         console.log(`(${args.data}) : ${result.getValorReturn["$value"]}`.yellow);
//         res.json(parseFloat(result.getValorReturn["$value"]));
//       })
//       .catch(e => { console.log("error:", e) });

//   };

// });
