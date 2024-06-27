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

Finally, you can use the Coinbase Blue Smart Wallet Button in your UI as follows.

```tsx
import CoinbaseButton from "@/components/CoinbaseButton";
import { useConnect } from "wagmi";

function App() {
    const { connectors, status, error } = useConnect();

    return (
        <div>
            <h2>Connect</h2>
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
