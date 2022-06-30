# Webservices and RESTful Technologies

## Descrição

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

~~Até onde testei vai funcionar com qualquer código da página, respeitando o tipo de data esperado.~~
Tá é ruim pakas, só funciona com alguns códigos, preciso deixar agnóstico.

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