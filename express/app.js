var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var contract = require("truffle-contract"); //for truffle-like interactions
var path = require('path')
var MyContractJSON  = require(path.join(__dirname, '../build/contracts/Verifier.json'));


// Add the web3 node module
var Web3 = require('web3');

// Set provider via Web3
var provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');

// Create Contract instance through Truffle 
var contract = require("truffle-contract");

// Read JSON and attach RPC connection (Provider)
var MyContract = contract(MyContractJSON);
MyContract.setProvider(provider);

// Web3 1.0.0 incompatible with truffle-contract fix
if (typeof MyContract.currentProvider.sendAsync !== "function") {
  MyContract.currentProvider.sendAsync = function() {
    return MyContract.currentProvider.send.apply(
      MyContract.currentProvider, arguments
    );
  };
}


// 
// Frontend setup
//

app.get('/', function(req, res){
   res.render('frontend');
});

app.set('view engine', 'ejs');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
//app.render('frontend');
app.use(upload.array()); 
app.use(express.static('public'));


app.post('/', function(req, res){
  // Truffle syntax

  console.log("I : " + req.body)
  var deployed;
  // Use Truffle as usual 
  let A = ["0xf6d8181a05fcbc7b0677d86b8345dde4509db736d9400eedc1fa8540b6133d","0x29a5251f3b220113d3fe898920b8d3447aa7bf416a67311372080039129f25"]

  let A_p = ["0x1cbd056424db7ccfba291357bb7eb123213f190ad686a228010556f5eb5d228c","0x283fc88deda932505839f242ab1a59e5d48f908700b0350f1da7fdd230ab4137"]

  let B = [["0xfb673e56a0e004667ebbfec276b26f7ece4b198c3e201b09968e08734cdac0a", "0x1014b885143972fec7fdb81e904b67f26b8aa354f9edd88e3c87439fb2404866"],["0xe966628ace796c793b24a5e00eb2ff309ec800409374621dc55979298893074","0x8de360a539d208dda37b37ee65851197370774a07807cb8cec371e730dfb4c6"]]

  let B_p = ["0x18398fd05fe52ca1f94ad67ad81fcad7f8968eae089e57c0f09e98a81655bad9","0x94458ab4803978c6c01a7ce4c124245b711aa52ef55206fc53c5197caaecfe4"]

  let C = ["0x194f708a375865d16ef5b0ac490137c27fd2cbe1026298005b003bd8a49b3243","0x1f3614d64f9d3d80d8d437d83f4fbdaae5bca6d7be2002012871f85a5786615"]

  let C_p = ["0x198d6a2ef0eb087d291ec18cabdaa77fb21a536a2f9883c6533573f9e4848ac8","0x11a0bbdd9f48575ff1f02d130b060bf8f8a54933a4342dcb43d2467e573bdce"]

  let H = ["0x262cf771eccecd7e30104b14f30119553f2155554ab1451187f3b931b9028957","0x291cfd963f09850b8f507f821ae1344da75229c3a634b376760cd06a00e39b9e"]

  let K = ["0x23bd5886031e3556a398b362b195f2761b08f582e664e4df8db1713f4e2dddbe","0x117fec4a0e44dafff10be82d9035c4d8b22b9d351e7ab70aa60b2f694afb4381"]

Input = req.body.val
let I = JSON.parse("[" + Input + "]");
console.log("Input was : " + I);

  
  MyContract.deployed().then(function(instance)
    {
      return instance.verifyTx.call(A,A_p,B,B_p,C,C_p,H,K,I); 
    
    }).then(function(value){
       console.log("Value returned is : " + value);
       res.send("Value returned is : " + value);    

     }, function(error) {
    console.log("ERROR IS SHOWN HERE : " + error);

     });

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))