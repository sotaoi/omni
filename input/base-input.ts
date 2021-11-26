import type { OmniBaseField } from '@sotaoi/omni/input/omni-base-field';

abstract class BaseInput<InputType, FieldValueType> {
  abstract input(field: typeof OmniBaseField): {
    input: BaseInput<InputType, FieldValueType>;
    field: typeof OmniBaseField;
  };
  abstract getValue(): InputType;
  abstract isEmpty(): boolean;
  abstract serialize(forStorage: boolean): null | string | Blob | (string | Blob)[];
  abstract convert(
    value: BaseInput<InputType, FieldValueType> | InputType | FieldValueType
  ): BaseInput<InputType, FieldValueType>;
  abstract deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean;
  abstract deserialize(value: any): BaseInput<InputType, FieldValueType>;

  public value: InputType;

  constructor(value: InputType) {
    this.value = value;
  }

  public asset(item: null | string, role = 'assets'): null | string {
    const { Helper } = require('@sotaoi/omni/helper');
    return Helper.asset(item, role);
  }
  public assets(items: null | string, role = 'assets'): null | string[] {
    const { Helper } = require('@sotaoi/omni/helper');
    return (items && JSON.parse(items).map((item: string) => Helper.asset(item, role))) || null;
  }

  public getKey(index: number): string {
    return `${index.toString()}`;
  }

  public static deserialize(value: any): BaseInput<any, any> {
    throw new Error('deserialization not implemented');
  }
}

interface FieldValidation {
  method: string;
  args?: { [key: string]: any };
}
interface CollectionValidations {
  min: number;
  max: number;
  fields: { [key: string]: FieldValidation[] | CollectionValidations | SingleCollectionValidations };
}
interface SingleCollectionValidations {
  fields: { [key: string]: FieldValidation[] | CollectionValidations | SingleCollectionValidations };
}
class FormValidations {
  [key: string]: FieldValidation[] | CollectionValidations | SingleCollectionValidations;

  constructor(formValidations: {
    [key: string]: FieldValidation[] | CollectionValidations | SingleCollectionValidations;
  }) {
    Object.entries(formValidations).map(([name, validation]) => {
      this[name] = validation;
    });
  }
}

export { BaseInput, FormValidations };
export type { FieldValidation, CollectionValidations, SingleCollectionValidations };
