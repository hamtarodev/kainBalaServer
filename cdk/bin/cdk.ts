#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import CsgoServerSystemStack from './../lib/csgo-server-system/CsgoServerSystemStack';
import StackNamesContants from './../lib/commons/constants/StackNameConstants';

const app = new cdk.App();

new CsgoServerSystemStack(app, StackNamesContants.PARENT_CSGO_SERVER_STACK);