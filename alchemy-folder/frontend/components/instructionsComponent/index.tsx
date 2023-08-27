import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, usePrepareSendTransaction, useSendTransaction } from "wagmi";
import tokenJson from '../../../backend/artifacts/contracts/LotteryToken.sol/LotteryToken.json';
import * as lotteryJson from '../../../backend/artifacts/contracts/Lottery.sol/Lottery.json';
import 'dotenv/config';
require('dotenv').config();

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Lottery<span> Web3 dApp</span>
          </h1>
          <h3></h3>
        </div>
      </header>
      <WalletInfo></WalletInfo>
      <PageBody></PageBody>
    </div>
  );
}

function PageBody() {
  return (
    <div>
      <CheckState></CheckState>
      <DisplayOwnerPool></DisplayOwnerPool>
      <CloseLottery></CloseLottery>
    </div>
  )
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your account address is <b>{address}</b>.</p>
        <p>Connected to the <b>{chain?.name}</b> network.</p>
        <WalletBalance address={address}></WalletBalance>
        <TokenName></TokenName>
        <TokenBalance address={address}></TokenBalance>
        <BuyTokens address={address}></BuyTokens>
        <WithdrawTokens address={address}></WithdrawTokens>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Connecting wallet...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue.</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue.</p>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <p>Fetching balance…</p>;
  if (isError) return <p>Error fetching balance.</p>;
  return (
    <div>
      <p>Balance: <b>{data?.formatted} {data?.symbol}</b></p>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: "0xb498F8ADcf2ca6b131b87459c0449c4Bb3De23A7",
    abi: tokenJson.abi,
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <p>Fetching name…</p>;
  if (isError) return <p>Error fetching name.</p>;
  return <p>Token name: <b>{name}</b></p>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0xb498F8ADcf2ca6b131b87459c0449c4Bb3De23A7",
    abi: tokenJson.abi,
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "bigint" ? data : 0;

  if (isLoading) return <p>Fetching balance...</p>;
  if (isError) return <p>Error fetching balance.</p>;
  return <p>Token balance: <b>{Number(balance)}</b> decimal units of <b>LotteryToken</b>.</p>;
}

function DisplayOwnerPool() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:3001/display-owner-pool")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

function CheckState() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:3001/check-state")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

function BuyTokens(params: {address: string}) {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess } = useSendTransaction(config);
  const [amount, setAmount] = useState("");

  if (isLoading) return <p>Requesting purchase from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: params.address, amount: amount })
  };

  if (!data) return (
    <div>
      <form>
        <label>
          Enter amount of tokens to purchase:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
          />
        </label>
      </form>
      <button
        disabled={isLoading} 
        onClick={() => fetch("http://localhost:3001/buy-tokens", requestOptions)}>
        Buy Tokens
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  )
  return <></>
}

function WithdrawTokens(params: { address: string }) {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess } = useSendTransaction(config);
  const [amount, setAmount] = useState("");

  if (isLoading) return <p>Requesting withdraw from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: params.address, amount: amount })
  };

  if (!data) return (
    <div>
      <form>
        <label>
          Enter amount of tokens to withdraw:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
          />
        </label>
      </form>
      <button
        disabled={isLoading} 
        onClick={() => fetch("http://localhost:3001/withdraw-tokens", requestOptions)}>
        Withdraw Tokens
      </button>
      {isLoading && <div>Check Wallet...</div>}
      {!isSuccess && <div>Failure fetching withdrawal.</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  )
  return <></>
}

function CloseLottery() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:3001/close-lottery")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return (
    <div className={styles.button}>
      CLOSE LOTTERY
    </div>
  )
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}
