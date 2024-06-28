import Link from "next/link";
import { WalletCallReceipt } from "viem";

export default function TransactionStatus({
    callStatus,
}: {
    callStatus:
        | {
              status: "PENDING" | "CONFIRMED";
              receipts?:
                  | WalletCallReceipt<bigint, "success" | "reverted">[]
                  | undefined;
          }
        | undefined;
}) {
    if (!callStatus) return null;

    if (callStatus.status === "PENDING")
        return <div>Batch Status: {callStatus.status}</div>;

    if (callStatus.receipts) {
        let receipt = callStatus.receipts[0];
        let { transactionHash } = receipt;
        console.log(receipt);

        return (
            <div>
                <div>
                    Transaction Hash:{" "}
                    <Link
                        target="_blank"
                        href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                    >
                        {transactionHash}
                    </Link>
                </div>
            </div>
        );
    }
}
