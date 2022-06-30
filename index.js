//* Libraries (ES6 import)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as soap from "soap";
import colors from "colors";
import dotenv from "dotenv";

//* Modules initialization
const app = express();

app.use(cors());
app.use(bodyParser.json());
colors.enable();
dotenv.config();


app.listen(process.env.NODEJS_PORT, () => {
  console.log(`Server is running on Port: ${process.env.NODEJS_PORT}`);
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
      .catch(e => { console.log(e) });
  });
