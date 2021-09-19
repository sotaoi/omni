class ErrorException extends Error {
  public code: number;

  constructor(code = 400, message = '') {
    super(message);
    this.code = code;
  }
}

const Errors: { [key: string]: typeof ErrorException } = {
  ResultIsCorrupt: class ResultIsCorruptError extends ErrorException {},
  NotFoundView: class NotFoundViewError extends ErrorException {},
  ComponentFail: class ComponentFailError extends ErrorException {},
  NotFoundLayout: class NotFoundLayoutError extends ErrorException {},
  InvalidGateRepository: class InvalidGateRepositoryError extends ErrorException {},
};

class ErrorCode {
  public static APP_GENERIC_ERROR = 'app.generic.error';
}

export { ErrorException, Errors, ErrorCode };
