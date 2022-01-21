import React from 'react';
import _ from 'underscore';
import TokenListManager from '../../../utils/tokenList';
import RouteItemWrapper from './RouteItemWrapper';

export default function AvailableRoutes(props) {
  const network = TokenListManager.getCurrentNetworkConfig();
  const GENERIC_SUPPORTED_BRIDGE_TOKENS = ["USDC", "USDT", "DAI"];

  const routes = _.map(props.routes, function(v, i) {
    var route = [];

    route.push({
      type: 'token-network',
      token: {
        amount: props.fromAmount,
        name: props.from.symbol,
        logoURI: props.from.logoURI
      },
      network: {
        name: props.fromChain.name
      }
    });

    if (props.from.symbol != props.to.symbol) {

    }

    if (v === "connext") {
      return [
        {
          type: 'token-network',
          token: {
            amount: props.fromAmount,
            name: props.from.symbol,
            logoURI: props.from.logoURI
          },
          network: {
            name: props.fromChain.name
          }
        },
        {
          type: "swap",
          data: {
            fee: 0.39
          }
        },
        {
          type: 'token-network',
          token: {
            amount: 1475.27,
            name: 'USDC',
            logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
          },
          network: {
            name: 'Polygon'
          }
        },
        {
          type: "bridge",
          data: {
            fee: 0.05
          }
        },
        {
          type: 'token-network',
          token: {
            amount: props.toAmount,
            name: props.to.symbol,
            logoURI: props.to.logoURI
          },
          network: {
            name: props.toChain.name
          }
        },
        {
          type: 'additional',
          fee: 0.0051232,
          duration: '-5 Minutes'
        }
      ];
    } else if (v === "hop") {
    };
  });

  return (
    <div
      className="token-dist-wrapper control"
      aria-label="Available routes for the swap"
    >
      {routes.length > 0 &&
        _.map(routes, function (item, i) {
          return (
            <RouteItemWrapper key={i} data={item} index={i}></RouteItemWrapper>
          );
        })}
    </div>
  );
}
