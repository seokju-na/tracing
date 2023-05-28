var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
import { green, grey, red, yellow } from "kleur/colors";

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
  error: red,
  warn: yellow,
  info: green,
  debug: grey
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
export {
  initTracing,
  tracer
};
/*! For license information please see index.mjs.LEGAL.txt */
//# sourceMappingURL=index.mjs.map
