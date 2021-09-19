import type { CommandResult, AuthResult, TaskResult } from '@sotaoi/omni/transactions';

class Output {
  // this does not work yet (ALLOW_SKIP_UNCHANGED)
  public static readonly ALLOW_SKIP_UNCHANGED = true;

  public static parseCommand(output: { [key: string]: any }): CommandResult {
    const { CommandResult } = require('@sotaoi/omni/transactions');
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.code !== 'number':
        case typeof output.errorCode !== 'string' && output.errorCode !== null:
        case typeof output.title !== 'string':
        case typeof output.msg !== 'string':
        case typeof output.artifact === 'undefined':
        case typeof output.validations === 'undefined':
        case typeof output.xdata === 'undefined':
          throw new Error('bad command output');
        default:
          return new CommandResult(
            output.code,
            output.errorCode,
            output.title,
            output.msg,
            output.artifact || null,
            output.validations || null,
            output.xdata || {},
          );
      }
    } catch (err) {
      const { ErrorCode } = require('@sotaoi/omni/errors');
      return new CommandResult(
        400,
        ErrorCode.APP_GENERIC_ERROR,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Something went wrong',
        null,
        null,
        {},
      );
    }
  }

  // parseQuery

  // parseRetrieve

  public static parseAuth(output: { [key: string]: any }): AuthResult {
    const { AuthResult } = require('@sotaoi/omni/transactions');
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.code !== 'number':
        case typeof output.errorCode !== 'string' && output.errorCode !== null:
        case typeof output.title !== 'string':
        case typeof output.msg !== 'string':
        case typeof output.authRecord === 'undefined':
        case typeof output.accessToken === 'undefined':
        case typeof output.validations === 'undefined':
        case typeof output.xdata === 'undefined':
          throw new Error('bad auth output');
        default:
          return new AuthResult(
            output.code,
            output.errorCode,
            output.title,
            output.msg,
            output.authRecord || null,
            output.accessToken || null,
            output.validations || null,
            output.xdata || {},
          );
      }
    } catch (err) {
      const { ErrorCode } = require('@sotaoi/omni/errors');
      return new AuthResult(
        400,
        ErrorCode.APP_GENERIC_ERROR,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Something went wrong',
        null,
        null,
        null,
        {},
      );
    }
  }

  public static parseTask(output: { [key: string]: any }): TaskResult {
    const { TaskResult } = require('@sotaoi/omni/transactions');
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.code !== 'number':
        case typeof output.errorCode !== 'string' && output.errorCode !== null:
        case typeof output.title !== 'string':
        case typeof output.msg !== 'string':
        case typeof output.data === 'undefined':
        case typeof output.validations === 'undefined':
        case typeof output.xdata === 'undefined':
          throw new Error('bad task output');
        default:
          return new TaskResult(
            output.code,
            output.errorCode,
            output.title,
            output.msg,
            output.data || null,
            output.validations || null,
            output.xdata || {},
          );
      }
    } catch (err) {
      const { ErrorCode } = require('@sotaoi/omni/errors');
      return new TaskResult(
        400,
        ErrorCode.APP_GENERIC_ERROR,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Something went wrong',
        null,
        null,
        {},
      );
    }
  }
}

export { Output };
