"use strict";
import { setDefaultTimeout } from '@cucumber/cucumber';

export function configure() {
  setDefaultTimeout(60 * 1000);
}
