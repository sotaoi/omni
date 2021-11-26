import type { OmniBaseField } from '@sotaoi/omni/input/omni-base-field';
import { RecordRef } from '@sotaoi/omni/artifacts';
import { BaseInput } from '@sotaoi/omni/input/base-input';

type RefSelectValue = null | RecordRef;
class RefSelectInput extends BaseInput<RefSelectValue, string> {
  public value: RefSelectValue;
  constructor(value: RefSelectValue) {
    super(value);
    this.value = value;
  }

  public input(field: typeof OmniBaseField): { input: RefSelectInput; field: typeof OmniBaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): RefSelectValue {
    return this.value;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(): null | string {
    return this.value?.serialize() || null;
  }

  public convert(value: RefSelectInput | string): RefSelectInput {
    if (!value) {
      return new RefSelectInput(null);
    }
    if (value instanceof RecordRef) {
      return new RefSelectInput(value);
    }
    if (typeof value !== 'string') {
      throw new Error('failed to parse ref select input');
    }
    return new RefSelectInput(RecordRef.deserialize(value));
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return (
      typeof payloadJson.repository === 'string' &&
      typeof payloadJson.uuid === 'string' &&
      Object.keys(payloadJson).length === 2
    );
  }
  public deserialize(value: string): RefSelectInput {
    if (typeof value !== 'string') {
      throw new Error('failed to parse ref select input');
    }
    return new RefSelectInput(RecordRef.deserialize(value));
  }
}

export { RefSelectInput };
export type { RefSelectValue };
