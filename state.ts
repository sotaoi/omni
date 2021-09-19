import type { AppInfo } from '@sotaoi/config/app-info';
import React from 'react';
import { AuthRecord } from '@sotaoi/omni/artifacts';

class State {
  public 'app.meta.title': string;
  public 'app.credentials.authRecord': null | AuthRecord;
  public 'app.coreState.maintenance': boolean;
  public 'app.lang.selected': Lang;
  public 'app.lang.default': Lang;
  public 'app.lang.available': Lang[];
  public 'app.lang.translations': { [key: string]: { [key: string]: string } };
}

class Lang {
  public name: string;
  public code: string;

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}

class Seed {
  public 'app.meta.title': string;
  public 'app.credentials.accessToken': null | string;
  public 'app.credentials.authRecord': null | AuthRecord;
  public 'app.coreState.maintenance': boolean;
  public 'app.lang.selected': Lang;
  public 'app.lang.default': Lang;
  public 'app.lang.available': Lang[];
  public 'app.lang.translations': { [key: string]: { [key: string]: string } };
}

interface AppPocketInterface {
  bundleState: {
    bundleUid: string;
    isMasterBundle: boolean;
  };
  coreState: {
    appMaintenance: boolean;
  };
}
class AppPocket implements AppPocketInterface {
  public bundleState: {
    bundleUid: string;
    isMasterBundle: boolean;
  };
  public coreState: {
    appMaintenance: boolean;
  };

  constructor(appPocket: undefined | null | { [key: string]: any }, appInfo: AppInfo) {
    appPocket = JSON.parse(JSON.stringify(appPocket || {}));
    const defaultAppPocket = AppPocket.getDefaultAppPocket(appInfo);
    this.bundleState = {
      bundleUid:
        typeof appPocket?.bundleState?.bundleUid === 'string'
          ? appPocket.bundleState.bundleUid
          : defaultAppPocket.bundleState.bundleUid,
      isMasterBundle:
        typeof appPocket?.bundleState?.isMasterBundle === 'boolean'
          ? appPocket.bundleState.isMasterBundle
          : defaultAppPocket.bundleState.isMasterBundle,
    };
    this.coreState = {
      appMaintenance:
        typeof appPocket?.coreState?.appMaintenance === 'boolean'
          ? appPocket.coreState.appMaintenance
          : defaultAppPocket.coreState.appMaintenance,
    };
  }

  public toObject(): AppPocketInterface {
    return {
      bundleState: this.bundleState,
      coreState: this.coreState,
    };
  }

  public static getDefaultAppPocket(appInfo: AppInfo): AppPocketInterface {
    return {
      bundleState: {
        bundleUid: appInfo.bundleUid,
        isMasterBundle: appInfo.isMasterBundle === 'yes',
      },
      coreState: {
        appMaintenance: false,
      },
    };
  }
}

type RenderComponent = { prototype: object } | React.FunctionComponent<any> | React.ComponentClass<any, any>;

interface RoutesConfig {
  prefix: string;
  layout: string | React.FunctionComponent<LayoutProps>;
  routes: {
    [key: string]: RenderComponent;
  };
  condition: () => boolean;
}

interface RouterConfig {
  [key: string]: RoutesConfig;
}

interface LayoutProps {
  children: any;
}

export { AppPocket, State, Lang, Seed };
export type { AppInfo, AppPocketInterface, RouterConfig, RoutesConfig, LayoutProps, RenderComponent };
