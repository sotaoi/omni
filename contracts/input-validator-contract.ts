import type { BaseInput, FieldValidation, FormValidations } from '@sotaoi/omni/input/base-input';
import type { CollectionInput } from '@sotaoi/omni/input/collection-input';
import type { ErrorResult } from '@sotaoi/omni/transactions';
import type { DatabaseConnection } from '@sotaoi/omni/definitions/mdriver';

type RequesterFn = (key: string, validations: FieldValidation[], args: { [key: string]: any }) => Promise<string[]>;

interface InputValidatorConfig {
  getInput?: (key: string) => void | null | BaseInput<any, any>;
  t?: (key: string, ...args: any[]) => string;
  messages?: { [key: string]: { [key: string]: string } };
  defaultErrorMsg?: string;
}

interface InputValidationResult {
  valid: boolean;
  title: string;
  message: string;
  validations: { [key: string]: string[] };
}

abstract class InputValidator<FormValidation = null> {
  abstract getResult(): InputValidationResult;
  abstract setErrorResult(errorResult: ErrorResult): void;
  abstract getErrors(key: string): string[];
  abstract getApiErrors(key: string): string[];
  abstract getAllApiErrors(): { [key: string]: string[] };
  abstract validate(key: string, validations: FieldValidation[]): Promise<string[]>;
  abstract validateCollection(collectionInput: CollectionInput): Promise<string[]>;
  abstract validateCollections(payload: { [key: string]: any }, form: FormValidations, tlPrefix: string): Promise<void>;
  abstract validatePayload(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
    isUpdateCommand: boolean,
  ): Promise<void>;

  abstract getFormValidation(
    getInput: (key: string) => void | null | BaseInput<any, any>,
  ): InputValidator<(key: string) => void | null | BaseInput<any, any>>;

  public static DEFALUT_ERROR_MSG = 'Field validation failed for method "%s"';

  protected config: InputValidatorConfig;
  protected mdb: () => null | ((repository: string) => DatabaseConnection.QueryBuilder);
  protected requester: null | RequesterFn;
  protected formValidation: null | FormValidation;
  protected errorTitle: null | string;
  protected errorMsg: null | string;
  protected errorMessages: { [key: string]: string[] };
  protected apiErrorMessages: { [key: string]: string[] };
  protected apiErrorXdata: { [key: string]: any };

  constructor(
    config: InputValidatorConfig,
    mdb: () => null | ((repository: string) => DatabaseConnection.QueryBuilder),
    requester: null | RequesterFn,
  ) {
    if ((!mdb() && !requester) || (!!mdb() && !!requester)) {
      throw new Error('failed to initialize input validator');
    }
    this.config = config;
    this.mdb = mdb;
    this.requester = requester;
    this.formValidation = null;
    this.errorTitle = null;
    this.errorMsg = null;
    this.errorMessages = {};
    this.apiErrorMessages = {};
    this.apiErrorXdata = {};
  }

  public isValid(): boolean {
    for (const errorMessages of Object.values(this.errorMessages)) {
      if (!errorMessages.length) {
        continue;
      }
      return false;
    }
    return true;
  }
}

export { InputValidator };
export type { RequesterFn, InputValidatorConfig, InputValidationResult };
