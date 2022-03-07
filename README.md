
# Token Sale ICO Website

![Website](https://drive.google.com/file/d/1gM-d3sCjYpalow32RV9qOlCl1wztBJjK/view)

This is an ICO (Initial Coin Offering) website where users can purchase tokens in the crowd sale.
The website also shows that how many tokens all users have purchased, tokens present in current user's wallet  and the total number of tokens available in the crowd sale.


## Documentation

[Documentation](https://emasdigi.atlassian.net/wiki/spaces/CS/pages/2890989617/Pluang+Token)


## Installation

- Install Gnache from the [website](https://trufflesuite.com/ganache/index.html)
- Install [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) chrome extension.
- Install truffle 

    ```bash
    npm i truffle
    ```

## Add tokens to Smart Contract.

 1. Open Gnache and quickstart Ethereum Blockchain.

 1. Open truffle console

    ```bash
    npm i truffle
    ```

2. Deploy EnvToken Smart Contract and store in token variable.

     ```bash
    let token = await EnvToken.deployed()
    ```

3. Deploy EnvTokenSale Smart Contract and store in tokenSale variable.

     ```bash
    let tokenSale = await EnvTokenSale.deployed()
    ```
4. Get accounts list from Gnache.

     ```bash
    let accounts = await web3.eth.getAccounts()
    ```
5. Store admin address in a variable.

     ```bash
    let admin = accounts[0]
    ```
6. Transfer the tokens from admin to tokenSale Smart Contract.

     ```bash
    token.transfer(tokenSale.address, 750000, {from : admin})
    ```


## Run Locally

Clone the project

```bash
  git clone https://github.com/sonali-pluang/ICO-Website
```

Go to the project directory

```bash
  cd ICO-Website
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```





