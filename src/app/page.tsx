"use client";

import { useAccount, useConnect } from "wagmi";
import NFTAbi from "@/abi/NFT";
import CoinbaseButton from "@/components/CoinbaseButton";
import { useCallsStatus, useWriteContracts } from "wagmi/experimental";
import TransactionStatus from "@/components/TransactionStatus";

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
    const { connectors } = useConnect();
    const { address, isConnected } = useAccount();
    const {
        writeContractsAsync,
        error: mintError,
        status: mintStatus,
        data: id,
    } = useWriteContracts();
    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: !!id,
            // Poll every second until the calls are confirmed
            refetchInterval: (data) =>
                data.state.data?.status === "CONFIRMED" ? false : 1000,
        },
    });

    async function mint() {
        const hash = await writeContractsAsync({
            contracts: [
                {
                    address: "0xA2bCe1b3a30Bb9f29092a3501b19FD9E55D36622",
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
                            currency:
                                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                        },
                        `0x`, // data
                    ],
                    functionName: "claim",
                },
            ],
        });
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
            </div>

            {isConnected ? (
                <div>
                    <h2>Mint</h2>
                    <button style={mintButtonStyles} onClick={mint}>
                        Mint
                    </button>
                    <div>writeContracts Status: {mintStatus}</div>
                    <div>{mintError?.message}</div>
                    <TransactionStatus callStatus={callsStatus} />
                </div>
            ) : null}
        </div>
    );
}

export default App;
