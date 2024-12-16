# Documentação sobre o Projeto de Blockchain
## Descrição do Projeto 

Este documento descreve o desenvolvimento de um projeto de **blockchain distribuída**, implementado em **Node.js**. O sistema simula uma rede de múltiplos nós, onde cada nó mantém sua própria cópia da blockchain, podendo criar transações, minerar blocos e sincronizar-se com outros nós para garantir a consistência da rede. Além disso, o sistema permite o tratamento de forks na rede, onde os nós são capazes de resolver divergências.

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
  
- **Sincronização de Nós**: Permite que nós se conectem entre si e sincronizem suas blockchains para garantir a consistência da rede.

- **Resolução de Forks**: Em caso de forks, os nós se sincronizam automaticamente para garantir que todos possuam a mesma versão da blockchain.

## Estrutura do Código

O código é dividido em cinco principais classes:

### 1. **Transaction: Representa uma transação entre dois endereços (remetente e destinatário), incluindo um valor associado.**

| **Componente**                             | **Descrição**                                                                                                                                                       |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `const crypto = require('crypto');`        | Importa o módulo `crypto`, que fornece funções criptográficas, como o `sha256`, usado para criar hashes.                                                          |
| `class Transaction { ... }`                | Define a classe `Transaction`, que representa uma transação na blockchain, contendo informações sobre o endereço de origem, destino, valor e taxa.                |
| `constructor(originEnde, destinEnde, valor, taxa = 0)` | Construtor da classe. Inicializa a transação com o endereço de origem (`originEnde`), destino (`destinEnde`), valor da transação (`valor`) e uma taxa opcional.    |
| `this.id = this.generateID(this);`         | Chama a função `generateID` para gerar um identificador único para a transação, baseado nos dados da transação (endereços, valor, taxa e timestamp).               |
| `generateID(transaction)`                  | Função que cria um hash SHA-256 único para a transação, combinando os dados da transação (endereço de origem, destino, valor, taxa e timestamp) em uma string.      |
| `hash.update(...)`                         | Atualiza o hash com os dados da transação concatenados.                                                                                                           |
| `return hash.digest('hex');`               | Retorna o hash gerado como uma string hexadecimal.                                                                           

### 2. **Block: Cada bloco contém um timestamp, o hash do bloco anterior, um conjunto de transações e um nonce, que é ajustado até que o hash do bloco atenda à dificuldade da rede.**

| **Componente**                             | **Descrição**                                                                                                                                                       |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `const crypto = require('crypto');`        | Importa o módulo `crypto`, que fornece funções criptográficas, como o `sha256`, utilizado para criar hashes.                                                     |
| `class Block { ... }`                      | Define a classe `Block`, que representa um bloco na blockchain, contendo informações como timestamp, hash do bloco anterior, dados da transação, nonce e hash.     |
| `constructor(timestamp, last_hash, data)`  | Construtor da classe. Inicializa o bloco com o timestamp, hash do bloco anterior (`last_hash`), dados da transação (`data`), e um `nonce` inicial igual a 0.        |
| `this.hash = this.calcularhash();`         | Chama a função `calcularhash()` para gerar o hash do bloco, baseado no timestamp, hash anterior, dados e nonce.                                                     |
| `calcularhash()`                           | Função que cria um hash SHA-256 único para o bloco, combinando os dados do bloco (timestamp, hash anterior, dados e nonce).                                         |
| `return crypto.createHash('sha256')...`    | Gera o hash concatenando os dados e retornando o resultado em formato hexadecimal.                                                                                |
| `defTimestamp()`                           | Função que formata o timestamp do bloco para o formato ISO 8601.                                                                                                 |
| `mine(dif)`                                | Função que realiza a mineração do bloco, tentando encontrar um hash que tenha um número específico de zeros no início (`dif`), ajustando o `nonce` até encontrar.  |
| `this.nonce++`                             | Incrementa o `nonce` enquanto o hash não atender à condição de dificuldade (`dif`).                                                                              |


### 3. **Blockchain: Gerencia a cadeia de blocos, incluindo a criação do bloco gênesis, a validação da cadeia e a mineração de novos blocos a partir das transações pendentes, com as novas funções é possível realizar a validação dos endereços com base no padrão 2x + 40 caracteres hexadecimais e consultar o histórico de transações também.**

| **Componente**                        | **Descrição**                                                                                                                                                                                                                                                                                    |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `constructor(Endereco)`               | Construtor da classe `Blockchain`. Inicializa a blockchain com um prêmio de mineração (`premioMine`), um vetor de saldos (`vetorSaldo`), e registra o endereço inicial. Também cria o bloco gênesis e define a dificuldade de mineração (`dif`).                                                |
| `registraAddress(endereco)`           | Função que valida e registra um novo endereço na blockchain. Caso o endereço seja válido, ele é adicionado ao vetor de saldos. Caso contrário, uma mensagem de erro é exibida.                                                                                                                 |
| `criarEndereco()`                     | Função que cria um novo endereço utilizando a classe `Keys` e o registra na blockchain. Retorna o endereço gerado.                                                                                                                                                                              |
| `criaGenesis(premioMine_ende)`        | Função que cria o bloco gênesis da blockchain, que é o primeiro bloco. Ele cria uma transação de prêmio de mineração e adiciona ao saldo do endereço do minerador.                                                                                                                               |
| `validAddress(endereco)`              | Função que valida um endereço, verificando se ele é uma string e se segue o formato `2x` seguido por 40 caracteres hexadecimais. Retorna `true` ou `false` conforme o caso.                                                                                                                      |
| `saldoEndereco(endereco)`             | Função que calcula o saldo de um endereço. Soma os valores das transações recebidas e subtrai os valores das transações enviadas, tanto confirmadas na blockchain quanto pendentes.                                                                                                            |
| `criaTransaction(originEnde, destinEnde, valor, taxa=0)` | Função que cria uma transação entre dois endereços, verificando se os endereços são válidos e se o saldo do remetente é suficiente. Adiciona a transação ao vetor de transações pendentes e retorna a transação criada.                                                                 |
| `updateSaldo_Block()`                 | Função que atualiza os saldos dos endereços envolvidos nas transações pendentes, após a mineração de um bloco. Limpa a lista de transações pendentes após a atualização.                                                                                                                           |
| `ultimoBlock()`                       | Função que retorna o último bloco da cadeia (`chain`).                                                                                                                                                                                                                                            |
| `minerarTraPendente(premioMine_ende)` | Função que minera um bloco com as transações pendentes, calculando a recompensa total (prêmio de mineração + taxas), criando o bloco e atualizando os saldos dos endereços envolvidos. Após a mineração, o bloco é adicionado à cadeia e as transações pendentes são limpas. |
| `validBlockchain()`                   | Função que valida a integridade da blockchain, verificando se o hash do bloco anterior e o hash do bloco atual estão corretos. Retorna `true` se a blockchain for válida, caso contrário, retorna `false`.                                                                                       |
| `historicTransaction(Endereco)`       | Função que retorna o histórico de transações de um endereço, verificando todos os blocos na cadeia e adicionando as transações que envolvem o endereço fornecido.                                                                                                                                |
| `printBlockchain()`                   | Função que imprime todos os blocos da blockchain e suas transações, além de exibir os saldos dos endereços registrados (exceto o endereço inicial).                                                                                                                                             |

### 4. **Keys: Cria um par de chaves, pública e privada, e gera o endereço da chave pública para que a partir desse endereço seja possível a validação de trasações.**
   
   | **Componente**                       | **Descrição**                                                                                                                                                                                                                                                   |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `constructor()`                      | Construtor da classe `Keys`. Gera um par de chaves (pública e privada) utilizando o algoritmo `ec` com a curva elíptica `secp256k1`. As chaves geradas são armazenadas nas propriedades `privateKey` e `publicKey`. A partir da chave pública, é gerado um endereço utilizando a função `generateAddressFromKey`. |
| `generateAddressFromKey(publicKey)`  | Função que gera um endereço a partir da chave pública. Ela aplica o algoritmo de hash `sha256` sobre a chave pública e, em seguida, utiliza o algoritmo `ripemd160` para gerar o endereço. O prefixo `2x00` é adicionado ao hash final, resultando no formato do endereço esperado.                                      |


### 5. **Nodes: Representa um nó na rede blockchain. Cada nó mantém sua própria instância de blockchain e pode se conectar a outros nós, transmitindo transações e blocos, além de realizar a sincronização.**
| **Componente**                       | **Descrição**                                                                                                                                                                                                                                                   |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `constructor(blockchain)`            | Construtor da classe `Node`. Recebe uma instância de `blockchain` e faz uma cópia profunda dela usando o método `cloneDeep` do `lodash`. Inicializa também um `Set` chamado `peers` para armazenar os nós conectados.                                                   |
| `IFcontainsBlock(blockHash)`         | Verifica se a blockchain local já contém um bloco com o hash especificado (`blockHash`). Retorna `true` se encontrar o bloco e `false` caso contrário.                                                                                                         |
| `IFcontainsTransaction(transactions)`| Verifica se a transação, com o ID especificado, já está presente nas transações pendentes da blockchain local. Retorna `true` se a transação for encontrada e `false` caso contrário.                                                                            |
| `connectNode(peer)`                  | Conecta este nó a outro nó (peer). Se o peer ainda não estiver na lista de peers, ele é adicionado ao `Set` de peers e o nó também é adicionado ao `Set` de peers do peer.                                                                                      |
| `broadcastBlock(block)`              | Transmite um bloco para todos os peers conectados. Chama o método `receiveBlock` em cada peer para enviar o bloco.                                                                                                                                           |
| `broadcastTransaction(transaction)`  | Transmite uma transação para todos os peers conectados. Chama o método `receiveTransaction` em cada peer para enviar a transação.                                                                                                                            |
| `receiveBlock(block)`                | Recebe um bloco de outro nó. Valida o hash do bloco e o hash anterior. Se o bloco for válido, ele é adicionado à blockchain local. Após adicionar, chama `update_saldo` para atualizar os saldos e `removeTransaction` para remover as transações confirmadas. |
| `receiveTransaction(transaction)`    | Recebe uma transação de outro nó. Valida os endereços de origem e destino, além de verificar o saldo suficiente. Se a transação for válida, ela é adicionada às transações pendentes da blockchain local.                                                     |
| `sync(peer)`                         | Sincroniza a blockchain deste nó com a do peer. Se a blockchain do peer for mais longa, o nó irá substituir sua blockchain pela do peer e transmitir o último bloco para os peers conectados.                                                               |
| `update_saldo(block)`                | Atualiza os saldos dos endereços de origem e destino das transações contidas no bloco recebido. Subtrai o valor da transação e a taxa do saldo do endereço de origem e adiciona o valor da transação ao saldo do endereço de destino.                          |
| `removeTransaction(block)`           | Remove as transações confirmadas no bloco da lista de transações pendentes, caso já existam na blockchain local.                                                                                                                                               |


## Exemplo de Uso

Aqui está um exemplo de como criar transações, minerar blocos, consultar o saldo de um endereço, validar as transações e histórico de transações com todos os nós da rede:

``` javascript

// Chaves principais e inicialização dos nós
const keys1 = new Keys();

// Inicializar blockchains associadas aos nós
const blockchain1 = new Blockchain(keys1.address);

// Criar endereços em blockchain1
const endereco3 = blockchain1.criarEndereco();
const endereco4 = blockchain1.criarEndereco();
const endereco5 = blockchain1.criarEndereco();
const endereco6 = blockchain1.criarEndereco();
const endereco7 = blockchain1.criarEndereco();

// Inicializar nós e associar suas blockchains
const node1 = new Node(blockchain1);
const node2 = new Node(blockchain1); 
const node3 = new Node(blockchain1);

// Conectar os nós
node1.connectNode(node2);
node2.connectNode(node3);
node1.connectNode(node3);

// Criar e minerar transações na blockchain1
const transaction1 = node1.blockchain.criaTransaction(keys1.address, endereco3, 20, 2);
node1.broadcastTransaction(transaction1);
const transaction2 = node1.blockchain.criaTransaction(endereco3, endereco4, 5, 4);
node1.broadcastTransaction(transaction2);
const block1 = node1.blockchain.minerarTraPendente(endereco5);
node1.broadcastBlock(block1);
node1.blockchain.printBlockchain();
node2.blockchain.printBlockchain();
node3.blockchain.printBlockchain();

//teste do fork
console.log("iniciando teste fork");
node2.blockchain.criaTransaction(endereco5, endereco6, 100, 150);
node2.blockchain.minerarTraPendente(endereco7);

node1.sync(node2);
node3.sync(node2);

node1.blockchain.printBlockchain();
node2.blockchain.printBlockchain();
node3.blockchain.printBlockchain();

```


## Licença 
Este projeto está licenciado sob a licença MIT.

