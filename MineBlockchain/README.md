# Documentação sobre o primeiro trabalho da Compass
## Descrição do Projeto 

Este documento descreve o desenvolvimento de um projeto de blockchain implementado em Node.js, como parte do primeiro trabalho da Compass. O projeto consiste em uma implementação simples de uma blockchain, onde blocos contêm transações que são mineradas e verificadas.

## Tecnologias Utilizadas
- Node.js
- JavaScript.js
- Git
- Crypto (módulo do Node.js): Utilizado para a criação do hash SHA-256

## Como Rodar o Projeto
Para conseguir fazer rodar o código é necessário ter o **Node.js** instalado na sua máquina, aqui vão as instruções para a conseguir rodar o programa:

1. Crie uma pasta na sua máquina, em seguida abra o CMD (terminal) na pasta e clone este repositório utilizando esse comando:
`git clone https://github.com/devraffa/blockchainNodeJS.git`
2. Acesse o diretório onde salvou o projeto e instale as depências necessárias
   `cd blockchainNodeJS `
   ` npm install `

## Para executar o código 

Para conseguir executar o código basta rodar o comando abaixo:
`node teste.js`

## Funcionalidades do Projeto

Este projeto possui as seguintes funcionalidades:

- **Criação da Blockchain**: Permite a criação de uma blockchain com um bloco gênesis, que é o primeiro bloco da cadeia.
  
- **Adicionar Transações**: Implementa a capacidade de adicionar transações à pool de transações pendentes, onde elas ficam aguardando para serem mineradas.
  
- **Mineração de Blocos**: Utiliza o mecanismo de proof-of-work para minerar novos blocos, ajustando a dificuldade de acordo com a taxa de hash da rede.

- **Validação da Blockchain**: Inclui a verificação da integridade da blockchain, garantindo que cada bloco está corretamente encadeado e que os hashes são válidos.

- **Consulta de Saldo**: Permite consultar o saldo de endereços específicos, considerando as transações realizadas.

## Estrutura do Código

O código é dividido em três principais classes:

1. **Transaction**: Representa uma transação entre dois endereços (remetente e destinatário), incluindo um valor associado.
  
2. **Block**: Cada bloco contém um timestamp, o hash do bloco anterior, um conjunto de transações e um nonce, que é ajustado até que o hash do bloco atenda à dificuldade da rede.

3. **Blockchain**: Gerencia a cadeia de blocos, incluindo a criação do bloco gênesis, a validação da cadeia e a mineração de novos blocos a partir das transações pendentes.

## Exemplo de Uso

Aqui está um exemplo de como criar transações, minerar blocos e consultar o saldo de um endereço:

![alt text](image.png)

## Licença 
Este projeto está licenciado sob a licença MIT.

![alt text](images.png)
