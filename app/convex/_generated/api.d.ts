/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as entities_calls from "../entities/calls.js";
import type * as entities_reports from "../entities/reports.js";
import type * as entities_summaries from "../entities/summaries.js";
import type * as entities_transcriptions from "../entities/transcriptions.js";
import type * as http from "../http.js";
import type * as reportsHttpAction from "../reportsHttpAction.js";
import type * as types from "../types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "entities/calls": typeof entities_calls;
  "entities/reports": typeof entities_reports;
  "entities/summaries": typeof entities_summaries;
  "entities/transcriptions": typeof entities_transcriptions;
  http: typeof http;
  reportsHttpAction: typeof reportsHttpAction;
  types: typeof types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
