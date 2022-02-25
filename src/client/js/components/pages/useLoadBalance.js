/* eslint-disable no-param-reassign */
/* eslint-disable operator-linebreak */
/* eslint-disable no-restricted-properties */

import { useState } from 'react';

import _ from 'underscore';

import Wallet from '../../utils/wallet';
import TokenListManager from '../../utils/tokenList';

const INITIAL_STATE = {
  refresh: Date.now(),
  currentNetwork: TokenListManager.getCurrentNetworkConfig(),
  balances: [],
  loading: true,
};

const useLoadBalances = () => {
  const [myApplicationState, setMyApplicationState] = useState(INITIAL_STATE);

  const loadBalances = (onlyNodeCheck) => {
    _.defer(async () => {
      const promises = [];
      const localRefresh = myApplicationState.refresh;

      const networksEnabled = window.NETWORK_CONFIGS.filter((v) => v.enabled);

      const networkShallowClone = [];

      Promise.all(
        networksEnabled.map(
          (network) =>
            new Promise(async (resolve) => {
              const tokenList =
                TokenListManager.getTokenListForNetwork(network);

              let isRPCNodeActive;

              try {
                const defaultBalance = await Wallet.getDefaultBalance(network);

                if (defaultBalance) {
                  isRPCNodeActive = true;
                }
              } catch (e) {
                console.error(
                  'Failed to fetch balances from network: ',
                  network.name,
                );
                console.error(e);

                isRPCNodeActive = false;
              }

              networkShallowClone.push({ ...network, isRPCNodeActive });

              if (!isRPCNodeActive || onlyNodeCheck) {
                // if we already know the RPC node is down, let's exit early, instead of fetching all token balances
                resolve(true);
                return;
              }

              for (let j = 0; j < tokenList.length; j += 1) {
                const token = tokenList[j];

                const p = Wallet.getBalance(token, network).then(
                  ((tk, net, balance) => {
                    if (
                      myApplicationState.refresh === localRefresh &&
                      !balance.isZero()
                    ) {
                      setMyApplicationState((prevState) => ({
                        ...prevState,
                        balances: [
                          ...prevState.balances,
                          {
                            ...tk,
                            balance:
                              +balance.toString() / Math.pow(10, tk.decimals),
                            balanceBN: balance,
                            price: 1,
                          },
                        ],
                      }));
                    }
                  }).bind(this, token, network),
                );
                promises.push(p);
              }

              resolve(true);
            }),
        ),
      ).then(() => {
        // bleeding browser-support
        Promise.allSettled(promises).then(() => {
          console.log('Completed fetching balances from all networks');
          if (myApplicationState.refresh === localRefresh) {
            setMyApplicationState((prevState) => ({
              ...prevState,
              loading: false,
              networks: networkShallowClone,
            }));
          }
        });
      });
    });
  };

  return {
    myApplicationState,
    setMyApplicationState,
    loadBalances,
  };
};

export default useLoadBalances;
