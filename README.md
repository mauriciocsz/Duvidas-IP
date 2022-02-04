# Duvidas-IP
## Descrição
Projeto de website para dúvidas da matéria de Introdução a Programação - UFSCAR.

Este projeto foi criado com o intuito de ser um facilitador para alunos que acabaram de entrar na faculdade no modelo EaD, proporcionando uma espécie de fórum, onde alunos podem cadastrar suas dúvidas sem ter que se preocupar em quais monitores estão disponíveis e os poupando do trabalho de buscar pelo contato dos mesmos. 

A sua implementação é bem simples, para os alunos é apresentado um site, no qual os alunos podem selecionar o exercício em questão e escrever sua dúvida, logo após o cadastro será emitido um código, que pode ser usado para acompanhar a situação da dúvida e comentários dos monitores. Para os monitores, as dúvidas ficam armazenadas em um banco de dados e contém todas informações tanto do aluno quanto da dúvida, permitindo que se já analisem o problema e se tornem responsáveis pela dúvida quando estiverem disponíveis para respondê-la.

## Recursos Utilizados
Foram utilizadas várias tecnologias para o desenvolvimento do projeto, NodeJS para o backend, com várias bibliotecas usadas para criptografia e para o host (crypto, express, ...).
Foi utilizado HTML e CSS para o front-end, utilizando-se do bootstrap para auxiliar o desenvolvimento.


## Passo a Passo
No projeto, foi primeiro feita a modelagem do banco de dados, acompanhada com o cadastro back-end das dúvidas. Após essa parte ser completa, foi realizado o desenvolvimento do
front-end do site e testes com o auxilio de várias pessoas. Para medidas de segurança, foi adicionado o reCaptcha, previnindo assim ataques DDoS a plataforma. Por fim, foi adicionado
um sistema de reconhecimento de estudante, com dados fornecidos pelo professor, para tornar mais simples o cadastro de dúvidas.

## Instalação & Execução
1. Baixe o projeto.
2. É necessário o NodeJS instalado na máquina, ele pode ser encontrado [aqui](https://nodejs.org/en/download/)
3. Também é necessária a hospedagem e a criação do banco de dados, para o funcionamento completo do projeto.
4. É preciso configurar o reCaptcha para o funcionamento total do sistema, entretanto o mesmo pode ser removido para testes.
5. Com tudo instalado e preparado, basta inicializar o projeto no terminal com npm start.
6. Após tudo isso, o projeto será inicializado em localhost:3000

## Autores
Maurício Cândido de Souza & Michel Ribeiro Koba

## Screenshots
![Img1](https://i.imgur.com/PasPO88.png)
![Img2](https://i.imgur.com/CCqHr5x.png)
![Img3](https://i.imgur.com/K1FRnzq.png)
