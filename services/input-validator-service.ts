import type { InputValidatorConfig, InputValidationResult, RequesterFn } from '@sotaoi/omni/contracts/input-validator';
import type { ErrorResult } from '@sotaoi/omni/transactions';
// import type { StringInput } from '@sotaoi/omni/input/string-input';
// import type { CollectionInput } from '@sotaoi/omni/input/collection-input';
// import type { BooleanInput } from '@sotaoi/omni/input/boolean-input';
import type { BaseInput, FieldValidation, FormValidations } from '@sotaoi/omni/input/base-input';
import type { DatabaseConnection } from '@sotaoi/omni/definitions/mdriver';

import { InputValidator } from '@sotaoi/omni/contracts/input-validator';
import { Helper } from '@sotaoi/omni/helper';
import _ from 'lodash';
import { OmniBaseField } from '@sotaoi/omni/omni-base-field';
import { FileInput } from '@sotaoi/omni/input/file-input';
import { StringInput } from '@sotaoi/omni/input/string-input';
import { MultiFileInput } from '@sotaoi/omni/input/multi-file-input';
import { BooleanInput } from '@sotaoi/omni/input/boolean-input';
import { CollectionInput } from '@sotaoi/omni/input/collection-input';
import { RefSelectInput } from '@sotaoi/omni/input/ref-select-input';

class InputValidatorService extends InputValidator {
  protected t: (key: string, ...args: any[]) => string;
  protected messages: { [key: string]: { [key: string]: string } };

  constructor(
    config: InputValidatorConfig,
    mdb: () => null | ((repository: string) => DatabaseConnection.QueryBuilder),
    requester: null | RequesterFn,
  ) {
    config.t = config.t || ((key: string, ...args: any[]): string => key);
    config.messages = {
      generic: {
        invalid: 'Field is invalid',
      },
      required: {
        isRequired: 'This field is required',
      },
      email: {
        format: 'This does not look like an email address',
      },
      ref: {
        isNot: 'Selected value is invalid',
      },
      ...config.messages,
    };
    super(config, mdb, requester);
    this.t = config.t;
    this.messages = config.messages;
  }

  public getFormValidation(getInput: (key: string) => void | null | BaseInput<any, any>): InputValidatorService {
    return new InputValidatorService(
      {
        ...this.config,
        getInput,
      },
      this.mdb,
      this.requester,
    );
  }

  public getResult(): InputValidationResult {
    const valid = this.isValid();
    return {
      valid,
      title: valid ? 'Success' : 'Warning',
      message: valid ? 'Form validation succeeded' : 'Form validation failed',
      validations: this.errorMessages,
    };
  }

  public getErrors(key: string): string[] {
    return this.errorMessages[key] || [];
  }

  public getApiErrors(key: string): string[] {
    return this.apiErrorMessages[key] || [];
  }

  public getAllApiErrors(): { [key: string]: string[] } {
    return this.apiErrorMessages || {};
  }

  public async validate(key: string, validations: FieldValidation[]): Promise<string[]> {
    this.errorMessages[key] = [];
    this.apiErrorMessages[key] = [];
    if (!this.config.getInput) {
      throw new Error('form validation is not initialized');
    }
    if (typeof key !== 'string' || !key || !(validations instanceof Array)) {
      throw new Error('bad input for form validation function');
    }
    let required = false;
    for (const validation of validations) {
      if (validation.method === 'required') {
        required = true;
        break;
      }
    }
    if ((!this.getInput(key) || this.getInput(key)?.isEmpty()) && !required) {
      return [];
    }
    for (const validation of validations) {
      if (typeof (this as { [key: string]: any })[validation.method] !== 'function') {
        this.errorMessages[key].push(this.t(InputValidatorService.DEFALUT_ERROR_MSG.replace('%s', validation.method)));
        continue;
      }
      const result = await (this as { [key: string]: any })[validation.method](key, validation.args);
      if (!result) {
        continue;
      }
      this.errorMessages[key].push(result);
    }
    return [...this.errorMessages[key]];
  }

  public async validateCollection(collectionInput: CollectionInput): Promise<string[]> {
    if (!this.config.getInput) {
      throw new Error('form validation is not initialized');
    }
    if (!(collectionInput instanceof CollectionInput)) {
      throw new Error('bad input for form collection validation function');
    }
    const errors: string[] = [];
    if (collectionInput.value.fields.length < collectionInput.value.min) {
      errors.push('Too few items');
    }
    if (collectionInput.value.fields.length > collectionInput.value.max) {
      errors.push('Too many items');
    }
    return errors;
  }

  public async validatePayload(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
    isUpdateCommand: boolean,
  ): Promise<void> {
    // await this.validateCollections(payload, form, tlPrefix);
    await Helper.iterateAsync(Helper.clone(form), tlPrefix, async (item, prefix, transformer, prop) => {
      prefix = prefix ? `${prefix}.` : '';
      const key = prefix + prop;
      let nextKey: string;

      const inputPayload = _.get(payload, key);
      if (isUpdateCommand && inputPayload && inputPayload.type === 'undefined') {
        return inputPayload;
      }

      if (!(item instanceof Array)) {
        const collectionPayload = inputPayload;
        const collectionValidations = item.fields;
        switch (true) {
          // multi collection
          case collectionPayload.fields instanceof Array && collectionPayload.type === 'collection':
            await collectionPayload.fields.map(async (field: any, index: number) => {
              nextKey = `${key}.fields.${index.toString()}`;
              await this.validatePayload(payload, collectionValidations, nextKey, isUpdateCommand);
            });
            return item;
          // single collection
          case typeof collectionPayload.fields === 'object' &&
            !(collectionPayload.fields instanceof Array) &&
            collectionPayload.type === 'singleCollection':
            nextKey = `${key}.fields`;
            await this.validatePayload(payload, collectionValidations, nextKey, isUpdateCommand);
            return item;
          default:
            throw new Error('something went wrong trying to validate the form');
        }
      }

      (!isUpdateCommand || typeof inputPayload.wasTouched !== 'function' || inputPayload.wasTouched()) &&
        (await this.validate(key, item));
      if (inputPayload instanceof OmniBaseField) {
        !isUpdateCommand && inputPayload.setTouched(true);
      }

      return item;
    });
  }

  public async validateCollections(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
  ): Promise<void> {
    await Helper.iterateAsync(Helper.clone(form), tlPrefix, async (item, prefix, transformer, prop) => {
      prefix = prefix ? `${prefix}.` : '';
      const key = prefix + prop;
      let nextKey: string;

      const inputPayload = _.get(payload, key);

      if (!(item instanceof Array)) {
        const collectionPayload = inputPayload;
        const collectionValidations = item.fields;

        if (collectionPayload.fields instanceof Array && collectionPayload.type === 'collection') {
          this.errorMessages[`${key}.size`] = await this.validateCollection(
            CollectionInput.deserialize(collectionPayload),
          );
          await collectionPayload.fields.map(async (field: any, index: number) => {
            nextKey = `${key}.fields.${index.toString()}`;
            await this.validateCollections(payload, collectionValidations, nextKey);
          });
          return item;
        }

        if (
          typeof collectionPayload.fields === 'object' &&
          !(collectionPayload.fields instanceof Array) &&
          collectionPayload.type === 'singleCollection'
        ) {
          nextKey = `${key}.fields`;
          await this.validateCollections(payload, collectionValidations, nextKey);
          return item;
        }
      }

      return item;
    });
  }

  public setErrorResult(errorResult: ErrorResult): void {
    this.apiErrorMessages = errorResult.validations || {};
    this.errorTitle = errorResult.title;
    this.errorMsg = errorResult.msg;
    this.apiErrorXdata = errorResult.xdata;
  }

  protected getInput(key: string): null | BaseInput<any, any> {
    if (!this.config.getInput) {
      throw new Error('form validation is not initialized');
    }
    const input = this.config.getInput(key);
    return input || null;
  }

  protected async required(key: string): Promise<void | string> {
    const input = this.getInput(key);
    if (!input?.isEmpty()) {
      return;
    }
    return this.t(
      this.messages.required.isRequired || InputValidatorService.DEFALUT_ERROR_MSG.replace('%s', 'required'),
    );
  }

  protected async email(key: string): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined') {
      return;
    }
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(input instanceof StringInput) || !input?.value || !re.test(input.value)) {
      return this.t(this.messages.email.format);
    }
  }

  protected async ref(key: string): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined' || input instanceof RefSelectInput) {
      return;
    }
    return this.t(this.messages.ref.isNot);
  }

  protected async min(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined') {
      return;
    }
    if (!(input instanceof StringInput) || typeof args !== 'object' || typeof args.length !== 'number') {
      return this.t(this.messages.generic.invalid);
    }
    if (((input as StringInput)?.value?.length || 0) < args.length) {
      return this.t(this.messages.generic.invalid);
    }
  }

  protected async boolean(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined') {
      return;
    }
    if (!(input instanceof BooleanInput)) {
      return this.t(this.messages.generic.invalid);
    }
    if (typeof (input as BooleanInput).value !== 'boolean') {
      return this.t(this.messages.generic.invalid);
    }
  }

  protected async street(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    //
  }

  protected async title(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    //
  }

  protected async content(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    //
  }

  protected async file(fs: any, key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    const input = this.getInput(key);
    if (!input || input.isEmpty()) {
      return;
    }
    if (!(input instanceof FileInput)) {
      return this.t(this.messages.generic.invalid);
    }

    // client (if file input has file, then execution is on the client side)
    if (input.getValue().file) {
      const file = input.getValue().file as File;
      if (typeof args.maxSize !== 'undefined' && file.size > args.maxSize) {
        // too large
        return this.t(this.messages.generic.invalid);
      }
      return;
    }

    // api (if file input has path, then it is an upload and execution is on the API side)
    if (input.getValue().path) {
      const file = fs.lstatSync(input.getValue().path);
      if (typeof args.maxSize !== 'undefined' && file.size > args.maxSize) {
        // too large
        return this.t(this.messages.generic.invalid);
      }
    }

    // if file input has neither file, nor path, then it's value is unchanged, or is a delete request
    // in which case we do nothing
  }

  protected async multiFile(fs: any, key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    const input = this.getInput(key);
    if (!input || input.isEmpty()) {
      return;
    }
    if (!(input instanceof MultiFileInput)) {
      return this.t(this.messages.generic.invalid);
    }

    for (const _input of input.getValue()) {
      // client (if file input has file, then execution is on the client side)
      if (_input.getValue().file) {
        const file = _input.getValue().file as File;
        if (typeof args.maxSize !== 'undefined' && file.size > args.maxSize) {
          // too large
          return this.t(this.messages.generic.invalid);
        }
        continue;
      }

      // api (if file input has path, then it is an upload and execution is on the API side)
      if (_input.getValue().path) {
        const file = fs.lstatSync(_input.getValue().path);
        if (typeof args.maxSize !== 'undefined' && file.size > args.maxSize) {
          // too large
          return this.t(this.messages.generic.invalid);
        }
      }

      // if file input has neither file, nor path, then it's value is unchanged, or is a delete request
      // in which case we do nothing
    }
  }
}

export { InputValidatorService };
