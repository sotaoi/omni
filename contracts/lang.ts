import { Store } from '@sotaoi/omni/contracts/store';

abstract class Lang {
  abstract init(store: () => Store): Promise<void>;
  abstract isMultilang(): boolean;
  abstract useTranslation<UseTranslationResponse>(): UseTranslationResponse;
}

export { Lang };
