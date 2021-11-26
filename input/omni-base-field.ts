import React from 'react';
import { BaseInput } from '@sotaoi/omni/input/base-input';
// import type { CollectionField as CollectionFieldType } from '@sotaoi/client/forms/fields/collection-field';

interface FieldConstructor {
  type: typeof OmniBaseField;
  value: any;
  validations: any;
}

interface FieldInit {
  [key: string]: any;
  value: any;
  onChange: (ev: any) => void;
  onBlur: (ev: any) => void;
  onKeyUp?: (ev: any) => void;
}

// abstract class BaseComponent<ValueType, ComponentProps, ComponentState> extends React.Component<
//   ComponentProps,
//   ComponentState
// > {
//   abstract setValue(input: ValueType): void;
//   abstract getValue(): any;
// }

abstract class OmniBaseField<ValueType, ComponentProps = any, ComponentState = any> {
  abstract init(): FieldInit;
  abstract set(value: ValueType): void;
  abstract clear(): void;
  abstract isEmpty(): boolean;
  abstract convert(value: any): ValueType;
  abstract getInputValue(input?: ValueType): any;
  abstract wasChanged(): boolean;
  //
  abstract initialState(props: ComponentProps): ComponentState;
  abstract setValue(input: ValueType, context: React.Component<ComponentProps, ComponentState>): void;
  abstract getValue(context: React.Component<ComponentProps, ComponentState>): any;
  abstract render(context: React.Component<ComponentProps, ComponentState>): null | React.ReactElement;

  abstract asset(item: null | string, role: string): null | string;
  abstract assets(items: null | string, role: string): null | string[];

  abstract getKey(index: number): string;

  abstract validate(): Promise<void>;

  abstract isValid(): boolean;

  abstract getErrors(): string[];

  abstract setTouched(touched: boolean): void;

  abstract wasTouched(): boolean;

  abstract collection(): any;

  abstract addGroup(): void;

  abstract canRemoveGroup(index: number): boolean;

  abstract removeGroup(index: number): void;

  public static input(value: any): { input: BaseInput<any, any>; field: typeof OmniBaseField } {
    throw new Error('Base Field must implement static "input" method');
  }
}

export { OmniBaseField };
export type { FieldInit, FieldConstructor };
