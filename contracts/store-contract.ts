import { Lang, State, AppInfoInterface } from '@sotaoi/omni/state';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { StoreCreator, Store as ReduxStore } from '@sotaoi/omni/definitions/redux';
import { InputValidator } from '@sotaoi/omni/contracts/input-validator-contract';
import { LocalMemory } from '@sotaoi/omni/contracts/local-memory-contract';

type StoreType = { getState: () => { [key: string]: any }; dispatch: any; subscribe: any } | ReduxStore;

abstract class StoreContract {
  protected appInfo: AppInfoInterface;
  protected apiUrl: string;
  protected createStore: StoreCreator;
  protected inputValidator: InputValidator;
  protected localMemory: LocalMemory;

  protected store: StoreType;
  protected initialState: State;

  constructor(
    appInfo: AppInfoInterface,
    apiUrl: string,
    createStore: StoreCreator,
    inputValidator: InputValidator,
    localMemory: LocalMemory,
  ) {
    this.appInfo = appInfo;
    this.apiUrl = apiUrl;
    this.createStore = createStore;
    this.inputValidator = inputValidator;
    this.localMemory = localMemory;
    this.store = {
      getState: () => (): { [key: string]: any } => ({}),
      dispatch: () => (): void => undefined,
      subscribe: () => (): void => undefined,
    };
    this.initialState = {
      'app.meta.title': '',
      'app.credentials.authRecord': null,
      'app.coreState.maintenance': false,
      'app.lang.selected': { code: 'en', name: 'English' },
      'app.lang.default': { code: 'en', name: 'English' },
      'app.lang.available': [{ code: 'en', name: 'English' }],
      'app.lang.translations': {},
    };
  }

  abstract init(): Promise<void>;
  abstract setAuthRecord(authRecord: null | AuthRecord, accessToken: null | string): Promise<void>;
  abstract setCurrentPath(currentPath: string): Promise<void>;
  abstract getCurrentPath(): string;
  abstract getAuthRecord(): null | AuthRecord;
  abstract getAccessToken(): null | string;
  abstract hasMultiLang(): boolean;
  abstract setTitle(title: string): void;
  abstract setSelectedLang(lang: Lang): void;
  abstract setDefaultLang(lang: Lang): void;
  abstract getSelectedLang(): Lang;
  abstract getDefaultLang(): Lang;
  abstract getAvailableLangs(): Lang[];
  abstract getTranslations(): { [key: string]: { [key: string]: string } };
  abstract subscribe(callback: () => void): () => void;
  abstract getState(): State;
  abstract getAppInfo(): AppInfoInterface;
  abstract getApiUrl(): string;
  abstract driverDomainSignature(): string;
  abstract mdriverDomainSignature(): string;
  abstract sdriverDomainSignature(): string;
}

export { StoreContract };
