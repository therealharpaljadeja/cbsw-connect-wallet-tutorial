"use client";

import {
    useAccount,
    useConnect,
    useDisconnect,
    useSendTransaction,
} from "wagmi";
import NFTAbi from "@/abi/NFT";
import { encodeFunctionData } from "viem";

function App() {
    const account = useAccount();
    const { connect, connectors, status, error } = useConnect();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { sendTransaction } = useSendTransaction();

    async function mint() {
        try {
            const hash = await sendTransaction({
                to: "0xA2bCe1b3a30Bb9f29092a3501b19FD9E55D36622",
                data: encodeFunctionData({
                    abi: NFTAbi,
                    args: [
                        address,
                        BigInt(0),
                        BigInt(1),
                        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                        BigInt(0),
                        {
                            proof: [],
                            quantityLimitPerWallet: BigInt(
                                "115792089237316195423570985008687907853269984665640564039457584007913129639935"
                            ),
                            pricePerToken: BigInt(0),
                            currency:
                                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                        },
                        `0x`,
                    ],
                    functionName: "claim",
                }),
            });

            console.log(hash);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div>
                <h2>Account</h2>

                <div>
                    status: {account.status}
                    <br />
                    addresses: {JSON.stringify(account.addresses)}
                    <br />
                    chainId: {account.chainId}
                </div>

                {account.status === "connected" && (
                    <button type="button" onClick={() => disconnect()}>
                        Disconnect
                    </button>
                )}
            </div>

            <div>
                <h2>Connect</h2>
                {connectors
                    .filter((connector) => connector.name === "Coinbase Wallet")
                    .map((connector) => (
                        <button
                            key={connector.uid}
                            onClick={() => connect({ connector })}
                        >
                            {connector.name}
                        </button>
                    ))}
                <div>{status}</div>
                <div>{error?.message}</div>
            </div>

            {isConnected ? (
                <div>
                    <h2>Mint</h2>
                    <button onClick={mint}>Mint</button>
                </div>
            ) : null}
        </>
    );
}

export default App;
