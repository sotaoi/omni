import { RoutesConfig } from '@sotaoi/omni/state';

abstract class ControlPanel {
  abstract getRoutesConfigGate(prefix: string): RoutesConfig;
  abstract getRoutesConfigMain(prefix: string): RoutesConfig;
}

export { ControlPanel };
