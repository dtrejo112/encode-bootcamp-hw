import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, useSignMessage } from "wagmi";
import { Button, Grid, Typography } from "@mui/material";


export default function InstructionsComponent() {
  return (
    <Grid>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>My App</h1>
        </div>
      </header>
      <Grid item sx={{ display: 'flex', justifyContent: 'flex-start', p: 6}}>
          <PageBody />
      </Grid>
    </Grid>
  );
};

function PageBody() {
  const { address } = useAccount();
  return (
   <Grid container gap={2}>

   <Grid item xs={12}> 
      <WalletInfo />
   </Grid>
    <Grid item>
        <TokenAddressFromAPi />
    </Grid>
   
    {address ? 
          <Grid container direction='row' gap={2}>
          <Grid item> 
              <RequestTokenMint address={address} />
          </Grid>
          <Grid item>
             <SelfDelegate address={address} />
          </Grid>
          </Grid> : 
          '' }
   
     
    <Grid item>
        <Vote />
    </Grid>
      
    <Grid item>
       <WinningProposal />
     </Grid>
     
    </Grid>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  // if (address)
  //   return (
  //     <div>
  //       <p>Your account address is {address}</p>
  //       <p>Connected to the network {chain?.name}</p>
  //       <WalletAction></WalletAction>
  //       <WalletBalance address={address}></WalletBalance>
  //     </div>
  //   );
  // if (isConnecting)
  //   return (
  //     <div>
  //       <p>Loading...</p>
  //     </div>
  //   );
  // if (isDisconnected)
  //   return (
  //     <div>
  //       <p>Wallet disconnected. Connect wallet to continue</p>
  //     </div>
  //   );
  return (
    <>
   {isConnecting ?
    <div>
      <p>Loading...</p>
    </div> : ''}
    {address ? <div>
     
      
      <Typography> Your account address is {address} </Typography>
      <p>Connected to the network {chain?.name}</p>
      {/* <WalletAction></WalletAction> */}
      <WalletBalance address={address}></WalletBalance>
      {/* <TokenName />
      <TokenBalance  address={address}/>
      <RandomWord /> */}

    </div> : ''}
    {isDisconnected ? <div>
      <p>Connect wallet to continue</p>
      </div> : ''}
    </>
    // <div>
    //   <p>Connect wallet to continue</p>
    // </div>
  );
}
function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}
function TokenAddressFromAPi() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/get-address")
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {isLoading && data ?
      (<Typography> Loading token address from API... </Typography>): 
      ''
      }
      {data ? 
         (<Typography> Token Address: {data.address}  </Typography>) : 
         (<Typography> Token Address: No answer from api </Typography>) 
      
      }
    </div>
  );
}

function RequestTokenMint (params: { address: `0x${string}` })  {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: params.address })
    };

  if (isLoading) return <p> Requesting tokens </p>;
  if (!data) return (<Button
        variant='contained'
        disabled={isLoading}
        onClick={() =>  {  
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          });
          }
        }
      >
        Request Tokens
      </Button>)

  return (
    <div>
      <Typography> Mint success: { data.success ? 'worked': 'failed'}</Typography>
      <Typography> Transaction hash: {data.txHash}</Typography>
    </div>
  );
}
function SelfDelegate (params: { address: `0x${string}` })  {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: params.address })
    };

  if (isLoading) return <Typography> Getting ready to vote... </Typography>;
  if (!data) return (<Button
        variant="contained"
        disabled={isLoading}
        onClick={() =>  {  
          setLoading(true);
          fetch("http://localhost:3001/self-delegate", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          });
          }
        }
      >
        Ready to Vote
      </Button>)

  return (
    <div>
      <Typography> Vote status: { data.success ? 'Ready': ''}</Typography>
      <Typography> Transaction hash: {data.txHash}</Typography>
    </div>
  );
}
function Vote()  {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState('0');
  const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal: proposal, amount: amount })
    };

  if (isLoading) return <p> Getting ready to vote... </p>;
  if (!data) return (
    <> 
    <form>
    <label>
      Enter proposal you would like to vote for
    </label>
    <input
        type="text"
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
      />
    <label>
      Enter amount of tokens you would like to use
    </label>
    <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
  </form>
      <button
        disabled={isLoading}
        onClick={() =>  {  
          setLoading(true);
          fetch("http://localhost:3001/vote-proposal", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          });
          }
        }
      >
        Vote
      </button>
      </>)

  return (
    <div>
      <p> Vote status: { data.success ? `Successful vote for: ${data.proposalVoted}. ${data.votedFor} ` : 'Vote Failed'}</p>
      <p> Transaction hash: {data.txHash}</p>
    </div>
  );
}

function WinningProposal ()  {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  if (isLoading) return <p> Getting winner... </p>;
  if (!data) return (<button
        disabled={isLoading}
        onClick={() =>  {  
          setLoading(true);
          fetch("http://localhost:3001/get-winner")
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          });
          }
        }
      >
        Get Winner
      </button>)

  return (
    <div>
       <p> Winner: { data.success ? `${data.winningProposalNumber}. ${data.winningProposal} ` : 'No winner'}</p>
    </div>
  );
}