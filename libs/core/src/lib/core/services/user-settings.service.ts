import { Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Authentication } from '../models/authentication.model';
import { PersistentStore } from './presistent-store.service';

export interface UserSettings {
  fullName: string | undefined;
  username: string | undefined;
  token: string | undefined;
  isAdmin: boolean;
  roles: string[];
}

const defaultState: UserSettings = {
  fullName: undefined,
  username: undefined,
  token: undefined,
  isAdmin: false,
  roles: [],
};

@Injectable()
export class UserSettingsService extends PersistentStore<UserSettings> {
  constructor() {
    super(new BehaviorSubject<UserSettings>(defaultState));
    this.load();
  }

  clear(): void {
    localStorage.clear();
    this.load();
  }

  save(field: string, value: any): void {
    if (field !== 'token') {
      return;
    }
    if (isNil(value)) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', value.toString());
    }
  }

  private load(): void {
    const token = localStorage.getItem('token');
    this.setMany(token ? Authentication.createFromToken(token) : defaultState);
  }
}
