const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : process.env.HOST;
// export const server = 'http://localhost:3000';

export const isBrowser = () => typeof window !== 'undefined';
