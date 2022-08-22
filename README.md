# Webservices and RESTful Technologies

## Descrição

Simples backend feito em NodeJS que consome o API WDSL de SÉRIES TEMPORAIS do Banco Central do Brasil:

> <https://www3.bcb.gov.br/sgspub/localizarseries/localizarSeries.do?method=prepararTelaLocalizarSeries>

O nosso API é capaz de:

- obter informações sobre as séries existentes mais populares
- obter o valor de qualquer série temporal existente, por data fixa ou por período
- para consulta de séries temporais por períodos implementamos um contrutor de gráficos no próprio console do NodeJS.

Executando o projeto
> `docker-compose up`

Documentação da API:

> <http://localhost:3001/api>
>
> Compilamos uma lista de métricas mais consumidas no arquivo `sgs-bacen.csv` contido nesse repositório Git.

## Enunciado do Trabalho

Criar uma aplicação (Consumidor e API) relacionado ao algum estudo de caso do ramo financeiro, seguros, pagamentos, previdência etc.

### Objetivo

Criar uma aplicação (Consumidor + API) relacionado à algum estudo de caso relacionado ao ramo financeiro
Pode ser de duas formas:

1. Uma API que consuma outra API;
2. Uma API + um Front-end;

Atividade em grupo de até 6 alunos;

Deverá ser entregue no Portal do Aluno um texto contendo:

- O tema;
- As tecnologias escolhidas (linguagem, framework, aplicação etc.);
- Endereço do código-fonte (licença open source);
- Página da documentação da API;

Prazo para entrega: Dia 15/08/2022.

Itens obrigatórios:

1. API dentro dos padrões REST ou SOAP;
2. Página Web contendo documentação da API;

Itens opcionais:

1. Implementar segurança;
2. Código-fonte armazenado em um VCS (ex. GitHub e BitBucket);
3. Execução da aplicação em nuvem (ex. Heroku, GitHub Pages, AWS);
4. Ferramenta de gestão de dependências;
5. Persistência e/ou caching.

Observações:

1. Pense em criar um MVP (Minimum Viable Product);
2. Para deploy, utilize o Heroku (API) e GitHub Pages (SPA e WPA);
3. Evite expor informações protegidas por sigilos empresariais; utilize uma abordagem "agnóstica" (ser aplicável em qualquer empresa do ramo financeiro);
4. Se houver necessidade de manter o repositório privado, adicione meu usuário como convidado:
profeduardo.galego@fiap.com.br (GitHub e BitBucket).
