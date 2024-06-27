"use client";

import { useAccount, useConnect, useSendTransaction } from "wagmi";
import NFTAbi from "@/abi/NFT";
import { encodeFunctionData } from "viem";
import CoinbaseButton from "@/components/CoinbaseButton";

const mintButtonStyles = {
    background: "transparent",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#0052FF",
    padding: "10px 14px",
    borderRadius: 10,
};

function App() {
    const account = useAccount();
    const { connectors, status, error } = useConnect();
    const { address, isConnected } = useAccount();
    const {
        sendTransaction,
        error: mintError,
        status: mintStatus,
    } = useSendTransaction();

    async function mint() {
        const hash = await sendTransaction({
            to: "0xA2bCe1b3a30Bb9f29092a3501b19FD9E55D36622",
            data: encodeFunctionData({
                abi: NFTAbi,
                args: [
                    address,
                    BigInt(0), // tokenId
                    BigInt(1), // quantity
                    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // currency
                    BigInt(0), // pricePerToken
                    {
                        proof: [],
                        quantityLimitPerWallet: BigInt(
                            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
                        ),
                        pricePerToken: BigInt(0),
                        currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    },
                    `0x`, // data
                ],
                functionName: "claim",
            }),
        });

        console.log(hash);
    }

    return (
        <div style={{ padding: "20px" }}>
            <div>
                <h2>Account</h2>

                <div>
                    status: {account.status}
                    <br />
                    addresses: {JSON.stringify(account.addresses)}
                    <br />
                    chainId: {account.chainId}
                </div>
            </div>

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

            {isConnected ? (
                <div>
                    <h2>Mint</h2>
                    <button style={mintButtonStyles} onClick={mint}>
                        Mint
                    </button>
                    <div>{mintStatus}</div>
                    <div>{mintError?.message}</div>
                </div>
            ) : null}
        </div>
    );
}

export default App;
