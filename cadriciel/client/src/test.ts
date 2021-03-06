// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import 'zone.js/dist/zone-testing';

// tslint:disable-next-line:no-any from cli
declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
// Then we find all the tests.
const myContext = require.context('./', true, /\.spec\.ts$/);
// const myContext = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
myContext.keys().map(myContext);
