
export interface SustainRequest extends Request {
  staticFileExist?: boolean;
  startAt?: any;
  session?: any;
  method: string;
  url: string;
}
