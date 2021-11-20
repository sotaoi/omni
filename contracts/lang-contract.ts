import { StoreContract } from '@sotaoi/omni/contracts/store-contract';

abstract class Lang {
  abstract init(store: () => StoreContract): Promise<void>;
  abstract isMultilang(): boolean;
  abstract useTranslation<UseTranslationResponse>(): UseTranslationResponse;
}

export { Lang };
