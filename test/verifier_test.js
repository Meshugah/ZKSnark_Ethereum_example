var Verifier = artifacts.require("verifier");


contract('1. ZKSNARKs test:: ', function(){
  it("should resolve to true for input 5000", function(){
     Verifier.deployed().then(function(instance){
      return instance.verifyTx.call(A,A_p,B,B_p,C,C_p,H,K,I);
    }).then(function(value){
      assert.equal(value.valueOf(), "true", "Oh, result wasn't true, Check that the proofs are correct and that the value entered is correct")
    });
  });

  I = [1,1]
  it("should resolve to false for other input", function(){
     Verifier.deployed().then(function(instance){
      return instance.verifyTx.call(A,A_p,B,B_p,C,C_p,H,K,I);
    }).then(function(value){
      assert.equal(value.valueOf(), "false", "Oh, result wasn't false, if this wasn't what you expected check that the proofs are correct and that the value entered is correct")
    });
  });


});
