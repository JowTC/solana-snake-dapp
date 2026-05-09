/**
 * Thin wrapper around Mobile Wallet Adapter.
 * Handles connect / disconnect and exposes the public key as a string.
 */
import { useState, useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';

const APP_IDENTITY = {
  name: 'Solana Snake',
  uri: 'https://solanasnake.app',
  icon: 'favicon.ico',
};

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      await transact(async (wallet) => {
        const { accounts } = await wallet.authorize({
          cluster: 'devnet',
          identity: APP_IDENTITY,
        });
        if (accounts.length > 0) {
          const pubkey = new PublicKey(accounts[0].address);
          setAddress(pubkey.toBase58());
        }
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Wallet connection failed';
      setError(msg);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return { address, connecting, error, connect, disconnect };
}
