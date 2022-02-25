import Storage from './storage';

export default {
  baseURL: 'https://api.coingecko.com/api/v3',

  async fetchData(url) {
    let result = null;

    try {
      const response = await fetch(`${this.baseURL}/${url}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          result = data;
        }
      }
    } catch (err) {
      console.log(
        'Failed to get coin with contract address from coingecko service.',
        err,
      );
    }

    return result;
  },

  async getCoinsFromContract(network, address) {
    const url = `coins/${network}/contract/${address.toLowerCase()}`;
    return this.fetchData(url);
  },

  async fetchLinePrices(url) {
    let result = [];

    const data = await this.fetchData(`coins/${url}`);
    if (data && data.prices) {
      result = data.prices;
    }

    return result;
  },

  async fetchCandleStickPrices(url) {
    let result = [];

    const data = await this.fetchData(`coins/${url}`);
    if (data) {
      result = data;
    }

    return result;
  },

  async getLogoURL(network, address) {
    // check cached token logo urls at the first time.
    let result = null;

    const imageUrl = Storage.getCachedTokenLogoUrl(address);
    if (imageUrl) {
      result = imageUrl;
      return result;
    }

    // fetch info from coingecko service.
    const data = await this.getCoinsFromContract(network, address);
    if (data && data.image && data.image.small) {
      Storage.updateCachedTokenLogoUrl(address, data.image.small);
      result = data.image.small;
    }

    return result;
  },

  async getTokenPrice(network, address) {
    const lowerAddress = address.toLowerCase();
    let result = null;
    const url = `simple/token_price/${network}?contract_addresses=${lowerAddress}&vs_currencies=USD`;
    const data = await this.fetchData(url);
    console.log('## data ##', data);
    if (data && data[lowerAddress]) {
      result = data[lowerAddress].usd;
    }

    return result;
  }
};
