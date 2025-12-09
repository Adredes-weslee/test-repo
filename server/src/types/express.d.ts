declare module 'express' {
  import { IncomingMessage, ServerResponse } from 'http';

  export interface Request extends IncomingMessage {
    params: Record<string, string>;
    body?: any;
  }

  export interface Response extends ServerResponse {
    json: (body: any) => Response;
    status: (code: number) => Response;
  }

  export type NextFunction = (err?: any) => void;

  export interface Router {
    get(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => unknown>): Router;
    post(path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => unknown>): Router;
    use(...args: any[]): Router;
  }

  export interface Application extends Router {
    listen(port: number, callback?: () => void): void;
  }

  export function Router(): Router;
  export interface ExpressExports {
    (): Application;
    Router: typeof Router;
    json: () => (req: Request, res: Response, next: NextFunction) => void;
  }

  const express: ExpressExports;
  export default express;
}
