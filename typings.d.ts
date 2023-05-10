// typings.d.ts

import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { address: string };
    }
  }
}
