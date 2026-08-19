var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// durable-objects/SnakeLadderRoom.ts
var SnakeLadderRoom = class {
  static {
    __name(this, "SnakeLadderRoom");
  }
  state;
  env;
  room = null;
  sessions = /* @__PURE__ */ new Map();
  turnLocked = false;
  processedActions = /* @__PURE__ */ new Set();
  chatRateLimit = /* @__PURE__ */ new Map();
  constructor(state, env2) {
    this.state = state;
    this.env = env2;
    this.state.blockConcurrencyWhile(async () => {
      const storedRoom = await this.state.storage.get("roomState");
      if (storedRoom) {
        this.room = storedRoom;
      }
    });
  }
  // Handle HTTP & WebSocket upgrade requests from Worker
  async fetch(request) {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      await this.handleWebSocketSession(server, url);
      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }
    if (url.pathname === "/init" && request.method === "POST") {
      const initData = await request.json();
      this.room = initData.room;
      await this.saveRoomState();
      return new Response(JSON.stringify({ success: true, room: this.room }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (url.pathname === "/state" && request.method === "GET") {
      return new Response(JSON.stringify({ room: this.room }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Not Found", { status: 404 });
  }
  /**
   * Handle incoming WebSocket connections
   */
  async handleWebSocketSession(ws, url) {
    ws.accept();
    const guestId = url.searchParams.get("guestId") || "";
    const nickname = url.searchParams.get("nickname") || "Guest";
    const session = {
      guestId,
      nickname,
      lastPing: Date.now()
    };
    this.sessions.set(ws, session);
    if (this.room && guestId) {
      const existingPlayer = this.room.players.find((p) => p.id === guestId);
      if (existingPlayer) {
        existingPlayer.isConnected = true;
        existingPlayer.lastSeenAt = Date.now();
        await this.saveRoomState();
      }
      this.sendTo(ws, {
        type: "ROOM_STATE",
        room: this.room,
        timestamp: Date.now()
      });
    }
    ws.addEventListener("message", async (event) => {
      try {
        const raw = typeof event.data === "string" ? event.data : new TextDecoder().decode(event.data);
        const message = JSON.parse(raw);
        await this.handleClientMessage(ws, session, message);
      } catch (err) {
        this.sendError(ws, "INTERNAL_ERROR", err.message || "Invalid message payload");
      }
    });
    ws.addEventListener("close", () => {
      this.handleDisconnect(ws, session);
    });
    ws.addEventListener("error", () => {
      this.handleDisconnect(ws, session);
    });
  }
  /**
   * Handle client WebSocket action messages
   */
  async handleClientMessage(ws, session, msg) {
    if (!this.room) {
      this.sendError(ws, "ROOM_NOT_FOUND", "Game room is not initialized");
      return;
    }
    if (msg.actionId) {
      if (this.processedActions.has(msg.actionId)) {
        if (this.room) {
          this.sendTo(ws, { type: "ROOM_STATE", room: this.room, timestamp: Date.now() });
        }
        return;
      }
      this.processedActions.add(msg.actionId);
    }
    switch (msg.type) {
      case "PING": {
        session.lastPing = Date.now();
        this.sendTo(ws, { type: "PONG", timestamp: Date.now() });
        break;
      }
      case "JOIN_ROOM": {
        await this.processJoinRoom(ws, session, msg.nickname);
        break;
      }
      case "READY": {
        const player = this.room.players.find((p) => p.id === session.guestId);
        if (player) {
          player.isReady = msg.isReady;
          await this.saveRoomState();
          this.broadcast({
            type: "PLAYER_READY",
            guestId: player.id,
            isReady: player.isReady,
            timestamp: Date.now()
          });
        }
        break;
      }
      case "START_GAME": {
        if (this.room.hostGuestId !== session.guestId) {
          this.sendError(ws, "INVALID_ACTION", "Only the room host can start the game");
          return;
        }
        if (this.room.players.length < 2) {
          this.sendError(ws, "INVALID_ACTION", "At least 2 players are required to start");
          return;
        }
        this.room.status = "playing";
        this.room.startedAt = Date.now();
        this.room.currentTurnGuestId = this.room.players[0].id;
        this.room.turnNumber = 1;
        await this.saveRoomState();
        await this.persistGameStarted();
        this.broadcast({
          type: "GAME_STARTED",
          room: this.room,
          timestamp: Date.now()
        });
        break;
      }
      case "ADD_BOT": {
        if (this.room.hostGuestId !== session.guestId) {
          this.sendError(ws, "INVALID_ACTION", "Only the host can add bots");
          return;
        }
        if (this.room.players.length >= this.room.maxPlayers) {
          this.sendError(ws, "ROOM_FULL", "Room has reached maximum capacity");
          return;
        }
        const colors = ["blue", "green", "yellow"];
        const botIdx = this.room.players.length;
        const botPlayer = {
          id: `bot_${Date.now()}_${botIdx}`,
          nickname: `Bot ${botIdx} [AI]`,
          playerNumber: botIdx + 1,
          color: colors[botIdx - 1] || "yellow",
          position: 0,
          isConnected: true,
          isBot: true,
          botDifficulty: msg.difficulty || "medium",
          isReady: true,
          joinedAt: Date.now(),
          lastSeenAt: Date.now()
        };
        this.room.players.push(botPlayer);
        await this.saveRoomState();
        this.broadcast({
          type: "PLAYER_JOINED",
          player: botPlayer,
          room: this.room,
          timestamp: Date.now()
        });
        break;
      }
      case "ROLL_DICE": {
        await this.processRollDice(ws, session.guestId);
        break;
      }
      case "CHAT_MESSAGE": {
        await this.processChatMessage(ws, session, msg.message);
        break;
      }
      case "REMATCH": {
        if (this.room.status !== "finished") return;
        this.room.status = "playing";
        this.room.winnerGuestId = void 0;
        this.room.turnNumber = 1;
        this.room.consecutiveSixes = 0;
        this.room.players.forEach((p) => p.position = 0);
        this.room.currentTurnGuestId = this.room.players[0].id;
        await this.saveRoomState();
        this.broadcast({
          type: "REMATCH_ACCEPTED",
          room: this.room,
          timestamp: Date.now()
        });
        break;
      }
      case "LEAVE_ROOM": {
        this.handleDisconnect(ws, session);
        break;
      }
    }
  }
  /**
   * Process Player Joining Room
   */
  async processJoinRoom(ws, session, nickname) {
    if (!this.room) return;
    if (this.room.status !== "waiting") {
      const isExisting = this.room.players.some((p) => p.id === session.guestId);
      if (!isExisting) {
        this.sendError(ws, "GAME_ALREADY_STARTED", "Game is already in progress");
        return;
      }
    }
    let player = this.room.players.find((p) => p.id === session.guestId);
    if (player) {
      player.nickname = nickname || player.nickname;
      player.isConnected = true;
      player.lastSeenAt = Date.now();
    } else {
      if (this.room.players.length >= this.room.maxPlayers) {
        this.sendError(ws, "ROOM_FULL", "This room is already full");
        return;
      }
      const colors = ["red", "blue", "green", "yellow"];
      const playerNum = this.room.players.length + 1;
      player = {
        id: session.guestId,
        nickname: nickname || `Player ${playerNum}`,
        playerNumber: playerNum,
        color: colors[playerNum - 1],
        position: 0,
        isConnected: true,
        isBot: false,
        isReady: true,
        joinedAt: Date.now(),
        lastSeenAt: Date.now()
      };
      this.room.players.push(player);
    }
    await this.saveRoomState();
    await this.persistPlayerJoined(player);
    this.broadcast({
      type: "PLAYER_JOINED",
      player,
      room: this.room,
      timestamp: Date.now()
    });
  }
  /**
   * Server-Authoritative Dice Roll Execution with Anti-Cheat
   */
  async processRollDice(ws, targetGuestId) {
    if (!this.room || this.room.status !== "playing" || this.turnLocked) {
      if (ws) this.sendError(ws, "INVALID_ACTION", "Cannot roll dice right now");
      return;
    }
    const currentTurnId = targetGuestId || this.room.currentTurnGuestId;
    if (currentTurnId !== this.room.currentTurnGuestId) {
      if (ws) this.sendError(ws, "NOT_YOUR_TURN", "It is not your turn to roll");
      return;
    }
    const player = this.room.players.find((p) => p.id === currentTurnId);
    if (!player) return;
    this.turnLocked = true;
    const randomArray = new Uint8Array(1);
    crypto.getRandomValues(randomArray);
    const diceValue = randomArray[0] % 6 + 1;
    const moveResult = this.calculateAuthoritativeMove(player, diceValue);
    player.position = moveResult.finalPosition;
    this.room.lastDiceResult = diceValue;
    if (diceValue === 6) {
      this.room.consecutiveSixes = (this.room.consecutiveSixes || 0) + 1;
    } else {
      this.room.consecutiveSixes = 0;
    }
    let nextPlayerId = currentTurnId;
    let isExtraTurn = false;
    if (moveResult.isWinner) {
      this.room.status = "finished";
      this.room.winnerGuestId = player.id;
      this.room.finishedAt = Date.now();
    } else if (diceValue === 6 && this.room.rules.sixGivesExtraTurn && this.room.consecutiveSixes < 3) {
      isExtraTurn = true;
      nextPlayerId = currentTurnId;
    } else {
      const curIdx = this.room.players.findIndex((p) => p.id === currentTurnId);
      const nextIdx = (curIdx + 1) % this.room.players.length;
      nextPlayerId = this.room.players[nextIdx].id;
      this.room.turnNumber = (this.room.turnNumber || 1) + 1;
    }
    this.room.currentTurnGuestId = nextPlayerId;
    this.room.events.unshift({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      type: moveResult.isWinner ? "win" : moveResult.specialMove ? moveResult.specialMove.type : "roll",
      message: moveResult.isWinner ? `\u{1F3C6} ${player.nickname} reached Square 100 and won the game!` : moveResult.specialMove ? `${player.nickname} rolled ${diceValue} and took a ${moveResult.specialMove.type} to ${moveResult.finalPosition}` : `${player.nickname} rolled ${diceValue} and moved to ${moveResult.finalPosition}`,
      guestId: player.id,
      playerColor: player.color
    });
    if (this.room.events.length > 25) {
      this.room.events.pop();
    }
    await this.saveRoomState();
    this.persistGameMove(player.id, diceValue, moveResult);
    const diceMessage = {
      type: "DICE_ROLLED",
      guestId: player.id,
      diceValue,
      moveResult,
      room: this.room,
      timestamp: Date.now()
    };
    this.broadcast(diceMessage);
    if (moveResult.isWinner) {
      await this.persistGameCompleted(player);
      const winMessage = {
        type: "GAME_FINISHED",
        winner: player,
        room: this.room,
        timestamp: Date.now()
      };
      this.broadcast(winMessage);
    } else {
      const nextPlayer = this.room.players.find((p) => p.id === nextPlayerId);
      if (nextPlayer && nextPlayer.isBot) {
        setTimeout(() => {
          this.processRollDice(void 0, nextPlayer.id);
        }, 1200);
      }
    }
    this.turnLocked = false;
  }
  /**
   * Authoritative Move Calculation
   */
  calculateAuthoritativeMove(player, diceValue) {
    const oldPosition = player.position;
    const rules = this.room?.rules || {
      sixGivesExtraTurn: true,
      exact100ToWin: true,
      enterOnSix: false,
      maxConsecutiveSixes: 3
    };
    const ladders = {
      2: 38,
      7: 14,
      8: 31,
      15: 26,
      21: 42,
      28: 84,
      36: 44,
      51: 67,
      71: 91,
      78: 98
    };
    const snakes = {
      16: 6,
      46: 25,
      49: 11,
      62: 19,
      64: 60,
      74: 53,
      89: 68,
      92: 88,
      95: 75,
      99: 80
    };
    let intermediate = oldPosition + diceValue;
    const steps = [];
    if (rules.exact100ToWin && intermediate > 100) {
      intermediate = oldPosition;
      return {
        guestId: player.id,
        diceValue,
        oldPosition,
        intermediatePosition: oldPosition,
        finalPosition: oldPosition,
        isExtraTurn: diceValue === 6 && rules.sixGivesExtraTurn,
        isWinner: false,
        steps: [oldPosition]
      };
    }
    for (let step = oldPosition + 1; step <= intermediate; step++) {
      steps.push(step);
    }
    let finalPos = intermediate;
    let specialMove = void 0;
    if (ladders[intermediate]) {
      finalPos = ladders[intermediate];
      specialMove = { type: "ladder", from: intermediate, to: finalPos };
      steps.push(finalPos);
    } else if (snakes[intermediate]) {
      finalPos = snakes[intermediate];
      specialMove = { type: "snake", from: intermediate, to: finalPos };
      steps.push(finalPos);
    }
    const isWinner = finalPos === 100;
    return {
      guestId: player.id,
      diceValue,
      oldPosition,
      intermediatePosition: intermediate,
      finalPosition: finalPos,
      specialMove,
      isExtraTurn: diceValue === 6 && rules.sixGivesExtraTurn && !isWinner,
      isWinner,
      steps
    };
  }
  /**
   * Process Chat Message with Rate Limiting & Sanitation
   */
  async processChatMessage(ws, session, text) {
    if (!this.room || !text.trim()) return;
    const now = Date.now();
    let limiter = this.chatRateLimit.get(session.guestId);
    if (!limiter || now > limiter.resetAt) {
      limiter = { count: 0, resetAt: now + 60 * 1e3 };
      this.chatRateLimit.set(session.guestId, limiter);
    }
    limiter.count++;
    if (limiter.count > 20) {
      this.sendError(ws, "RATE_LIMITED", "You are sending messages too quickly.");
      return;
    }
    const sanitized = text.slice(0, 200).replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    const chatMsg = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      guestId: session.guestId,
      nickname: session.nickname,
      message: sanitized,
      createdAt: Date.now(),
      isSystem: false
    };
    this.room.chat.push(chatMsg);
    if (this.room.chat.length > 50) {
      this.room.chat.shift();
    }
    await this.saveRoomState();
    this.persistChatMessage(chatMsg);
    this.broadcast({
      type: "CHAT_MESSAGE",
      message: chatMsg,
      timestamp: Date.now()
    });
  }
  /**
   * Handle Client Disconnect
   */
  async handleDisconnect(ws, session) {
    this.sessions.delete(ws);
    if (!this.room) return;
    const player = this.room.players.find((p) => p.id === session.guestId);
    if (player) {
      player.isConnected = false;
      player.lastSeenAt = Date.now();
      await this.saveRoomState();
      this.broadcast({
        type: "PLAYER_LEFT",
        guestId: session.guestId,
        room: this.room,
        timestamp: Date.now()
      });
    }
  }
  /**
   * State Storage Helpers
   */
  async saveRoomState() {
    if (this.room) {
      await this.state.storage.put("roomState", this.room);
    }
  }
  /**
   * WebSocket Broadcast Utility
   */
  broadcast(message) {
    const payload = JSON.stringify(message);
    for (const [ws] of this.sessions) {
      try {
        ws.send(payload);
      } catch {
      }
    }
  }
  sendTo(ws, message) {
    try {
      ws.send(JSON.stringify(message));
    } catch {
    }
  }
  sendError(ws, code, message) {
    this.sendTo(ws, {
      type: "ERROR",
      code,
      message,
      timestamp: Date.now()
    });
  }
  /**
   * Asynchronous D1 Persistence Checkpoints
   */
  async persistPlayerJoined(player) {
    if (!this.env.DB || !this.room) return;
    try {
      await this.env.DB.prepare(
        `INSERT INTO game_players (room_id, guest_id, nickname, player_number, color, joined_at)
         VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))
         ON CONFLICT(room_id, guest_id) DO UPDATE SET
           nickname = ?3,
           left_at = NULL`
      ).bind(this.room.id, player.id, player.nickname, player.playerNumber, player.color).run();
    } catch (e) {
      console.error("D1 persistPlayerJoined error:", e);
    }
  }
  async persistGameStarted() {
    if (!this.env.DB || !this.room) return;
    try {
      await this.env.DB.prepare(
        `UPDATE game_rooms SET status = 'playing', started_at = datetime('now') WHERE room_id = ?`
      ).bind(this.room.id).run();
    } catch (e) {
      console.error("D1 persistGameStarted error:", e);
    }
  }
  async persistGameMove(guestId, diceValue, moveResult) {
    if (!this.env.DB || !this.room) return;
    try {
      await this.env.DB.prepare(
        `INSERT INTO game_moves (room_id, guest_id, turn_id, turn_number, dice_value, old_position, dice_destination, special_move_type, special_move_from, special_move_to, final_position)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
      ).bind(
        this.room.id,
        guestId,
        `turn_${this.room.turnNumber}`,
        this.room.turnNumber,
        diceValue,
        moveResult.oldPosition,
        moveResult.intermediatePosition,
        moveResult.specialMove ? moveResult.specialMove.type : "none",
        moveResult.specialMove ? moveResult.specialMove.from : null,
        moveResult.specialMove ? moveResult.specialMove.to : null,
        moveResult.finalPosition
      ).run();
    } catch (e) {
      console.error("D1 persistGameMove error:", e);
    }
  }
  async persistChatMessage(msg) {
    if (!this.env.DB || !this.room || msg.isSystem) return;
    try {
      await this.env.DB.prepare(
        `INSERT INTO chat_messages (room_id, guest_id, nickname, message) VALUES (?1, ?2, ?3, ?4)`
      ).bind(this.room.id, msg.guestId, msg.nickname, msg.message).run();
    } catch (e) {
      console.error("D1 persistChatMessage error:", e);
    }
  }
  async persistGameCompleted(winner) {
    if (!this.env.DB || !this.room) return;
    try {
      const durationSeconds = this.room.startedAt ? Math.floor((Date.now() - this.room.startedAt) / 1e3) : 0;
      await this.env.DB.prepare(
        `UPDATE game_rooms SET status = 'finished', finished_at = datetime('now'), winner_guest_id = ?1, total_turns = ?2, duration_seconds = ?3 WHERE room_id = ?4`
      ).bind(winner.id, this.room.turnNumber, durationSeconds, this.room.id).run();
      const result = await this.env.DB.prepare(
        `INSERT INTO game_results (room_id, winner_guest_id, winner_nickname, total_players, total_turns, duration_seconds, game_mode, started_at, completed_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, datetime(?8, 'unixepoch'), datetime('now'))`
      ).bind(
        this.room.id,
        winner.id,
        winner.nickname,
        this.room.players.length,
        this.room.turnNumber,
        durationSeconds,
        this.room.mode,
        this.room.startedAt ? Math.floor(this.room.startedAt / 1e3) : Math.floor(Date.now() / 1e3)
      ).run();
      const sorted = [...this.room.players].sort((a, b) => b.position - a.position);
      for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i];
        await this.env.DB.prepare(
          `INSERT INTO game_result_players (game_result_id, guest_id, nickname, player_number, final_position, placement)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
        ).bind(result.meta.last_row_id || 1, p.id, p.nickname, p.playerNumber, p.position, i + 1).run();
      }
    } catch (e) {
      console.error("D1 persistGameCompleted error:", e);
    }
  }
};

// worker/auth/guestAuth.ts
async function hashToken(token) {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashToken, "hashToken");
async function hashIp(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`ip_salt_${ip}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
__name(hashIp, "hashIp");
async function registerOrUpdateGuest(db, guestId, nickname, sessionToken, ip) {
  const tokenHash = await hashToken(sessionToken);
  const ipHash = ip ? await hashIp(ip) : null;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await db.prepare(
    `INSERT INTO guest_players (guest_id, nickname, session_token_hash, created_at, last_seen_at, last_ip_hash)
       VALUES (?1, ?2, ?3, ?4, ?4, ?5)
       ON CONFLICT(guest_id) DO UPDATE SET
         nickname = ?2,
         session_token_hash = ?3,
         last_seen_at = ?4,
         last_ip_hash = COALESCE(?5, last_ip_hash)`
  ).bind(guestId, nickname, tokenHash, now, ipHash).run();
}
__name(registerOrUpdateGuest, "registerOrUpdateGuest");

// worker/routes/roomRoutes.ts
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return code;
}
__name(generateRoomCode, "generateRoomCode");
async function handleCreateRoom(request, env2) {
  try {
    const body = await request.json();
    if (!body.hostGuestId || !body.nickname) {
      return new Response(JSON.stringify({ error: "Missing guest ID or nickname" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await registerOrUpdateGuest(env2.DB, body.hostGuestId, body.nickname, body.sessionToken);
    const roomCode = generateRoomCode();
    const roomId = `room_${Date.now()}_${roomCode}`;
    const mode = body.mode || "private";
    const maxPlayers = body.maxPlayers || 4;
    const doId = env2.SNAKE_LADDER_ROOM.idFromName(roomCode);
    const doStub = env2.SNAKE_LADDER_ROOM.get(doId);
    const defaultRules = body.rules || {
      sixGivesExtraTurn: true,
      exact100ToWin: true,
      enterOnSix: false,
      maxConsecutiveSixes: 3
    };
    const hostPlayer = {
      id: body.hostGuestId,
      nickname: body.nickname,
      playerNumber: 1,
      color: "red",
      position: 0,
      isConnected: true,
      isBot: false,
      isReady: true,
      joinedAt: Date.now(),
      lastSeenAt: Date.now()
    };
    const players = [hostPlayer];
    if (mode === "bot" || body.botCount && body.botCount > 0) {
      const botCount = body.botCount || 1;
      const colors = ["blue", "green", "yellow"];
      for (let i = 0; i < botCount; i++) {
        const num = i + 2;
        players.push({
          id: `bot_${Date.now()}_${i + 1}`,
          nickname: `Bot ${i + 1} [AI]`,
          playerNumber: num,
          color: colors[i] || "yellow",
          position: 0,
          isConnected: true,
          isBot: true,
          botDifficulty: "medium",
          isReady: true,
          joinedAt: Date.now(),
          lastSeenAt: Date.now()
        });
      }
    }
    const room = {
      id: roomId,
      roomCode,
      hostGuestId: body.hostGuestId,
      durableObjectId: doId.toString(),
      mode,
      status: mode === "bot" && players.length >= 2 ? "playing" : "waiting",
      maxPlayers,
      currentTurnGuestId: body.hostGuestId,
      players,
      rules: defaultRules,
      turnNumber: 1,
      consecutiveSixes: 0,
      createdAt: Date.now(),
      startedAt: mode === "bot" ? Date.now() : void 0,
      events: [
        {
          id: `evt_${Date.now()}`,
          timestamp: Date.now(),
          type: "join",
          message: `${body.nickname} created room ${roomCode}`,
          guestId: body.hostGuestId,
          playerColor: "red"
        }
      ],
      chat: [
        {
          id: `chat_${Date.now()}`,
          guestId: "system",
          nickname: "System",
          message: `Welcome to room ${roomCode}! Roll dice and race to 100!`,
          createdAt: Date.now(),
          isSystem: true
        }
      ]
    };
    await doStub.fetch("http://internal/init", {
      method: "POST",
      body: JSON.stringify({ room }),
      headers: { "Content-Type": "application/json" }
    });
    const expiresAt = new Date(Date.now() + 30 * 60 * 1e3).toISOString();
    await env2.DB.prepare(
      `INSERT INTO game_rooms (room_id, room_code, host_guest_id, durable_object_id, mode, status, max_players, expires_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
    ).bind(
      roomId,
      roomCode,
      body.hostGuestId,
      doId.toString(),
      mode,
      room.status,
      maxPlayers,
      expiresAt
    ).run();
    await env2.DB.prepare(
      `INSERT INTO game_players (room_id, guest_id, nickname, player_number, color)
       VALUES (?1, ?2, ?3, 1, 'red')`
    ).bind(roomId, body.hostGuestId, body.nickname).run();
    return new Response(JSON.stringify({ success: true, room }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to create room" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateRoom, "handleCreateRoom");
async function handleGetRoom(roomCode, env2) {
  try {
    const doId = env2.SNAKE_LADDER_ROOM.idFromName(roomCode.toUpperCase());
    const doStub = env2.SNAKE_LADDER_ROOM.get(doId);
    const res = await doStub.fetch("http://internal/state");
    if (res.ok) {
      const data = await res.json();
      if (data.room) {
        return new Response(JSON.stringify({ success: true, room: data.room }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const roomRecord = await env2.DB.prepare(
      "SELECT * FROM game_rooms WHERE room_code = ?"
    ).bind(roomCode.toUpperCase()).first();
    if (!roomRecord) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, room: roomRecord }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleGetRoom, "handleGetRoom");

// worker/routes/matchmakingRoutes.ts
async function handleMatchmaking(request, env2) {
  try {
    const body = await request.json();
    const availableRoom = await env2.DB.prepare(
      `SELECT room_code FROM game_rooms
       WHERE mode = 'quick' AND status = 'waiting'
       ORDER BY created_at ASC
       LIMIT 1`
    ).first();
    if (availableRoom) {
      return new Response(JSON.stringify({ success: true, roomCode: availableRoom.room_code }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    const createReq = new Request("http://internal/api/rooms/create", {
      method: "POST",
      body: JSON.stringify({
        hostGuestId: body.guestId,
        nickname: body.nickname,
        sessionToken: body.sessionToken,
        mode: "quick",
        maxPlayers: 2
      }),
      headers: { "Content-Type": "application/json" }
    });
    return await handleCreateRoom(createReq, env2);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Matchmaking error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleMatchmaking, "handleMatchmaking");

// worker/routes/adminRoutes.ts
async function handleAdminMetrics(request, env2) {
  const authHeader = request.headers.get("Authorization");
  const adminSecret = env2.ADMIN_SECRET;
  if (!adminSecret || !authHeader || !authHeader.includes(adminSecret)) {
    return new Response(JSON.stringify({ error: "Unauthorized admin access" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const activeRooms = await env2.DB.prepare(
      "SELECT count(*) as count FROM game_rooms WHERE status IN ('waiting', 'playing')"
    ).first();
    const completedGames = await env2.DB.prepare(
      "SELECT count(*) as count FROM game_results"
    ).first();
    const totalPlayers = await env2.DB.prepare(
      "SELECT count(*) as count FROM guest_players"
    ).first();
    return new Response(
      JSON.stringify({
        success: true,
        metrics: {
          activeRooms: activeRooms?.count || 0,
          completedGames: completedGames?.count || 0,
          totalGuests: totalPlayers?.count || 0
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleAdminMetrics, "handleAdminMetrics");

// worker/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Guest-Token"
};
var index_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      if (url.pathname.startsWith("/api/ws/")) {
        const parts = url.pathname.split("/");
        const roomCode = parts[3]?.toUpperCase();
        if (!roomCode || roomCode.length < 4) {
          return new Response("Invalid room code for WebSocket upgrade", { status: 400 });
        }
        const doId = env2.SNAKE_LADDER_ROOM.idFromName(roomCode);
        const doStub = env2.SNAKE_LADDER_ROOM.get(doId);
        return await doStub.fetch(request);
      }
      if (url.pathname === "/api/rooms/create" && request.method === "POST") {
        const res = await handleCreateRoom(request, env2);
        return addCors(res);
      }
      if (url.pathname.startsWith("/api/rooms/") && request.method === "GET") {
        const roomCode = url.pathname.split("/")[3];
        const res = await handleGetRoom(roomCode, env2);
        return addCors(res);
      }
      if (url.pathname === "/api/matchmaking/find" && request.method === "POST") {
        const res = await handleMatchmaking(request, env2);
        return addCors(res);
      }
      if (url.pathname === "/api/admin/metrics") {
        const res = await handleAdminMetrics(request, env2);
        return addCors(res);
      }
      if (url.pathname === "/api/health") {
        return addCors(
          new Response(
            JSON.stringify({
              status: "healthy",
              service: "snake-and-ladder-cloudflare-backend",
              timestamp: Date.now()
            }),
            { headers: { "Content-Type": "application/json" } }
          )
        );
      }
      if (env2.ASSETS) {
        const assetResponse = await env2.ASSETS.fetch(request);
        if (assetResponse.status === 404 && request.method === "GET" && !url.pathname.includes(".")) {
          const indexUrl = new URL("/index.html", request.url);
          return await env2.ASSETS.fetch(new Request(indexUrl.toString(), request));
        }
        return assetResponse;
      }
      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return addCors(
        new Response(JSON.stringify({ error: err.message || "Worker Internal Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      );
    }
  }
};
function addCors(response) {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
__name(addCors, "addCors");
export {
  SnakeLadderRoom,
  index_default as default
};
//# sourceMappingURL=index.js.map
