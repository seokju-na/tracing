"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  initTracing: () => initTracing,
  tracer: () => tracer
});
module.exports = __toCommonJS(src_exports);

// src/level.ts
var LEVELS = ["debug", "info", "warn", "error"];
function diffLevel(target, current) {
  const targetLevel = LEVELS.findIndex((x) => x === target);
  const currentLevel = LEVELS.findIndex((x) => x === current);
  return currentLevel - targetLevel;
}
__name(diffLevel, "diffLevel");
function parseLevel(levelStr) {
  return LEVELS.find((x) => x === levelStr.toLowerCase());
}
__name(parseLevel, "parseLevel");

// src/tracing.ts
var import_colors = require("kleur/colors");

// src/scope.ts
function parseScopes(scopeStr) {
  const scope = [];
  const values = scopeStr.split(",");
  for (const value of values) {
    if (value.includes("=")) {
      const [namespace, l] = value.split("=");
      const level = parseLevel(l ?? "");
      if (namespace !== void 0 && level !== void 0) {
        scope.push({
          pattern: namespace.replaceAll("*", ".+"),
          level
        });
      }
    } else {
      const level = parseLevel(value.trim());
      if (level !== void 0) {
        scope.push({ pattern: ".+", level });
      }
    }
  }
  return scope;
}
__name(parseScopes, "parseScopes");
function findScopeLevel(scopes, namespace) {
  const scope = scopes.findLast((x) => new RegExp(x.pattern).test(namespace));
  return scope?.level;
}
__name(findScopeLevel, "findScopeLevel");

// src/node.ts
function getProcessEnv(name) {
  if (typeof process !== "undefined") {
    const env = process.env[name];
    return env;
  }
  return void 0;
}
__name(getProcessEnv, "getProcessEnv");

// src/tracing.ts
var colors = {
  error: import_colors.red,
  warn: import_colors.yellow,
  info: import_colors.green,
  debug: import_colors.grey
};
function initTracing(scopeStr) {
  const scopes = parseScopes(scopeStr);
  console.__TRACING__ = scopes;
  return scopes;
}
__name(initTracing, "initTracing");
var Tracer = class {
  constructor(namespace) {
    this.namespace = namespace;
  }
  error(...args) {
    this.log("error", ...args);
  }
  warn(...args) {
    this.log("warn", ...args);
  }
  info(...args) {
    this.log("info", ...args);
  }
  debug(...args) {
    this.log("debug", ...args);
  }
  log(level, ...args) {
    const scopes = this.getScopes();
    const targetLevel = findScopeLevel(scopes, this.namespace ?? "anything") ?? "debug";
    if (diffLevel(targetLevel, level) >= 0) {
      const prefix = colors[level](`[${this.namespace}:${level}]`);
      console.log(prefix, ...args);
    }
  }
  getScopes() {
    const scopes = console.__TRACING__;
    if (scopes !== void 0) {
      return scopes;
    }
    return initTracing(getProcessEnv("TRACING") ?? "debug");
  }
};
__name(Tracer, "Tracer");
function tracer(namespace) {
  return new Tracer(namespace);
}
__name(tracer, "tracer");
/*! For license information please see index.js.LEGAL.txt */
//# sourceMappingURL=index.js.map
