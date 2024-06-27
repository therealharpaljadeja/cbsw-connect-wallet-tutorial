# How to integrate Coinbase Smart Wallet into your frontend (Wagmi Template)

> [!NOTE]  
> This repository has the completed code if you are looking for instructions on using this repo jump to [Usage](#usage) section, below are the steps to recreate this project from Wagmi Template.

## Tutorial

### Initialize project using `create wagmi`

```bash
npm create wagmi
```

### Change default config to support Base network and Smart Wallet

Change the config in file `src/wagmi.ts`

```ts file=wagmi.ts
const config = createConfig({
    chains: [baseSepolia],
    // chains: [base], // Base mainnet
    connectors: [
        coinbaseWallet({
            appName: "Create Wagmi",
            preference: "smartWalletOnly",
        }),
    ],
    ssr: true,
    transports: {
        // [base.id]: http(), // Base mainnet
        [baseSepolia.id]: http(),
    },
});
```

### Add Coinbase Blue Connect Wallet Button (optional)

Coinbase Blue Connect Wallet Button comprises of an additional component called `CoinbaseWalletLogo`.

The below is the code for the same.

```tsx file=CoinbaseWalletLogo.tsx
import React from "react";

const defaultContainerStyles = {
    paddingTop: 2,
};

export function CoinbaseWalletLogo({
    size = 26,
    containerStyles = defaultContainerStyles,
}) {
    return (
        <div style={containerStyles}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2.66675 15.9998C2.66675 23.3628 8.63712 29.3332 16.0001 29.3332C23.363 29.3332 29.3334 23.3628 29.3334 15.9998C29.3334 8.63687 23.363 2.6665 16.0001 2.6665C8.63712 2.6665 2.66675 8.63687 2.66675 15.9998ZM12.5927 11.7035H19.4075C19.9001 11.7035 20.2964 12.0998 20.2964 12.5924V19.4072C20.2964 19.8998 19.9001 20.2961 19.4075 20.2961H12.5927C12.1001 20.2961 11.7038 19.8998 11.7038 19.4072V12.5924C11.7038 12.0998 12.1001 11.7035 12.5927 11.7035Z"
                    fill="white"
                />
            </svg>
        </div>
    );
}
```

To create `CoinbaseButton` component use the below code and paste in a file.

For example: `src/components/CoinbaseButton.tsx`

```tsx file=CoinbaseButton.tsx
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { CoinbaseWalletLogo } from "./CoinbaseWalletLogo";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const buttonStyles = {
    background: "transparent",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#0052FF",
    padding: "8px 20px 8px 14px",
    borderRadius: 10,
};

export default function CoinbaseButton(
    props: DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >
) {
    const { connect, connectors } = useConnect();
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    function connectToSmartWallet() {
        const coinbaseWalletConnector = connectors.find(
            (connector) => connector.id === "coinbaseWalletSDK"
        );

        if (coinbaseWalletConnector) {
            connect({ connector: coinbaseWalletConnector });
        }
    }

    if (isConnected)
        return (
            <button style={buttonStyles} onClick={() => disconnect()}>
                <CoinbaseWalletLogo />
                <span style={{ marginLeft: "10px" }}>Disconnect</span>
            </button>
        );

    return (
        <button style={buttonStyles} onClick={connectToSmartWallet}>
            <CoinbaseWalletLogo />
            <span style={{ marginLeft: "10px" }}>Connect Wallet</span>
        </button>
    );
}
```

### Using Connect Button in UI

If you want not implemented the `CoinbaseButton` component you can any button of your choice, just make sure to copy the code related to `wagmi` hooks.

```tsx
import CoinbaseButton from "@/components/CoinbaseButton";
import { useConnect } from "wagmi";

function App() {
    const { connectors, status, error } = useConnect();

    return (
        <div>
            <h2>Connect</h2>
            {/* 
                There could be many other connectors in your config, atleast the Injected one is present by default by using the below code we can make sure only Coinbase Smart Wallet is available 
            */}
            {connectors
                .filter((connector) => connector.name === "Coinbase Wallet")
                .map((connector, index) => (
                    <CoinbaseButton key={index} />
                ))}
            <div>{status}</div>
            <div>{error?.message}</div>
        </div>
    );
}
```

### Prompting Transactions

The `mint` function below is an example of how you can prompt transactions to the user. We are using wagmi's [`useWriteContracts`](https://wagmi.sh/react/api/hooks/useWriteContracts) hook which allows batching multiple transactions (since Coinbase Smart Wallet supports batching!)

> [!NOTE] > `writeContractAsync` won't return a transaction hash instead returns a batch id when can be used to further get the batch status, more on that in the next step.

```tsx
function App() {
    const {
        writeContractsAsync,
        error: mintError,
        status: mintStatus,
        data: id,
    } = useWriteContracts();

    // Other hooks and functions

    async function mint() {
        await writeContractsAsync({
            contracts: [
                {
                    address: "<Some Token Address>",
                    abi: parseAbi(["function mint(address, uint256)"]),
                    args: [address, parseEther(1)],
                    functionName: "mint",
                },
            ],
        });
    }

    return (
        <div>
            {/* Other UI code */}
            <button onClick={mint}>Mint</button>
        </div>
    );
}
```

### Fetching batch status and transaction hash

Once you have the batch id from `writeContractsAsync` or `writeContracts` you can use `useCallsStatus` hook from wagmi which can fetch the batch status along with the receipt.

`useCallsStatus` returns receipts for all calls in the batch, if you are sending a single transaction the first recipt should be the receipt for your transaction.

```tsx
function App() {
    const {
        writeContractsAsync,
        error: mintError,
        status: mintStatus,
        data: id,
    } = useWriteContracts();

    const [receipt, setReceipt] = useState(null);
    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: !!id,
            // Poll every second until the calls are confirmed
            refetchInterval: (data) =>
                data.state.data?.status === "CONFIRMED" ? false : 1000,
        },
    });

    useEffect(() => {
        if (callStatus && callStatus.status === "CONFIRMED") {
            let receipt = callStatus.receipts[0];
            setReceipt(receipt);
        }
    }, [callStatus]);

    // Other hooks and functions

    async function mint() {
        await writeContractsAsync({
            contracts: [
                {
                    address: "<Some Token Address>",
                    abi: parseAbi(["function mint(address, uint256)"]),
                    args: [address, parseEther(1)],
                    functionName: "mint",
                },
            ],
        });
    }

    return (
        <div>
            {/* Other UI code */}
            <button onClick={mint}>Mint</button>
            {receipt ? <div>{receipt.transactionHash}</div> : null}
        </div>
    );
}
```

## Usage

1. Clone the repo
2. Install Dependencies

```bash
npm i
```

3. Start the App

```bash
npm run dev
```

## Reference

[Smart Wallet docs](https://www.smartwallet.dev/guides/create-app/using-wagmi)
