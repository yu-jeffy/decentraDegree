var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

const web3URL = 'http://127.0.0.1:8545';
const Web3 = require('web3');
const web3 = new Web3(web3URL);
web3.eth.defaultAccount = web3.eth.accounts[0];
web3.eth.getAccounts().then(console.log);
var accountsDisplay = web3.eth.getAccounts();
web3.eth.getBalance('0xd4c13Da6AD7107094de2733888521de5dD92501D').then(console.log);

const userStorageJSON = require("./UserStorage/build/contracts/UserStorage.json");

console.log(JSON.stringify(userStorageJSON.abi));
const userStorageABI = userStorageJSON.abi;

//contract instance
let contract = new web3.eth.Contract(userStorageJSON.abi, '0x0F193b921ab1aF18811b983eE1AC7Da3F2449Bca');




const EthCrypto = require('eth-crypto');

const hostname = '127.0.0.1'
const port = 3000

var app = express();

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(limiter);
app.set('view engine', 'ejs');




// contract.methods.createUser('0xE1B9Bbb62Dbb54dfB45061709Ab5b1a05ca0657e', "test", "test").send({ from: '0xE1B9Bbb62Dbb54dfB45061709Ab5b1a05ca0657e', gas: 100000 }).then(console.log);


app.get('/', async function (req,res){
  res.render('pages/dashboard', {
    userInfo: "",
    identityDisplay: "",
    accountsDisplay: await accountsDisplay});
  });

// createIdentity
app.post('/createIdentity', async function(req,res){
  const identity = EthCrypto.createIdentity();
  console.log(identity);
  var newPubKey = identity.publicKey;
  var newUsername = req.body.newUsername;
  var newAccount = req.body.newAccount;
  try {
    contract.methods.createUser(newAccount, newUsername, newPubKey).send({ from: newAccount, gas: 10000000000 }).then(console.log);
  }
  catch(err) {
    console.log("Couldn't write the new identity!");
    console.log(err);
  }

  res.render('pages/dashboard', {
    userInfo: "",
    identityDisplay: await JSON.stringify(identity),
    accountsDisplay: await accountsDisplay});
});


app.post('/login', async function(req,res){
  var loginUsername = req.body.loginUsername;
  var userQuery;
  try {
    contract.methods.users(loginUsername).call().then(console.log);
    userQuery = await contract.methods.users(loginUsername).call();
    console.log(userQuery);
  }
  catch(err) {
    console.log("Couldn't login!");
    console.log(err);
  }

  await res.render('pages/dashboard', {
    userInfo: await JSON.stringify(userQuery),
    identityDisplay: "",
    accountsDisplay: await accountsDisplay});
});
