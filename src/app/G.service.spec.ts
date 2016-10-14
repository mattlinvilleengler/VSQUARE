/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { G } from './G.service';

describe('G Service', () => {
  beforeEachProviders(() => [G]);

  it('should ...',
      inject([G], (service: G) => {
    expect(service).toBeTruthy();
  }));
});
