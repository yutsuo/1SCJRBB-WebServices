# Webservices and RESTful Technologies

Wrapper em NodeJS para chamadas SOAP.

Conectando na base de SÉRIES TEMPORAIS em WDSL do Banco Central do Brasil:

> <https://www3.bcb.gov.br/sgspub/localizarseries/localizarSeries.do?method=prepararTelaLocalizarSeries>

Por enquanto só funciona o básico.

Subir o docker-compose

Requisição de teste:

> <http://localhost:3001/bacen?code=12&date=30/01/2015>

Onde:
    code - código da métrica a ser consultada (12=CDI diário)
    date - data da métrica a ser consultada (30/01/2015)
