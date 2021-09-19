import type { OmniBaseField } from '@sotaoi/omni/omni-base-field';
import { BaseInput } from '@sotaoi/omni/input/base-input';

class StringInput extends BaseInput<null | string, null | string> {
  constructor(value: null | string) {
    super(value);
  }

  public input(field: typeof OmniBaseField): { input: StringInput; field: typeof OmniBaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): null | string {
    return this.value || null;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(forStorage: boolean): null | string {
    if (forStorage) {
      return this.value || null;
    }
    return this.value ? JSON.stringify({ si: this.value }) : null;
  }

  public convert(value: StringInput | null | string): StringInput {
    if (value instanceof StringInput) {
      return value;
    }
    return new StringInput(typeof value === 'string' && value ? value : null);
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.si !== 'undefined';
  }
  public deserialize(value: string): StringInput {
    if (!value) {
      return new StringInput(null);
    }
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || typeof parsed.si !== 'string') {
      throw new Error('bad string input');
    }
    return new StringInput(parsed.si);
  }
}

export { StringInput };
