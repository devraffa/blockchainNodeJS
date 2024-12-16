# Documentação sobre o Projeto de Blockchain
## Descrição do Projeto 

Este documento descreve o desenvolvimento de um projeto de blockchain implementado em Node.js, como parte do primeiro trabalho da Compass. O projeto consiste em uma implementação simples de uma blockchain, onde blocos contêm transações que são mineradas e verificadas.

## Tecnologias Utilizadas
- node.js
- JavaScript.js 
- Git
- Crypto (módulo do Node.js): Utilizado para a criação do hash SHA-256
- Lodash (módulo do Node.js): Utilzado para cirar uma cópia da blockchain nos nodes

## Como Rodar o Projeto
Para conseguir fazer rodar o código é necessário ter o **Node.js** instalado na sua máquina, aqui vão as instruções para a conseguir rodar o programa:

1. Crie uma pasta na sua máquina, em seguida abra o CMD (terminal) na pasta e clone este repositório utilizando esse comando:
`git clone https://github.com/devraffa/blockchainNodeJS.git`
2. Acesse os diretório onde salvou e a pasta MineBlockchain o projeto e instale as depências necessárias
   `cd blockchainNodeJS cd MineBlockchain `
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

- **Histórico de Transações**: Filtra e exibe todas as transações relacionadas a um endereço específico
  
- **Redes de nós**:

## Estrutura do Código

O código é dividido em quatro principais classes:

1. **Transaction**: Representa uma transação entre dois endereços (remetente e destinatário), incluindo um valor associado.
  
2. **Block**: Cada bloco contém um timestamp, o hash do bloco anterior, um conjunto de transações e um nonce, que é ajustado até que o hash do bloco atenda à dificuldade da rede.

3. **Blockchain**: Gerencia a cadeia de blocos, incluindo a criação do bloco gênesis, a validação da cadeia e a mineração de novos blocos a partir das transações pendentes, com as novas funções é possível realizar a validação dos endereços com base no padrão 2x + 40 caracteres hexadecimais e consultar o histórico de transações também.

4. **Keys**: Cria um par de chaves, pública e privada, e gera o endereço da chave pública para que a partir desse endereço seja possível a validação de trasações.

## Exemplo de Uso

Aqui está um exemplo de como criar transações, minerar blocos, consultar o saldo de um endereço, validar as transações e histórico de transações:

``` javascript

const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

const bitcoins = new Blockchain('2x000000000000000000000000000000000000000001');
bitcoins.minerarTraPendente('2x000000000000000000000000000000000000001234');

bitcoins.criaTransaction('2x000000000000000000000000000000000000000001', '2x000000000000000000000000000000000000000002', 20); 
bitcoins.criaTransaction('2x000000000000000000000000000000000000000001', '2x000000000000000000000000000000000000000004', 40); 

bitcoins.minerarTraPendente('22x000000000000000000000000000000000000012345');

bitcoins.printBlockchain();

console.log(`Essa blockchain é válida? ${bitcoins.validBlockchain()}`);

const historico = bitcoins.historicTransaction('2x000000000000000000000000000000000000000001');
console.log("Histórico de transações: ", historico);

```


## Licença 
Este projeto está licenciado sob a licença MIT.

![alt text](https://novojorbras.com.br/images/noticias/16014/19041851_compass.uo.jpg.jpg)
