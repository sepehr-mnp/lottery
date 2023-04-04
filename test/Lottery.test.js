const assert = require("assert");
const ganache = require("ganache-cli");
const { Interface } = require("readline");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract((abi))
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1000000" });
  
    
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);//check kardan vojod address baraye contract
  });

  it("allows one account to enter",async()=>{
  await lottery.methods.enter().send({from: accounts[0],gas: "1000000",value:web3.utils.toWei('0.01','ether')/*"1000000000000000"*/});
  const players = await lottery.methods.getPlayers().call({from: accounts[0]});
  
  assert.equal(accounts[0],players[0]);
  assert.equal(1,players.length);
});
  
  it("allows one account to enter",async()=>{
    for (let i =0;i<5;i++){
      await lottery.methods.enter().send({from: accounts[i],gas: "1000000",value:web3.utils.toWei('0.01','ether')/*"1000000000000000"*/});
    }
    const players = await lottery.methods.getPlayers().call({from: accounts[0]});
    
    for (let i =0;i<5;i++){
      assert.equal(accounts[i],players[i]);
    }

    assert.equal(5,players.length);
});

  it("requires a minimum amount of eher to enter",async()=>{///in dorost mishavad zira vaghti be catch miravad, error vojood darad
    try{
      await lottery.methods.enter().send({from: accounts[0],gas: "1000000",value:web3.utils.toWei('0.001','ether')/*"1000000000000000"*/});
      assert(false);
    }catch(err){
      assert(err);//motmaen mishavad error darim va null nist va faghat bekhater assert balaii nayomade to catch va error baesesh shode(assert error nmidahad vali test ra false mikonad)
    }
    
  });

  it("only manager can call pickWinner",async()=>{///in dorost mishavad zira vaghti be catch miravad, error vojood darad
    try{
      await lottery.methods.pickWinner().send({from: accounts[0],gas: "1000000"/*"1000000000000000"*/});
      assert(false);
    }catch(err){
      assert(err);
    }
    
  });

  it("sends money to the winner and resets the player array", async()=>{
    await lottery.methods.enter().send({from: accounts[0],gas: "1000000",value:web3.utils.toWei('2','ether')/*"1000000000000000"*/});//vojod await ejbari ast
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({from: accounts[0],gas: "1000000"/*"1000000000000000"*/});
    const finalBalance =  await web3.eth.getBalance(accounts[0]);

    const differnce = finalBalance-initialBalance;

    console.log("gas= ",differnce);
    assert(differnce>web3.utils.toWei('1.8','ether'))

    
  });
  
});
