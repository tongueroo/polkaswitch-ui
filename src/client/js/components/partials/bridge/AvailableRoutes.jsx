import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import { BigNumber, constants, providers, Signer, utils } from 'ethers';
import TokenListManager from '../../../utils/tokenList';
import RouteItemWrapper from './RouteItemWrapper';

export default function AvailableRoutes(props) {
  const network = TokenListManager.getCurrentNetworkConfig();
  const GENERIC_SUPPORTED_BRIDGE_TOKENS = ["USDC", "USDT", "DAI"];

  const routes = _.map(props.routes, function(v, i) {
    var route = [];
    var bridgeType = v.bridge;
    var targetBridgeToken = 'USDC';

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

    if (bridgeType === "connext" &&
      GENERIC_SUPPORTED_BRIDGE_TOKENS.includes(props.from.symbol.toUpperCase())) {
      route = route.concat([
        {
          type: "swap",
          data: {
            fee: 0.39
          }
        },
        {
          type: 'token-network',
          token: {
            amount: props.fromAmount,
            name: 'USDC',
            logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
          },
          network: {
            name: 'Polygon'
          }
        }
      ]);
    } else {
      targetBridgeToken = props.from.symbol.toUpperCase();
    }

    route.push({
      type: "bridge",
      data: {
        name: bridgeType.toUpperCase(),
        fee: 0.05
      }
    });

    if (bridgeType === "connext" &&
      targetBridgeToken != props.to.symbol.toUpperCase()) {
      route.push({
        type: "swap",
        data: {
          fee: 0.39
        }
      });
    }

    route = route.concat([
      {
        type: 'token-network',
        token: {
          amount: utils.formatUnits(
            v.estimate?.returnAmount ?? constants.Zero,
            props.to.decimals,
          ),
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
    ]);

    return route;
  });

  return (
    <div
      className={classnames("token-dist-wrapper control", { "is-hidden": routes.length === 0 })}
      aria-label="Available routes for the swap"
    >
      <div
        className={classnames('loader-wrapper', {
          'is-active': props.loading,
        })}
      >
        <div className="loader is-loading"></div>
      </div>
      {routes.length > 0 &&
          _.map(routes, function (item, i) {
            return (
              <RouteItemWrapper key={i} data={item} index={i}></RouteItemWrapper>
            );
          })}
        </div>
  );
}
