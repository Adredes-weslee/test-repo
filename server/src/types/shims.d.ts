declare module 'express' {
  const exp: any;
  export default exp;
}

declare module 'cors' {
  const corsMiddleware: any;
  export default corsMiddleware;
}

declare module 'dotenv' {
  const dotenv: any;
  export default dotenv;
}

declare const process: {
  env: Record<string, string | undefined>;
};
