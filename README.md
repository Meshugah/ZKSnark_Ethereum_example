# ZKSnark_Ethereum_example
A simple to follow example of ZKSnarks using Ethereum 


<img width="498" alt="screen shot 2018-11-01 at 11 35 39 am" src="https://user-images.githubusercontent.com/5532672/47865474-4f65bd00-ddca-11e8-87d7-07019279b347.png">

## Who runs which functions when?

### The bank
The ‘World Trade Francs’ Bank, Comes up with a hierarchy of importance for its customers, this hierarchy is formulated into an Arithmetic Circuit that determines if the customer is a VIP. A secret(ƛ) is generated with this circuit in mind and is then run through the Generator function(G) to produce the verifying key(vk) and proving key(pk). A solidity contract that contains a method to verify the code is run on the ethereum blockchain. 

The bank makes the proving and verifying key available to the public. Important to know, the bank has access to the user’s data(w) and computes if the individual(x) is a VIP.

This user’s credibility data(private input w), the proving key and the publicly known user(x) is used to generate a proof(π). This proof is then shared with the Credit Company to prove that the individual in context is infact a VIP, if they are. 


### The Credit card company
The credit card company, enamored by the fact that it would not have to directly interact with its customers which helps keep identity security intact(and lawsuits at bay), decides to use the bank’s way of proving the user’s qualification. They use the proof, the proving key and the user to verify the proof. The response given proves they are who they say they are. 


## The implementation
 
### Simplifications 
VIP levels are pre-calculated by the bank, the program’s private inputs are used here to represent them.


### Zokrates commands
Compile: turns our code from a higher level language to the corresponding circuit

Setup: to generate prover and verification key

Export verifier: exports the relevant verification tool to a contract.sol that can be run on chain

Compute witness : generates public witness used in proof generation

Generate proof : generates the proof required to be verified on chain

### Zokrates setup(the bank would do this)

The bank acts as the Generator and Prover in this interaction

### Build the Docker image
```
docker run -ti kyroy/zokrates /bin/bash
cd Zokrates
```
Create file VIP_check.code in the zokrates directory(VIP test is simple check for points greater than 5000, this 5000 is a private input):

```
def main(x,private s1):
    x == s1
    return 1
```
Run the following(5000 points qualifies towards VIP status for the user in this example)
```
./target/release/zokrates compile -i VIP_check.code
./target/release/zokrates setup
./target/release/zokrates export-verifier
```

From the above we get the verifier.sol contract that contains our verification key. 

**Important Detail**: The bank is the ‘trusted party’ here and so they would go about performing the respective duties of one, namely: 
Generating the witness as only they have access to private input (w)(the credibility of the individual in question). Zokrates generates the private and public inputs that are required for the next step
Generating the proof using the private and public inputs generated in the last step along with proving key.

```
./target/release/zokrates compute-witness -a 5000 --interactive 5000
```
(the interactive flag is used to set the private input). And then generate the proof.
```
./target/release/zokrates generate-proof
```
You would now need to export the required generated files from your docker container :
```
‘docker ps’ will give you the container ids 
‘docker cp [relevant_container_id]:root/ZoKrates/’ with the following the suffixes will be useful.
verifier.sol  ./
```
And the variables generate for the proof. For the given example, I've provided proof values and the verifier.sol generated.
```
Proof:
A = 0xf6d8181a05fcbc7b0677d86b8345dde4509db736d9400eedc1fa8540b6133d, 0x29a5251f3b220113d3fe898920b8d3447aa7bf416a67311372080039129f25
A_p = 0x1cbd056424db7ccfba291357bb7eb123213f190ad686a228010556f5eb5d228c, 0x283fc88deda932505839f242ab1a59e5d48f908700b0350f1da7fdd230ab4137
B = [0xfb673e56a0e004667ebbfec276b26f7ece4b198c3e201b09968e08734cdac0a, 0x1014b885143972fec7fdb81e904b67f26b8aa354f9edd88e3c87439fb2404866], [0xe966628ace796c793b24a5e00eb2ff309ec800409374621dc55979298893074, 0x8de360a539d208dda37b37ee65851197370774a07807cb8cec371e730dfb4c6]
B_p = 0x18398fd05fe52ca1f94ad67ad81fcad7f8968eae089e57c0f09e98a81655bad9, 0x94458ab4803978c6c01a7ce4c124245b711aa52ef55206fc53c5197caaecfe4
C = 0x194f708a375865d16ef5b0ac490137c27fd2cbe1026298005b003bd8a49b3243, 0x1f3614d64f9d3d80d8d437d83f4fbdaae5bca6d7be2002012871f85a5786615
C_p = 0x198d6a2ef0eb087d291ec18cabdaa77fb21a536a2f9883c6533573f9e4848ac8, 0x11a0bbdd9f48575ff1f02d130b060bf8f8a54933a4342dcb43d2467e573bdce
H = 0x262cf771eccecd7e30104b14f30119553f2155554ab1451187f3b931b9028957, 0x291cfd963f09850b8f507f821ae1344da75229c3a634b376760cd06a00e39b9e
K = 0x23bd5886031e3556a398b362b195f2761b08f582e664e4df8db1713f4e2dddbe, 0x117fec4a0e44dafff10be82d9035c4d8b22b9d351e7ab70aa60b2f694afb4381
```

### Zokrates setup(the credit card company would do this)

The Credit card company acts as the Verifier in this interaction. 

So to verify the proof they are given, the proof, the verification key generated and the public input, x, must be passed into the Verification function. 





