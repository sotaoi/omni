import type { OmniBaseField } from '@sotaoi/omni/omni-base-field';
import { BaseInput } from '@sotaoi/omni/input/base-input';

class FormInput extends BaseInput<any, any> {
  constructor(value: any) {
    super(value);
  }

  public input(field: typeof OmniBaseField): { input: FormInput; field: typeof OmniBaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): any {
    return this.value || null;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(forStorage: boolean): any {
    if (forStorage) {
      return this.value || null;
    }
    return this.value ? JSON.stringify({ si: this.value }) : null;
  }

  public convert(value: FormInput | any): FormInput {
    if (value instanceof FormInput) {
      return value;
    }
    return new FormInput(typeof value === 'string' && value ? value : null);
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.si !== 'undefined';
  }
  public deserialize(value: string): FormInput {
    if (!value) {
      return new FormInput(null);
    }
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || typeof parsed.si !== 'string') {
      throw new Error('bad string input');
    }
    return new FormInput(parsed.si);
  }
}

export { FormInput };
