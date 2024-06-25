import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
    chains: [baseSepolia],
    // chains: [base],
    connectors: [
        coinbaseWallet({
            appName: "Create Wagmi",
            preference: "smartWalletOnly",
        }),
    ],
    ssr: true,
    transports: {
        // [base.id]: http(),
        [baseSepolia.id]: http(),
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
