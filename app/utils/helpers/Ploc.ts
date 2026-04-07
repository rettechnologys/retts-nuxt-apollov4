import { commonInitialState } from '@/utils/types/CommonState';
import type { Store } from 'pinia';
import { secureStorage } from './SecureLS_refactor';

export type Subscription<S> = (state: S) => void;

export abstract class Ploc<S> {
  private internalStore: Store;
  private internalStoreId: string;
  private isSingletonPloc = false;

  constructor(store: Store, isSingleton?: boolean) {
    this.internalStore = store as any;
    this.internalStoreId = store.$id;
    if (isSingleton) {
      this.isSingletonPloc = isSingleton;
    }

    console.log(
      `Ploc:initialState1:${store.$id}-${this.isSingletonPloc}`,
      this.state,
    );

    this._init();
  }

  private _init() {
    if (!this.isSingletonPloc && this.internalStore) {
      const internalStoreTmp: any = { ...this.internalStore };
      console.log(
        `Ploc:initialState2:${this.storeId}-${this.isSingletonPloc}`,
        internalStoreTmp.states['status'],
        //this.state.status
      );

      if (internalStoreTmp.states['status'] === 'Initial') {
        this.emitState(commonInitialState as unknown as S);
      }
      // console.log(
      //   `Ploc:initialState2:${this.storeId}-${this.isSingletonPloc}`,
      //   this.state
      // );
    }
  }

  private _clearStateStorage() {
    const stateId = this.storeId.replace(/Store/g, 'State');
    sessionStorage.removeItem(stateId);
    localStorage.removeItem(stateId);
    secureStorage.removeItem(stateId);
  }

  public get state(): S {
    console.log('Ploc:getState', this.internalStore.states as S);
    return this.internalStore.states as S;
  }

  public get storeId(): string {
    return this.internalStoreId;
  }

  public dispose() {
    if (!this.isSingletonPloc && this.internalStore) {
      //this.internalStore.$reset();

      //* clear the state from any storage
      this._clearStateStorage();

      this.internalStore.$dispose();
      console.log(`Ploc:dispose:${this.storeId}`);
    }
  }

  public subscribeToState(callback: Subscription<S>) {
    //console.log('SubscribeToStateNew', callback);
    this.internalStore.$subscribe((_mutation, state) => {
      const newState = JSON.parse(JSON.stringify(state));
      console.log('Ploc:subscribeToState1', _mutation);
      console.log('Ploc:subscribeToState2', JSON.parse(JSON.stringify(state)));

      callback(newState.states as S);
    });
  }

  //* will deprecated change name to emitState
  // protected setState(state: S) {
  //   const cState = JSON.stringify(this.state);
  //   const cStateParse = JSON.parse(cState);
  //   const nState = JSON.stringify(state);
  //   const nStatusParse = JSON.parse(nState);

  //   if (cState !== nState) {
  //     console.log(
  //       `Ploc:setState:${this.storeId}`,
  //       `${cStateParse.status} -> ${nStatusParse.status}`
  //     );
  //     this.internalStore.states = state as Store;
  //   }
  // }

  protected emitState(state: S) {
    console.log(`Ploc:emitState:${this.storeId}`, state);
    const cState = JSON.stringify(this.state);
    const cStateParse = JSON.parse(cState);
    const nState = JSON.stringify(state);
    const nStatusParse = JSON.parse(nState);

    if (cState !== nState) {
      console.log(
        `Ploc:emitState:${this.storeId}`,
        `${cStateParse.name}:${cStateParse.status} -> ${nStatusParse.name}:${nStatusParse.status}`,
      );
      this.internalStore.states = state as Store;
    }
  }
}
