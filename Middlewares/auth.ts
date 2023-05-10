import express, { NextFunction, Request, Response } from 'express';
import Web3 from 'web3';

function authenticate(providerUrl: string) {
  const web3 = new Web3(providerUrl);

  return function(req: Request, res: Response, next: NextFunction) {
    const address = req.headers['x-ethereum-address'] as string;
    if (!address) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    web3.eth.getAccounts()
      .then((accounts) => {
        if (accounts.includes(address)) {
          req.user = { address };
          next();
        } else {
          res.status(401).json({ error: 'Invalid authentication' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  };
}
