import type { OmniBaseField } from '@sotaoi/omni/input/omni-base-field';
import { BaseInput } from '@sotaoi/omni/input/base-input';

interface CollectionInputType {
  min: number;
  max: number;
  fields: any[];
}
class CollectionInput extends BaseInput<CollectionInputType, null> {
  constructor(value: CollectionInputType) {
    super(value);
  }

  public input(field: typeof OmniBaseField): { input: CollectionInput; field: typeof OmniBaseField } {
    throw new Error('collection input cannot call "input" method');
  }
  public getValue(): CollectionInputType {
    throw new Error('collection input cannot call "getValue" method');
  }
  public isEmpty(): boolean {
    throw new Error('collection input cannot call "isEmpty" method');
  }
  public serialize(forStorage: boolean): null | string {
    throw new Error('collection input cannot be serialized');
  }
  public convert(value: CollectionInputType | null): CollectionInput {
    throw new Error('collection input cannot call "convert" method');
  }
  public deserializeCondition(fieldPayload: string, payloadJson: { [key: string]: any }): boolean {
    throw new Error('collection input cannot call "deserializeCondition" method');
  }
  public deserialize(value: CollectionInputType): CollectionInput {
    return CollectionInput.deserialize(value);
  }
  public static deserialize(value: CollectionInputType): CollectionInput {
    return new CollectionInput(value);
  }
}

export { CollectionInput };
