class HttpException extends Error {
  status: number;
  message: string;
  extra: string;
  constructor(status: number, message: string, extra: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.extra = extra;
  }
}

export default HttpException;