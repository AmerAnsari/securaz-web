import { Injectable, Injector } from '@angular/core';
import { Crud } from '@amirsavand/ngx-common';
import { Credential } from '@interfaces/credential';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  readonly credential: Crud<Credential> = new Crud<Credential>({
    injector: this.injector,
    name: 'credential',
  });

  constructor(private injector: Injector) {
  }
}
