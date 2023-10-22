import { rest } from 'msw';

const API_BASE = 'https://www.tistory.com/apis';

export const handlers = [
  rest.get(/.+/, (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];
