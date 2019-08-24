module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "757941936eaefb4f0959";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This is the web browser implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(/*! ./debug */ \"./node_modules/debug/src/debug.js\");\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = 'undefined' != typeof chrome\n               && 'undefined' != typeof chrome.storage\n                  ? chrome.storage.local\n                  : localstorage();\n\n/**\n * Colors.\n */\n\nexports.colors = [\n  'lightseagreen',\n  'forestgreen',\n  'goldenrod',\n  'dodgerblue',\n  'darkorchid',\n  'crimson'\n];\n\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {\n    return true;\n  }\n\n  // is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||\n    // is firebug? http://stackoverflow.com/a/398120/376773\n    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||\n    // is firefox >= v31?\n    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||\n    // double check webkit in userAgent just in case we are in a worker\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/));\n}\n\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nexports.formatters.j = function(v) {\n  try {\n    return JSON.stringify(v);\n  } catch (err) {\n    return '[UnexpectedJSONParseError]: ' + err.message;\n  }\n};\n\n\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var useColors = this.useColors;\n\n  args[0] = (useColors ? '%c' : '')\n    + this.namespace\n    + (useColors ? ' %c' : ' ')\n    + args[0]\n    + (useColors ? '%c ' : ' ')\n    + '+' + exports.humanize(this.diff);\n\n  if (!useColors) return;\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit')\n\n  // the final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function(match) {\n    if ('%%' === match) return;\n    index++;\n    if ('%c' === match) {\n      // we only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n\n  args.splice(lastC, 0, c);\n}\n\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\nfunction log() {\n  // this hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return 'object' === typeof console\n    && console.log\n    && Function.prototype.apply.call(console.log, console, arguments);\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  try {\n    if (null == namespaces) {\n      exports.storage.removeItem('debug');\n    } else {\n      exports.storage.debug = namespaces;\n    }\n  } catch(e) {}\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  var r;\n  try {\n    r = exports.storage.debug;\n  } catch(e) {}\n\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n\n/**\n * Enable namespaces listed in `localStorage.debug` initially.\n */\n\nexports.enable(load());\n\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\nfunction localstorage() {\n  try {\n    return window.localStorage;\n  } catch (e) {}\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanM/MzRlYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixtQkFBTyxDQUFDLGtEQUFTO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lXG4gICAgICAgICAgICAgICAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgID8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgICAgICAgICAgICAgIDogbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuICAnbGlnaHRzZWFncmVlbicsXG4gICdmb3Jlc3RncmVlbicsXG4gICdnb2xkZW5yb2QnLFxuICAnZG9kZ2VyYmx1ZScsXG4gICdkYXJrb3JjaGlkJyxcbiAgJ2NyaW1zb24nXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcbiAgICAvLyBkb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG4gICAgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyLm1lc3NhZ2U7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0JylcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB2YXIgcjtcbiAgdHJ5IHtcbiAgICByID0gZXhwb3J0cy5zdG9yYWdlLmRlYnVnO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgLy8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuICBpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcbiAgICByID0gcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/debug/src/browser.js\n");

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/debug.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = createDebug.debug = createDebug['default'] = createDebug;\nexports.coerce = coerce;\nexports.disable = disable;\nexports.enable = enable;\nexports.enabled = enabled;\nexports.humanize = __webpack_require__(/*! ms */ \"./node_modules/ms/index.js\");\n\n/**\n * The currently active debug mode names, and names to skip.\n */\n\nexports.names = [];\nexports.skips = [];\n\n/**\n * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n *\n * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n */\n\nexports.formatters = {};\n\n/**\n * Previous log timestamp.\n */\n\nvar prevTime;\n\n/**\n * Select a color.\n * @param {String} namespace\n * @return {Number}\n * @api private\n */\n\nfunction selectColor(namespace) {\n  var hash = 0, i;\n\n  for (i in namespace) {\n    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);\n    hash |= 0; // Convert to 32bit integer\n  }\n\n  return exports.colors[Math.abs(hash) % exports.colors.length];\n}\n\n/**\n * Create a debugger with the given `namespace`.\n *\n * @param {String} namespace\n * @return {Function}\n * @api public\n */\n\nfunction createDebug(namespace) {\n\n  function debug() {\n    // disabled?\n    if (!debug.enabled) return;\n\n    var self = debug;\n\n    // set `diff` timestamp\n    var curr = +new Date();\n    var ms = curr - (prevTime || curr);\n    self.diff = ms;\n    self.prev = prevTime;\n    self.curr = curr;\n    prevTime = curr;\n\n    // turn the `arguments` into a proper Array\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n\n    args[0] = exports.coerce(args[0]);\n\n    if ('string' !== typeof args[0]) {\n      // anything else let's inspect with %O\n      args.unshift('%O');\n    }\n\n    // apply any `formatters` transformations\n    var index = 0;\n    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {\n      // if we encounter an escaped % then don't increase the array index\n      if (match === '%%') return match;\n      index++;\n      var formatter = exports.formatters[format];\n      if ('function' === typeof formatter) {\n        var val = args[index];\n        match = formatter.call(self, val);\n\n        // now we need to remove `args[index]` since it's inlined in the `format`\n        args.splice(index, 1);\n        index--;\n      }\n      return match;\n    });\n\n    // apply env-specific formatting (colors, etc.)\n    exports.formatArgs.call(self, args);\n\n    var logFn = debug.log || exports.log || console.log.bind(console);\n    logFn.apply(self, args);\n  }\n\n  debug.namespace = namespace;\n  debug.enabled = exports.enabled(namespace);\n  debug.useColors = exports.useColors();\n  debug.color = selectColor(namespace);\n\n  // env-specific initialization logic for debug instances\n  if ('function' === typeof exports.init) {\n    exports.init(debug);\n  }\n\n  return debug;\n}\n\n/**\n * Enables a debug mode by namespaces. This can include modes\n * separated by a colon and wildcards.\n *\n * @param {String} namespaces\n * @api public\n */\n\nfunction enable(namespaces) {\n  exports.save(namespaces);\n\n  exports.names = [];\n  exports.skips = [];\n\n  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n  var len = split.length;\n\n  for (var i = 0; i < len; i++) {\n    if (!split[i]) continue; // ignore empty strings\n    namespaces = split[i].replace(/\\*/g, '.*?');\n    if (namespaces[0] === '-') {\n      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n    } else {\n      exports.names.push(new RegExp('^' + namespaces + '$'));\n    }\n  }\n}\n\n/**\n * Disable debug output.\n *\n * @api public\n */\n\nfunction disable() {\n  exports.enable('');\n}\n\n/**\n * Returns true if the given mode name is enabled, false otherwise.\n *\n * @param {String} name\n * @return {Boolean}\n * @api public\n */\n\nfunction enabled(name) {\n  var i, len;\n  for (i = 0, len = exports.skips.length; i < len; i++) {\n    if (exports.skips[i].test(name)) {\n      return false;\n    }\n  }\n  for (i = 0, len = exports.names.length; i < len; i++) {\n    if (exports.names[i].test(name)) {\n      return true;\n    }\n  }\n  return false;\n}\n\n/**\n * Coerce `val`.\n *\n * @param {Mixed} val\n * @return {Mixed}\n * @api private\n */\n\nfunction coerce(val) {\n  if (val instanceof Error) return val.stack || val.message;\n  return val;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzPzk2ZmUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFPLENBQUMsc0NBQUk7O0FBRS9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsU0FBUztBQUMxQiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsU0FBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnWydkZWZhdWx0J10gPSBjcmVhdGVEZWJ1ZztcbmV4cG9ydHMuY29lcmNlID0gY29lcmNlO1xuZXhwb3J0cy5kaXNhYmxlID0gZGlzYWJsZTtcbmV4cG9ydHMuZW5hYmxlID0gZW5hYmxlO1xuZXhwb3J0cy5lbmFibGVkID0gZW5hYmxlZDtcbmV4cG9ydHMuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICovXG5cbmV4cG9ydHMubmFtZXMgPSBbXTtcbmV4cG9ydHMuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG4gKlxuICogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycyA9IHt9O1xuXG4vKipcbiAqIFByZXZpb3VzIGxvZyB0aW1lc3RhbXAuXG4gKi9cblxudmFyIHByZXZUaW1lO1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG4gIHZhciBoYXNoID0gMCwgaTtcblxuICBmb3IgKGkgaW4gbmFtZXNwYWNlKSB7XG4gICAgaGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIG5hbWVzcGFjZS5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cblxuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICAvLyBkaXNhYmxlZD9cbiAgICBpZiAoIWRlYnVnLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciBzZWxmID0gZGVidWc7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIHR1cm4gdGhlIGBhcmd1bWVudHNgIGludG8gYSBwcm9wZXIgQXJyYXlcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgYXJnc1swXSA9IGV4cG9ydHMuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgLy8gYW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cbiAgICAgIGFyZ3MudW5zaGlmdCgnJU8nKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgLy8gYXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcbiAgICBleHBvcnRzLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuICAgIHZhciBsb2dGbiA9IGRlYnVnLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG5cbiAgZGVidWcubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICBkZWJ1Zy5lbmFibGVkID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSk7XG4gIGRlYnVnLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gIGRlYnVnLmNvbG9yID0gc2VsZWN0Q29sb3IobmFtZXNwYWNlKTtcblxuICAvLyBlbnYtc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGRlYnVnIGluc3RhbmNlc1xuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGV4cG9ydHMuaW5pdCkge1xuICAgIGV4cG9ydHMuaW5pdChkZWJ1Zyk7XG4gIH1cblxuICByZXR1cm4gZGVidWc7XG59XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICBleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7XG5cbiAgZXhwb3J0cy5uYW1lcyA9IFtdO1xuICBleHBvcnRzLnNraXBzID0gW107XG5cbiAgdmFyIHNwbGl0ID0gKHR5cGVvZiBuYW1lc3BhY2VzID09PSAnc3RyaW5nJyA/IG5hbWVzcGFjZXMgOiAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgdmFyIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/debug/src/debug.js\n");

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Detect Electron renderer process, which is node, but we should\n * treat as a browser.\n */\n\nif (typeof process !== 'undefined' && process.type === 'renderer') {\n  module.exports = __webpack_require__(/*! ./browser.js */ \"./node_modules/debug/src/browser.js\");\n} else {\n  module.exports = __webpack_require__(/*! ./node.js */ \"./node_modules/debug/src/node.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzPzQxNmMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsbUJBQU8sQ0FBQyx5REFBYztBQUN6QyxDQUFDO0FBQ0QsbUJBQW1CLG1CQUFPLENBQUMsbURBQVc7QUFDdEMiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZXRlY3QgRWxlY3Ryb24gcmVuZGVyZXIgcHJvY2Vzcywgd2hpY2ggaXMgbm9kZSwgYnV0IHdlIHNob3VsZFxuICogdHJlYXQgYXMgYSBicm93c2VyLlxuICovXG5cbmlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9icm93c2VyLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbm9kZS5qcycpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/debug/src/index.js\n");

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar tty = __webpack_require__(/*! tty */ \"tty\");\nvar util = __webpack_require__(/*! util */ \"util\");\n\n/**\n * This is the Node.js implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(/*! ./debug */ \"./node_modules/debug/src/debug.js\");\nexports.init = init;\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\n\n/**\n * Colors.\n */\n\nexports.colors = [6, 2, 3, 4, 5, 1];\n\n/**\n * Build up the default `inspectOpts` object from the environment variables.\n *\n *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js\n */\n\nexports.inspectOpts = Object.keys(process.env).filter(function (key) {\n  return /^debug_/i.test(key);\n}).reduce(function (obj, key) {\n  // camel-case\n  var prop = key\n    .substring(6)\n    .toLowerCase()\n    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });\n\n  // coerce string value into JS value\n  var val = process.env[key];\n  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;\n  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;\n  else if (val === 'null') val = null;\n  else val = Number(val);\n\n  obj[prop] = val;\n  return obj;\n}, {});\n\n/**\n * The file descriptor to write the `debug()` calls to.\n * Set the `DEBUG_FD` env variable to override with another value. i.e.:\n *\n *   $ DEBUG_FD=3 node script.js 3>debug.log\n */\n\nvar fd = parseInt(process.env.DEBUG_FD, 10) || 2;\n\nif (1 !== fd && 2 !== fd) {\n  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()\n}\n\nvar stream = 1 === fd ? process.stdout :\n             2 === fd ? process.stderr :\n             createWritableStdioStream(fd);\n\n/**\n * Is stdout a TTY? Colored output is enabled when `true`.\n */\n\nfunction useColors() {\n  return 'colors' in exports.inspectOpts\n    ? Boolean(exports.inspectOpts.colors)\n    : tty.isatty(fd);\n}\n\n/**\n * Map %o to `util.inspect()`, all on a single line.\n */\n\nexports.formatters.o = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts)\n    .split('\\n').map(function(str) {\n      return str.trim()\n    }).join(' ');\n};\n\n/**\n * Map %o to `util.inspect()`, allowing multiple lines if needed.\n */\n\nexports.formatters.O = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts);\n};\n\n/**\n * Adds ANSI color escape codes if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var name = this.namespace;\n  var useColors = this.useColors;\n\n  if (useColors) {\n    var c = this.color;\n    var prefix = '  \\u001b[3' + c + ';1m' + name + ' ' + '\\u001b[0m';\n\n    args[0] = prefix + args[0].split('\\n').join('\\n' + prefix);\n    args.push('\\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\\u001b[0m');\n  } else {\n    args[0] = new Date().toUTCString()\n      + ' ' + name + ' ' + args[0];\n  }\n}\n\n/**\n * Invokes `util.format()` with the specified arguments and writes to `stream`.\n */\n\nfunction log() {\n  return stream.write(util.format.apply(util, arguments) + '\\n');\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  if (null == namespaces) {\n    // If you set a process.env field to null or undefined, it gets cast to the\n    // string 'null' or 'undefined'. Just delete instead.\n    delete process.env.DEBUG;\n  } else {\n    process.env.DEBUG = namespaces;\n  }\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  return process.env.DEBUG;\n}\n\n/**\n * Copied from `node/src/node.js`.\n *\n * XXX: It's lame that node doesn't expose this API out-of-the-box. It also\n * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.\n */\n\nfunction createWritableStdioStream (fd) {\n  var stream;\n  var tty_wrap = process.binding('tty_wrap');\n\n  // Note stream._type is used for test-module-load-list.js\n\n  switch (tty_wrap.guessHandleType(fd)) {\n    case 'TTY':\n      stream = new tty.WriteStream(fd);\n      stream._type = 'tty';\n\n      // Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    case 'FILE':\n      var fs = __webpack_require__(/*! fs */ \"fs\");\n      stream = new fs.SyncWriteStream(fd, { autoClose: false });\n      stream._type = 'fs';\n      break;\n\n    case 'PIPE':\n    case 'TCP':\n      var net = __webpack_require__(/*! net */ \"net\");\n      stream = new net.Socket({\n        fd: fd,\n        readable: false,\n        writable: true\n      });\n\n      // FIXME Should probably have an option in net.Socket to create a\n      // stream from an existing fd which is writable only. But for now\n      // we'll just add this hack and set the `readable` member to false.\n      // Test: ./node test/fixtures/echo.js < /etc/passwd\n      stream.readable = false;\n      stream.read = null;\n      stream._type = 'pipe';\n\n      // FIXME Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    default:\n      // Probably an error on in uv_guess_handle()\n      throw new Error('Implement me. Unknown stream file type!');\n  }\n\n  // For supporting legacy API we put the FD here.\n  stream.fd = fd;\n\n  stream._isStdio = true;\n\n  return stream;\n}\n\n/**\n * Init logic for `debug` instances.\n *\n * Create a new `inspectOpts` object in case `useColors` is set\n * differently for a particular `debug` instance.\n */\n\nfunction init (debug) {\n  debug.inspectOpts = {};\n\n  var keys = Object.keys(exports.inspectOpts);\n  for (var i = 0; i < keys.length; i++) {\n    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];\n  }\n}\n\n/**\n * Enable namespaces listed in `process.env.DEBUG` initially.\n */\n\nexports.enable(load());\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanM/NjEyNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVSxtQkFBTyxDQUFDLGdCQUFLO0FBQ3ZCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsbUJBQU8sQ0FBQyxrREFBUztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyx5QkFBeUI7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQyxJQUFJOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLG1CQUFPLENBQUMsY0FBSTtBQUMzQiwyQ0FBMkMsbUJBQW1CO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixtQkFBTyxDQUFDLGdCQUFLO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciB0dHkgPSByZXF1aXJlKCd0dHknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmluaXQgPSBpbml0O1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbNiwgMiwgMywgNCwgNSwgMV07XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIGRlZmF1bHQgYGluc3BlY3RPcHRzYCBvYmplY3QgZnJvbSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICpcbiAqICAgJCBERUJVR19DT0xPUlM9bm8gREVCVUdfREVQVEg9MTAgREVCVUdfU0hPV19ISURERU49ZW5hYmxlZCBub2RlIHNjcmlwdC5qc1xuICovXG5cbmV4cG9ydHMuaW5zcGVjdE9wdHMgPSBPYmplY3Qua2V5cyhwcm9jZXNzLmVudikuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIC9eZGVidWdfL2kudGVzdChrZXkpO1xufSkucmVkdWNlKGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAvLyBjYW1lbC1jYXNlXG4gIHZhciBwcm9wID0ga2V5XG4gICAgLnN1YnN0cmluZyg2KVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL18oW2Etel0pL2csIGZ1bmN0aW9uIChfLCBrKSB7IHJldHVybiBrLnRvVXBwZXJDYXNlKCkgfSk7XG5cbiAgLy8gY29lcmNlIHN0cmluZyB2YWx1ZSBpbnRvIEpTIHZhbHVlXG4gIHZhciB2YWwgPSBwcm9jZXNzLmVudltrZXldO1xuICBpZiAoL14oeWVzfG9ufHRydWV8ZW5hYmxlZCkkL2kudGVzdCh2YWwpKSB2YWwgPSB0cnVlO1xuICBlbHNlIGlmICgvXihub3xvZmZ8ZmFsc2V8ZGlzYWJsZWQpJC9pLnRlc3QodmFsKSkgdmFsID0gZmFsc2U7XG4gIGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB2YWwgPSBudWxsO1xuICBlbHNlIHZhbCA9IE51bWJlcih2YWwpO1xuXG4gIG9ialtwcm9wXSA9IHZhbDtcbiAgcmV0dXJuIG9iajtcbn0sIHt9KTtcblxuLyoqXG4gKiBUaGUgZmlsZSBkZXNjcmlwdG9yIHRvIHdyaXRlIHRoZSBgZGVidWcoKWAgY2FsbHMgdG8uXG4gKiBTZXQgdGhlIGBERUJVR19GRGAgZW52IHZhcmlhYmxlIHRvIG92ZXJyaWRlIHdpdGggYW5vdGhlciB2YWx1ZS4gaS5lLjpcbiAqXG4gKiAgICQgREVCVUdfRkQ9MyBub2RlIHNjcmlwdC5qcyAzPmRlYnVnLmxvZ1xuICovXG5cbnZhciBmZCA9IHBhcnNlSW50KHByb2Nlc3MuZW52LkRFQlVHX0ZELCAxMCkgfHwgMjtcblxuaWYgKDEgIT09IGZkICYmIDIgIT09IGZkKSB7XG4gIHV0aWwuZGVwcmVjYXRlKGZ1bmN0aW9uKCl7fSwgJ2V4Y2VwdCBmb3Igc3RkZXJyKDIpIGFuZCBzdGRvdXQoMSksIGFueSBvdGhlciB1c2FnZSBvZiBERUJVR19GRCBpcyBkZXByZWNhdGVkLiBPdmVycmlkZSBkZWJ1Zy5sb2cgaWYgeW91IHdhbnQgdG8gdXNlIGEgZGlmZmVyZW50IGxvZyBmdW5jdGlvbiAoaHR0cHM6Ly9naXQuaW8vZGVidWdfZmQpJykoKVxufVxuXG52YXIgc3RyZWFtID0gMSA9PT0gZmQgPyBwcm9jZXNzLnN0ZG91dCA6XG4gICAgICAgICAgICAgMiA9PT0gZmQgPyBwcm9jZXNzLnN0ZGVyciA6XG4gICAgICAgICAgICAgY3JlYXRlV3JpdGFibGVTdGRpb1N0cmVhbShmZCk7XG5cbi8qKlxuICogSXMgc3Rkb3V0IGEgVFRZPyBDb2xvcmVkIG91dHB1dCBpcyBlbmFibGVkIHdoZW4gYHRydWVgLlxuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgcmV0dXJuICdjb2xvcnMnIGluIGV4cG9ydHMuaW5zcGVjdE9wdHNcbiAgICA/IEJvb2xlYW4oZXhwb3J0cy5pbnNwZWN0T3B0cy5jb2xvcnMpXG4gICAgOiB0dHkuaXNhdHR5KGZkKTtcbn1cblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsIG9uIGEgc2luZ2xlIGxpbmUuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLm8gPSBmdW5jdGlvbih2KSB7XG4gIHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG4gIHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cylcbiAgICAuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBzdHIudHJpbSgpXG4gICAgfSkuam9pbignICcpO1xufTtcblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsb3dpbmcgbXVsdGlwbGUgbGluZXMgaWYgbmVlZGVkLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24odikge1xuICB0aGlzLmluc3BlY3RPcHRzLmNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuICByZXR1cm4gdXRpbC5pbnNwZWN0KHYsIHRoaXMuaW5zcGVjdE9wdHMpO1xufTtcblxuLyoqXG4gKiBBZGRzIEFOU0kgY29sb3IgZXNjYXBlIGNvZGVzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLm5hbWVzcGFjZTtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGlmICh1c2VDb2xvcnMpIHtcbiAgICB2YXIgYyA9IHRoaXMuY29sb3I7XG4gICAgdmFyIHByZWZpeCA9ICcgIFxcdTAwMWJbMycgKyBjICsgJzsxbScgKyBuYW1lICsgJyAnICsgJ1xcdTAwMWJbMG0nO1xuXG4gICAgYXJnc1swXSA9IHByZWZpeCArIGFyZ3NbMF0uc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbicgKyBwcmVmaXgpO1xuICAgIGFyZ3MucHVzaCgnXFx1MDAxYlszJyArIGMgKyAnbSsnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpICsgJ1xcdTAwMWJbMG0nKTtcbiAgfSBlbHNlIHtcbiAgICBhcmdzWzBdID0gbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXG4gICAgICArICcgJyArIG5hbWUgKyAnICcgKyBhcmdzWzBdO1xuICB9XG59XG5cbi8qKlxuICogSW52b2tlcyBgdXRpbC5mb3JtYXQoKWAgd2l0aCB0aGUgc3BlY2lmaWVkIGFyZ3VtZW50cyBhbmQgd3JpdGVzIHRvIGBzdHJlYW1gLlxuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgcmV0dXJuIHN0cmVhbS53cml0ZSh1dGlsLmZvcm1hdC5hcHBseSh1dGlsLCBhcmd1bWVudHMpICsgJ1xcbicpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgaWYgKG51bGwgPT0gbmFtZXNwYWNlcykge1xuICAgIC8vIElmIHlvdSBzZXQgYSBwcm9jZXNzLmVudiBmaWVsZCB0byBudWxsIG9yIHVuZGVmaW5lZCwgaXQgZ2V0cyBjYXN0IHRvIHRoZVxuICAgIC8vIHN0cmluZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcuIEp1c3QgZGVsZXRlIGluc3RlYWQuXG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkRFQlVHO1xuICB9IGVsc2Uge1xuICAgIHByb2Nlc3MuZW52LkRFQlVHID0gbmFtZXNwYWNlcztcbiAgfVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHJldHVybiBwcm9jZXNzLmVudi5ERUJVRztcbn1cblxuLyoqXG4gKiBDb3BpZWQgZnJvbSBgbm9kZS9zcmMvbm9kZS5qc2AuXG4gKlxuICogWFhYOiBJdCdzIGxhbWUgdGhhdCBub2RlIGRvZXNuJ3QgZXhwb3NlIHRoaXMgQVBJIG91dC1vZi10aGUtYm94LiBJdCBhbHNvXG4gKiByZWxpZXMgb24gdGhlIHVuZG9jdW1lbnRlZCBgdHR5X3dyYXAuZ3Vlc3NIYW5kbGVUeXBlKClgIHdoaWNoIGlzIGFsc28gbGFtZS5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVXcml0YWJsZVN0ZGlvU3RyZWFtIChmZCkge1xuICB2YXIgc3RyZWFtO1xuICB2YXIgdHR5X3dyYXAgPSBwcm9jZXNzLmJpbmRpbmcoJ3R0eV93cmFwJyk7XG5cbiAgLy8gTm90ZSBzdHJlYW0uX3R5cGUgaXMgdXNlZCBmb3IgdGVzdC1tb2R1bGUtbG9hZC1saXN0LmpzXG5cbiAgc3dpdGNoICh0dHlfd3JhcC5ndWVzc0hhbmRsZVR5cGUoZmQpKSB7XG4gICAgY2FzZSAnVFRZJzpcbiAgICAgIHN0cmVhbSA9IG5ldyB0dHkuV3JpdGVTdHJlYW0oZmQpO1xuICAgICAgc3RyZWFtLl90eXBlID0gJ3R0eSc7XG5cbiAgICAgIC8vIEhhY2sgdG8gaGF2ZSBzdHJlYW0gbm90IGtlZXAgdGhlIGV2ZW50IGxvb3AgYWxpdmUuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzI2XG4gICAgICBpZiAoc3RyZWFtLl9oYW5kbGUgJiYgc3RyZWFtLl9oYW5kbGUudW5yZWYpIHtcbiAgICAgICAgc3RyZWFtLl9oYW5kbGUudW5yZWYoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnRklMRSc6XG4gICAgICB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgc3RyZWFtID0gbmV3IGZzLlN5bmNXcml0ZVN0cmVhbShmZCwgeyBhdXRvQ2xvc2U6IGZhbHNlIH0pO1xuICAgICAgc3RyZWFtLl90eXBlID0gJ2ZzJztcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUElQRSc6XG4gICAgY2FzZSAnVENQJzpcbiAgICAgIHZhciBuZXQgPSByZXF1aXJlKCduZXQnKTtcbiAgICAgIHN0cmVhbSA9IG5ldyBuZXQuU29ja2V0KHtcbiAgICAgICAgZmQ6IGZkLFxuICAgICAgICByZWFkYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLy8gRklYTUUgU2hvdWxkIHByb2JhYmx5IGhhdmUgYW4gb3B0aW9uIGluIG5ldC5Tb2NrZXQgdG8gY3JlYXRlIGFcbiAgICAgIC8vIHN0cmVhbSBmcm9tIGFuIGV4aXN0aW5nIGZkIHdoaWNoIGlzIHdyaXRhYmxlIG9ubHkuIEJ1dCBmb3Igbm93XG4gICAgICAvLyB3ZSdsbCBqdXN0IGFkZCB0aGlzIGhhY2sgYW5kIHNldCB0aGUgYHJlYWRhYmxlYCBtZW1iZXIgdG8gZmFsc2UuXG4gICAgICAvLyBUZXN0OiAuL25vZGUgdGVzdC9maXh0dXJlcy9lY2hvLmpzIDwgL2V0Yy9wYXNzd2RcbiAgICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RyZWFtLnJlYWQgPSBudWxsO1xuICAgICAgc3RyZWFtLl90eXBlID0gJ3BpcGUnO1xuXG4gICAgICAvLyBGSVhNRSBIYWNrIHRvIGhhdmUgc3RyZWFtIG5vdCBrZWVwIHRoZSBldmVudCBsb29wIGFsaXZlLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcyNlxuICAgICAgaWYgKHN0cmVhbS5faGFuZGxlICYmIHN0cmVhbS5faGFuZGxlLnVucmVmKSB7XG4gICAgICAgIHN0cmVhbS5faGFuZGxlLnVucmVmKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBQcm9iYWJseSBhbiBlcnJvciBvbiBpbiB1dl9ndWVzc19oYW5kbGUoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbXBsZW1lbnQgbWUuIFVua25vd24gc3RyZWFtIGZpbGUgdHlwZSEnKTtcbiAgfVxuXG4gIC8vIEZvciBzdXBwb3J0aW5nIGxlZ2FjeSBBUEkgd2UgcHV0IHRoZSBGRCBoZXJlLlxuICBzdHJlYW0uZmQgPSBmZDtcblxuICBzdHJlYW0uX2lzU3RkaW8gPSB0cnVlO1xuXG4gIHJldHVybiBzdHJlYW07XG59XG5cbi8qKlxuICogSW5pdCBsb2dpYyBmb3IgYGRlYnVnYCBpbnN0YW5jZXMuXG4gKlxuICogQ3JlYXRlIGEgbmV3IGBpbnNwZWN0T3B0c2Agb2JqZWN0IGluIGNhc2UgYHVzZUNvbG9yc2AgaXMgc2V0XG4gKiBkaWZmZXJlbnRseSBmb3IgYSBwYXJ0aWN1bGFyIGBkZWJ1Z2AgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gaW5pdCAoZGVidWcpIHtcbiAgZGVidWcuaW5zcGVjdE9wdHMgPSB7fTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV4cG9ydHMuaW5zcGVjdE9wdHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBkZWJ1Zy5pbnNwZWN0T3B0c1trZXlzW2ldXSA9IGV4cG9ydHMuaW5zcGVjdE9wdHNba2V5c1tpXV07XG4gIH1cbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYHByb2Nlc3MuZW52LkRFQlVHYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/node.js\n");

/***/ }),

/***/ "./node_modules/electron-debug sync recursive":
/*!******************************************!*\
  !*** ./node_modules/electron-debug sync ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/electron-debug sync recursive\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcgc3luYz83ZTY4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsV0FBVztBQUNsRDtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcgc3luYyByZWN1cnNpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH07XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcgc3luYyByZWN1cnNpdmVcIjsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-debug sync recursive\n");

/***/ }),

/***/ "./node_modules/electron-debug/index.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-debug/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst electron = __webpack_require__(/*! electron */ \"electron\");\nconst localShortcut = __webpack_require__(/*! electron-localshortcut */ \"./node_modules/electron-localshortcut/index.js\");\nconst isDev = __webpack_require__(/*! electron-is-dev */ \"./node_modules/electron-is-dev/index.js\");\n\nconst app = electron.app;\nconst BrowserWindow = electron.BrowserWindow;\nconst isMacOS = process.platform === 'darwin';\n\nfunction devTools(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.toggleDevTools();\n\t}\n}\n\nfunction openDevTools(win, showDevTools) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\tconst mode = showDevTools === true ? undefined : showDevTools;\n\t\twin.webContents.openDevTools({mode});\n\t}\n}\n\nfunction refresh(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.webContents.reloadIgnoringCache();\n\t}\n}\n\nfunction inspectElements() {\n\tconst win = BrowserWindow.getFocusedWindow();\n\tconst inspect = () => {\n\t\twin.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');\n\t};\n\n\tif (win) {\n\t\tif (win.webContents.isDevToolsOpened()) {\n\t\t\tinspect();\n\t\t} else {\n\t\t\twin.webContents.on('devtools-opened', inspect);\n\t\t\twin.openDevTools();\n\t\t}\n\t}\n}\n\nconst addExtensionIfInstalled = (name, getPath) => {\n\tconst isExtensionInstalled = name => {\n\t\treturn BrowserWindow.getDevToolsExtensions &&\n\t\t\t{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), name);\n\t};\n\n\ttry {\n\t\tif (!isExtensionInstalled(name)) {\n\t\t\tBrowserWindow.addDevToolsExtension(getPath(name));\n\t\t}\n\t} catch (err) {}\n};\n\nmodule.exports = opts => {\n\topts = Object.assign({\n\t\tenabled: null,\n\t\tshowDevTools: false\n\t}, opts);\n\n\tif (opts.enabled === false || (opts.enabled === null && !isDev)) {\n\t\treturn;\n\t}\n\n\tapp.on('browser-window-created', (e, win) => {\n\t\tif (opts.showDevTools) {\n\t\t\topenDevTools(win, opts.showDevTools);\n\t\t}\n\t});\n\n\tapp.on('ready', () => {\n\t\taddExtensionIfInstalled('devtron', name => __webpack_require__(\"./node_modules/electron-debug sync recursive\")(name).path);\n\t\t// TODO: Use this when https://github.com/firejune/electron-react-devtools/pull/6 is out\n\t\t// addExtensionIfInstalled('electron-react-devtools', name => require(name).path);\n\t\taddExtensionIfInstalled('electron-react-devtools', name => __webpack_require__(/*! path */ \"path\").dirname(/*require.resolve*/(__webpack_require__(\"./node_modules/electron-debug sync recursive\").resolve(name))));\n\n\t\tlocalShortcut.register('CmdOrCtrl+Shift+C', inspectElements);\n\t\tlocalShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);\n\t\tlocalShortcut.register('F12', devTools);\n\n\t\tlocalShortcut.register('CmdOrCtrl+R', refresh);\n\t\tlocalShortcut.register('F5', refresh);\n\t});\n};\n\nmodule.exports.refresh = refresh;\nmodule.exports.devTools = devTools;\nmodule.exports.openDevTools = openDevTools;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcvaW5kZXguanM/NzgwZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTtBQUNiLGlCQUFpQixtQkFBTyxDQUFDLDBCQUFVO0FBQ25DLHNCQUFzQixtQkFBTyxDQUFDLDhFQUF3QjtBQUN0RCxjQUFjLG1CQUFPLENBQUMsZ0VBQWlCOztBQUV2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0MsS0FBSztBQUNyQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQSw2Q0FBNkMsb0VBQVEsSUFBSSxDQUFDO0FBQzFEO0FBQ0E7QUFDQSw2REFBNkQsbUJBQU8sQ0FBQyxrQkFBTSxVQUFVLG1CQUFlLENBQUMsZ0ZBQUk7O0FBRXpHO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1kZWJ1Zy9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbmNvbnN0IGxvY2FsU2hvcnRjdXQgPSByZXF1aXJlKCdlbGVjdHJvbi1sb2NhbHNob3J0Y3V0Jyk7XG5jb25zdCBpc0RldiA9IHJlcXVpcmUoJ2VsZWN0cm9uLWlzLWRldicpO1xuXG5jb25zdCBhcHAgPSBlbGVjdHJvbi5hcHA7XG5jb25zdCBCcm93c2VyV2luZG93ID0gZWxlY3Ryb24uQnJvd3NlcldpbmRvdztcbmNvbnN0IGlzTWFjT1MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJztcblxuZnVuY3Rpb24gZGV2VG9vbHMod2luKSB7XG5cdHdpbiA9IHdpbiB8fCBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKTtcblxuXHRpZiAod2luKSB7XG5cdFx0d2luLnRvZ2dsZURldlRvb2xzKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb3BlbkRldlRvb2xzKHdpbiwgc2hvd0RldlRvb2xzKSB7XG5cdHdpbiA9IHdpbiB8fCBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKTtcblxuXHRpZiAod2luKSB7XG5cdFx0Y29uc3QgbW9kZSA9IHNob3dEZXZUb29scyA9PT0gdHJ1ZSA/IHVuZGVmaW5lZCA6IHNob3dEZXZUb29scztcblx0XHR3aW4ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKHttb2RlfSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVmcmVzaCh3aW4pIHtcblx0d2luID0gd2luIHx8IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXG5cdGlmICh3aW4pIHtcblx0XHR3aW4ud2ViQ29udGVudHMucmVsb2FkSWdub3JpbmdDYWNoZSgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGluc3BlY3RFbGVtZW50cygpIHtcblx0Y29uc3Qgd2luID0gQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cdGNvbnN0IGluc3BlY3QgPSAoKSA9PiB7XG5cdFx0d2luLmRldlRvb2xzV2ViQ29udGVudHMuZXhlY3V0ZUphdmFTY3JpcHQoJ0RldlRvb2xzQVBJLmVudGVySW5zcGVjdEVsZW1lbnRNb2RlKCknKTtcblx0fTtcblxuXHRpZiAod2luKSB7XG5cdFx0aWYgKHdpbi53ZWJDb250ZW50cy5pc0RldlRvb2xzT3BlbmVkKCkpIHtcblx0XHRcdGluc3BlY3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luLndlYkNvbnRlbnRzLm9uKCdkZXZ0b29scy1vcGVuZWQnLCBpbnNwZWN0KTtcblx0XHRcdHdpbi5vcGVuRGV2VG9vbHMoKTtcblx0XHR9XG5cdH1cbn1cblxuY29uc3QgYWRkRXh0ZW5zaW9uSWZJbnN0YWxsZWQgPSAobmFtZSwgZ2V0UGF0aCkgPT4ge1xuXHRjb25zdCBpc0V4dGVuc2lvbkluc3RhbGxlZCA9IG5hbWUgPT4ge1xuXHRcdHJldHVybiBCcm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucyAmJlxuXHRcdFx0e30uaGFzT3duUHJvcGVydHkuY2FsbChCcm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucygpLCBuYW1lKTtcblx0fTtcblxuXHR0cnkge1xuXHRcdGlmICghaXNFeHRlbnNpb25JbnN0YWxsZWQobmFtZSkpIHtcblx0XHRcdEJyb3dzZXJXaW5kb3cuYWRkRGV2VG9vbHNFeHRlbnNpb24oZ2V0UGF0aChuYW1lKSk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnIpIHt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdHMgPT4ge1xuXHRvcHRzID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0ZW5hYmxlZDogbnVsbCxcblx0XHRzaG93RGV2VG9vbHM6IGZhbHNlXG5cdH0sIG9wdHMpO1xuXG5cdGlmIChvcHRzLmVuYWJsZWQgPT09IGZhbHNlIHx8IChvcHRzLmVuYWJsZWQgPT09IG51bGwgJiYgIWlzRGV2KSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGFwcC5vbignYnJvd3Nlci13aW5kb3ctY3JlYXRlZCcsIChlLCB3aW4pID0+IHtcblx0XHRpZiAob3B0cy5zaG93RGV2VG9vbHMpIHtcblx0XHRcdG9wZW5EZXZUb29scyh3aW4sIG9wdHMuc2hvd0RldlRvb2xzKTtcblx0XHR9XG5cdH0pO1xuXG5cdGFwcC5vbigncmVhZHknLCAoKSA9PiB7XG5cdFx0YWRkRXh0ZW5zaW9uSWZJbnN0YWxsZWQoJ2RldnRyb24nLCBuYW1lID0+IHJlcXVpcmUobmFtZSkucGF0aCk7XG5cdFx0Ly8gVE9ETzogVXNlIHRoaXMgd2hlbiBodHRwczovL2dpdGh1Yi5jb20vZmlyZWp1bmUvZWxlY3Ryb24tcmVhY3QtZGV2dG9vbHMvcHVsbC82IGlzIG91dFxuXHRcdC8vIGFkZEV4dGVuc2lvbklmSW5zdGFsbGVkKCdlbGVjdHJvbi1yZWFjdC1kZXZ0b29scycsIG5hbWUgPT4gcmVxdWlyZShuYW1lKS5wYXRoKTtcblx0XHRhZGRFeHRlbnNpb25JZkluc3RhbGxlZCgnZWxlY3Ryb24tcmVhY3QtZGV2dG9vbHMnLCBuYW1lID0+IHJlcXVpcmUoJ3BhdGgnKS5kaXJuYW1lKHJlcXVpcmUucmVzb2x2ZShuYW1lKSkpO1xuXG5cdFx0bG9jYWxTaG9ydGN1dC5yZWdpc3RlcignQ21kT3JDdHJsK1NoaWZ0K0MnLCBpbnNwZWN0RWxlbWVudHMpO1xuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoaXNNYWNPUyA/ICdDbWQrQWx0K0knIDogJ0N0cmwrU2hpZnQrSScsIGRldlRvb2xzKTtcblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKCdGMTInLCBkZXZUb29scyk7XG5cblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKCdDbWRPckN0cmwrUicsIHJlZnJlc2gpO1xuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoJ0Y1JywgcmVmcmVzaCk7XG5cdH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMucmVmcmVzaCA9IHJlZnJlc2g7XG5tb2R1bGUuZXhwb3J0cy5kZXZUb29scyA9IGRldlRvb2xzO1xubW9kdWxlLmV4cG9ydHMub3BlbkRldlRvb2xzID0gb3BlbkRldlRvb2xzO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-debug/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-accelerator/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/electron-is-accelerator/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;\nconst keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;\n\nmodule.exports = function (str) {\n\tlet parts = str.split(\"+\");\n\tlet keyFound = false;\n    return parts.every((val, index) => {\n\t\tconst isKey = keyCodes.test(val);\n\t\tconst isModifier = modifiers.test(val);\n\t\tif (isKey) {\n\t\t\t// Key must be unique\n\t\t\tif (keyFound) return false;\n\t\t\tkeyFound = true;\n\t\t}\n\t\t// Key is required\n\t\tif (index === parts.length - 1 && !keyFound) return false;\n        return isKey || isModifier;\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanM/YTQ4OCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBLDZDQUE2QyxFQUFFLEVBQUU7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgbW9kaWZpZXJzID0gL14oQ29tbWFuZHxDbWR8Q29udHJvbHxDdHJsfENvbW1hbmRPckNvbnRyb2x8Q21kT3JDdHJsfEFsdHxPcHRpb258QWx0R3J8U2hpZnR8U3VwZXIpJC87XG5jb25zdCBrZXlDb2RlcyA9IC9eKFswLTlBLVopIUAjJCVeJiooOis8Xz4/fnt8fVwiOz0sXFwtLi9gW1xcXFxcXF0nXXxGMSpbMS05XXxGMTB8RjJbMC00XXxQbHVzfFNwYWNlfFRhYnxCYWNrc3BhY2V8RGVsZXRlfEluc2VydHxSZXR1cm58RW50ZXJ8VXB8RG93bnxMZWZ0fFJpZ2h0fEhvbWV8RW5kfFBhZ2VVcHxQYWdlRG93bnxFc2NhcGV8RXNjfFZvbHVtZVVwfFZvbHVtZURvd258Vm9sdW1lTXV0ZXxNZWRpYU5leHRUcmFja3xNZWRpYVByZXZpb3VzVHJhY2t8TWVkaWFTdG9wfE1lZGlhUGxheVBhdXNlfFByaW50U2NyZWVuKSQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0bGV0IHBhcnRzID0gc3RyLnNwbGl0KFwiK1wiKTtcblx0bGV0IGtleUZvdW5kID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnRzLmV2ZXJ5KCh2YWwsIGluZGV4KSA9PiB7XG5cdFx0Y29uc3QgaXNLZXkgPSBrZXlDb2Rlcy50ZXN0KHZhbCk7XG5cdFx0Y29uc3QgaXNNb2RpZmllciA9IG1vZGlmaWVycy50ZXN0KHZhbCk7XG5cdFx0aWYgKGlzS2V5KSB7XG5cdFx0XHQvLyBLZXkgbXVzdCBiZSB1bmlxdWVcblx0XHRcdGlmIChrZXlGb3VuZCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0a2V5Rm91bmQgPSB0cnVlO1xuXHRcdH1cblx0XHQvLyBLZXkgaXMgcmVxdWlyZWRcblx0XHRpZiAoaW5kZXggPT09IHBhcnRzLmxlbmd0aCAtIDEgJiYgIWtleUZvdW5kKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBpc0tleSB8fCBpc01vZGlmaWVyO1xuICAgIH0pO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-is-accelerator/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-dev/index.js":
/*!***********************************************!*\
  !*** ./node_modules/electron-is-dev/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;\nconst isEnvSet = 'ELECTRON_IS_DEV' in process.env;\n\nmodule.exports = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\\\/]electron[\\\\/]/.test(process.execPath));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtZGV2L2luZGV4LmpzPzczZDUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWE7QUFDYjtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWRldi9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmNvbnN0IGdldEZyb21FbnYgPSBwYXJzZUludChwcm9jZXNzLmVudi5FTEVDVFJPTl9JU19ERVYsIDEwKSA9PT0gMTtcbmNvbnN0IGlzRW52U2V0ID0gJ0VMRUNUUk9OX0lTX0RFVicgaW4gcHJvY2Vzcy5lbnY7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbnZTZXQgPyBnZXRGcm9tRW52IDogKHByb2Nlc3MuZGVmYXVsdEFwcCB8fCAvbm9kZV9tb2R1bGVzW1xcXFwvXWVsZWN0cm9uW1xcXFwvXS8udGVzdChwcm9jZXNzLmV4ZWNQYXRoKSk7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-is-dev/index.js\n");

/***/ }),

/***/ "./node_modules/electron-localshortcut/index.js":
/*!******************************************************!*\
  !*** ./node_modules/electron-localshortcut/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst {app, BrowserWindow} = __webpack_require__(/*! electron */ \"electron\");\nconst isAccelerator = __webpack_require__(/*! electron-is-accelerator */ \"./node_modules/electron-is-accelerator/index.js\");\nconst equals = __webpack_require__(/*! keyboardevents-areequal */ \"./node_modules/keyboardevents-areequal/index.js\");\nconst {toKeyEvent} = __webpack_require__(/*! keyboardevent-from-electron-accelerator */ \"./node_modules/keyboardevent-from-electron-accelerator/index.js\");\nconst _debug = __webpack_require__(/*! debug */ \"./node_modules/debug/src/index.js\");\n\nconst debug = _debug('electron-localshortcut');\n\n// A placeholder to register shortcuts\n// on any window of the app.\nconst ANY_WINDOW = {};\n\nconst windowsWithShortcuts = new WeakMap();\n\nconst title = win => {\n\tif (win) {\n\t\ttry {\n\t\t\treturn win.getTitle();\n\t\t} catch (err) {\n\t\t\treturn 'A destroyed window';\n\t\t}\n\t}\n\n\treturn 'An falsy value';\n};\n\nfunction _checkAccelerator(accelerator) {\n\tif (!isAccelerator(accelerator)) {\n\t\tconst w = {};\n\t\tError.captureStackTrace(w);\n\t\tconst msg = `\nWARNING: ${accelerator} is not a valid accelerator.\n\n${w.stack\n\t\t\t.split('\\n')\n\t\t\t.slice(4)\n\t\t\t.join('\\n')}\n`;\n\t\tconsole.error(msg);\n\t}\n}\n\n/**\n * Disable all of the shortcuts registered on the BrowserWindow instance.\n * Registered shortcuts no more works on the `window` instance, but the module\n * keep a reference on them. You can reactivate them later by calling `enableAll`\n * method on the same window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction disableAll(win) {\n\tdebug(`Disabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = false;\n\t}\n}\n\n/**\n * Enable all of the shortcuts registered on the BrowserWindow instance that\n * you had previously disabled calling `disableAll` method.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction enableAll(win) {\n\tdebug(`Enabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = true;\n\t}\n}\n\n/**\n * Unregisters all of the shortcuts registered on any focused BrowserWindow\n * instance. This method does not unregister any shortcut you registered on\n * a particular window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction unregisterAll(win) {\n\tdebug(`Unregistering all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\t// Remove listener from window\n\tshortcutsOfWindow.removeListener();\n\n\twindowsWithShortcuts.delete(wc);\n}\n\nfunction _normalizeEvent(input) {\n\tconst normalizedEvent = {\n\t\tcode: input.code,\n\t\tkey: input.key\n\t};\n\n\t['alt', 'shift', 'meta'].forEach(prop => {\n\t\tif (typeof input[prop] !== 'undefined') {\n\t\t\tnormalizedEvent[`${prop}Key`] = input[prop];\n\t\t}\n\t});\n\n\tif (typeof input.control !== 'undefined') {\n\t\tnormalizedEvent.ctrlKey = input.control;\n\t}\n\n\treturn normalizedEvent;\n}\n\nfunction _findShortcut(event, shortcutsOfWindow) {\n\tlet i = 0;\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tif (equals(shortcut.eventStamp, event)) {\n\t\t\treturn i;\n\t\t}\n\t\ti++;\n\t}\n\treturn -1;\n}\n\nconst _onBeforeInput = shortcutsOfWindow => (e, input) => {\n\tif (input.type === 'keyUp') {\n\t\treturn;\n\t}\n\n\tconst event = _normalizeEvent(input);\n\n\tdebug(`before-input-event: ${input} is translated to: ${event}`);\n\tfor (const {eventStamp, callback} of shortcutsOfWindow) {\n\t\tif (equals(eventStamp, event)) {\n\t\t\tdebug(`eventStamp: ${eventStamp} match`);\n\t\t\tcallback();\n\t\t\treturn;\n\t\t}\n\t\tdebug(`eventStamp: ${eventStamp} no match`);\n\t}\n};\n\n/**\n* Registers the shortcut `accelerator`on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to register.\n * This argument could be omitted, in this case the function register\n * the shortcut on all app windows.\n * @param  {String} accelerator - the shortcut to register\n * @param  {Function} callback    This function is called when the shortcut is pressed\n * and the window is focused and not minimized.\n * @return {Undefined}\n */\nfunction register(win, accelerator, callback) {\n\tlet wc;\n\tif (typeof callback === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\tcallback = accelerator;\n\t\taccelerator = win;\n\t} else {\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Registering callback for ${accelerator} on window ${title(win)}`);\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tlet shortcutsOfWindow;\n\tif (windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Window has others shortcuts registered.`);\n\t\tshortcutsOfWindow = windowsWithShortcuts.get(wc);\n\t} else {\n\t\tdebug(`This is the first shortcut of the window.`);\n\t\tshortcutsOfWindow = [];\n\t\twindowsWithShortcuts.set(wc, shortcutsOfWindow);\n\n\t\tif (wc === ANY_WINDOW) {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\tconst enableAppShortcuts = (e, win) => {\n\t\t\t\tconst wc = win.webContents;\n\t\t\t\twc.on('before-input-event', keyHandler);\n\t\t\t\twc.once('closed', () =>\n\t\t\t\t\twc.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t};\n\n\t\t\t// Enable shortcut on current windows\n\t\t\tconst windows = BrowserWindow.getAllWindows();\n\n\t\t\twindows.forEach(win => enableAppShortcuts(null, win));\n\n\t\t\t// Enable shortcut on future windows\n\t\t\tapp.on('browser-window-created', enableAppShortcuts);\n\n\t\t\tshortcutsOfWindow.removeListener = () => {\n\t\t\t\tconst windows = BrowserWindow.getAllWindows();\n\t\t\t\twindows.forEach(win =>\n\t\t\t\t\twin.webContents.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t\tapp.removeListener('browser-window-created', enableAppShortcuts);\n\t\t\t};\n\t\t} else {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\twc.on('before-input-event', keyHandler);\n\n\t\t\t// Save a reference to allow remove of listener from elsewhere\n\t\t\tshortcutsOfWindow.removeListener = () =>\n\t\t\t\twc.removeListener('before-input-event', keyHandler);\n\t\t\twc.once('closed', shortcutsOfWindow.removeListener);\n\t\t}\n\t}\n\n\tdebug(`Adding shortcut to window set.`);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\n\tshortcutsOfWindow.push({\n\t\teventStamp,\n\t\tcallback,\n\t\tenabled: true\n\t});\n\n\tdebug(`Shortcut registered.`);\n}\n\n/**\n * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to unregister.\n * This argument could be omitted, in this case the function unregister the shortcut\n * on all app windows. If you registered the shortcut on a particular window instance, it will do nothing.\n * @param  {String} accelerator - the shortcut to unregister\n * @return {Undefined}\n */\nfunction unregister(win, accelerator) {\n\tlet wc;\n\tif (typeof accelerator === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\taccelerator = win;\n\t} else {\n\t\tif (win.isDestroyed()) {\n\t\t\tdebug(`Early return because window is destroyed.`);\n\t\t\treturn;\n\t\t}\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Unregistering callback for ${accelerator} on window ${title(win)}`);\n\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tif (!windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Early return because window has never had shortcuts registered.`);\n\t\treturn;\n\t}\n\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\tconst shortcutIdx = _findShortcut(eventStamp, shortcutsOfWindow);\n\tif (shortcutIdx === -1) {\n\t\treturn;\n\t}\n\n\tshortcutsOfWindow.splice(shortcutIdx, 1);\n\n\t// If the window has no more shortcuts,\n\t// we remove it early from the WeakMap\n\t// and unregistering the event listener\n\tif (shortcutsOfWindow.length === 0) {\n\t\t// Remove listener from window\n\t\tshortcutsOfWindow.removeListener();\n\n\t\t// Remove window from shrtcuts catalog\n\t\twindowsWithShortcuts.delete(wc);\n\t}\n}\n\n/**\n * Returns `true` or `false` depending on whether the shortcut `accelerator`\n * is registered on `window`.\n * @param  {BrowserWindow} win - BrowserWindow instance to check. This argument\n * could be omitted, in this case the function returns whether the shortcut\n * `accelerator` is registered on all app windows. If you registered the\n * shortcut on a particular window instance, it return false.\n * @param  {String} accelerator - the shortcut to check\n * @return {Boolean} - if the shortcut `accelerator` is registered on `window`.\n */\nfunction isRegistered(win, accelerator) {\n\t_checkAccelerator(accelerator);\n}\n\nmodule.exports = {\n\tregister,\n\tunregister,\n\tisRegistered,\n\tunregisterAll,\n\tenableAll,\n\tdisableAll\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9jYWxzaG9ydGN1dC9pbmRleC5qcz8xZGJhIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhO0FBQ2IsT0FBTyxtQkFBbUIsR0FBRyxtQkFBTyxDQUFDLDBCQUFVO0FBQy9DLHNCQUFzQixtQkFBTyxDQUFDLGdGQUF5QjtBQUN2RCxlQUFlLG1CQUFPLENBQUMsZ0ZBQXlCO0FBQ2hELE9BQU8sV0FBVyxHQUFHLG1CQUFPLENBQUMsZ0hBQXlDO0FBQ3RFLGVBQWUsbUJBQU8sQ0FBQyxnREFBTzs7QUFFOUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7O0FBRXZCLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVk7QUFDWjtBQUNBO0FBQ0EsNENBQTRDLFdBQVc7QUFDdkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWTtBQUNaO0FBQ0E7QUFDQSwyQ0FBMkMsV0FBVztBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVk7QUFDWjtBQUNBO0FBQ0EsZ0RBQWdELFdBQVc7QUFDM0Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLEtBQUs7QUFDM0I7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLDhCQUE4QixNQUFNLHFCQUFxQixNQUFNO0FBQy9ELGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0Esd0JBQXdCLFdBQVc7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxTQUFTO0FBQ3JCO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUEsbUNBQW1DLFlBQVksYUFBYSxXQUFXO0FBQ3ZFOztBQUVBLFVBQVUsWUFBWTs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksY0FBYztBQUMxQjtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQyxZQUFZLGFBQWEsV0FBVzs7QUFFekU7O0FBRUEsVUFBVSxZQUFZOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jb25zdCB7YXBwLCBCcm93c2VyV2luZG93fSA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7XG5jb25zdCBpc0FjY2VsZXJhdG9yID0gcmVxdWlyZSgnZWxlY3Ryb24taXMtYWNjZWxlcmF0b3InKTtcbmNvbnN0IGVxdWFscyA9IHJlcXVpcmUoJ2tleWJvYXJkZXZlbnRzLWFyZWVxdWFsJyk7XG5jb25zdCB7dG9LZXlFdmVudH0gPSByZXF1aXJlKCdrZXlib2FyZGV2ZW50LWZyb20tZWxlY3Ryb24tYWNjZWxlcmF0b3InKTtcbmNvbnN0IF9kZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdlbGVjdHJvbi1sb2NhbHNob3J0Y3V0Jyk7XG5cbi8vIEEgcGxhY2Vob2xkZXIgdG8gcmVnaXN0ZXIgc2hvcnRjdXRzXG4vLyBvbiBhbnkgd2luZG93IG9mIHRoZSBhcHAuXG5jb25zdCBBTllfV0lORE9XID0ge307XG5cbmNvbnN0IHdpbmRvd3NXaXRoU2hvcnRjdXRzID0gbmV3IFdlYWtNYXAoKTtcblxuY29uc3QgdGl0bGUgPSB3aW4gPT4ge1xuXHRpZiAod2luKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiB3aW4uZ2V0VGl0bGUoKTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiAnQSBkZXN0cm95ZWQgd2luZG93Jztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gJ0FuIGZhbHN5IHZhbHVlJztcbn07XG5cbmZ1bmN0aW9uIF9jaGVja0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKSB7XG5cdGlmICghaXNBY2NlbGVyYXRvcihhY2NlbGVyYXRvcikpIHtcblx0XHRjb25zdCB3ID0ge307XG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2Uodyk7XG5cdFx0Y29uc3QgbXNnID0gYFxuV0FSTklORzogJHthY2NlbGVyYXRvcn0gaXMgbm90IGEgdmFsaWQgYWNjZWxlcmF0b3IuXG5cbiR7dy5zdGFja1xuXHRcdFx0LnNwbGl0KCdcXG4nKVxuXHRcdFx0LnNsaWNlKDQpXG5cdFx0XHQuam9pbignXFxuJyl9XG5gO1xuXHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0fVxufVxuXG4vKipcbiAqIERpc2FibGUgYWxsIG9mIHRoZSBzaG9ydGN1dHMgcmVnaXN0ZXJlZCBvbiB0aGUgQnJvd3NlcldpbmRvdyBpbnN0YW5jZS5cbiAqIFJlZ2lzdGVyZWQgc2hvcnRjdXRzIG5vIG1vcmUgd29ya3Mgb24gdGhlIGB3aW5kb3dgIGluc3RhbmNlLCBidXQgdGhlIG1vZHVsZVxuICoga2VlcCBhIHJlZmVyZW5jZSBvbiB0aGVtLiBZb3UgY2FuIHJlYWN0aXZhdGUgdGhlbSBsYXRlciBieSBjYWxsaW5nIGBlbmFibGVBbGxgXG4gKiBtZXRob2Qgb24gdGhlIHNhbWUgd2luZG93IGluc3RhbmNlLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2VcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gZGlzYWJsZUFsbCh3aW4pIHtcblx0ZGVidWcoYERpc2FibGluZyBhbGwgc2hvcnRjdXRzIG9uIHdpbmRvdyAke3RpdGxlKHdpbil9YCk7XG5cdGNvbnN0IHdjID0gd2luLndlYkNvbnRlbnRzO1xuXHRjb25zdCBzaG9ydGN1dHNPZldpbmRvdyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3Yyk7XG5cblx0Zm9yIChjb25zdCBzaG9ydGN1dCBvZiBzaG9ydGN1dHNPZldpbmRvdykge1xuXHRcdHNob3J0Y3V0LmVuYWJsZWQgPSBmYWxzZTtcblx0fVxufVxuXG4vKipcbiAqIEVuYWJsZSBhbGwgb2YgdGhlIHNob3J0Y3V0cyByZWdpc3RlcmVkIG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlIHRoYXRcbiAqIHlvdSBoYWQgcHJldmlvdXNseSBkaXNhYmxlZCBjYWxsaW5nIGBkaXNhYmxlQWxsYCBtZXRob2QuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gQnJvd3NlcldpbmRvdyBpbnN0YW5jZVxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiBlbmFibGVBbGwod2luKSB7XG5cdGRlYnVnKGBFbmFibGluZyBhbGwgc2hvcnRjdXRzIG9uIHdpbmRvdyAke3RpdGxlKHdpbil9YCk7XG5cdGNvbnN0IHdjID0gd2luLndlYkNvbnRlbnRzO1xuXHRjb25zdCBzaG9ydGN1dHNPZldpbmRvdyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3Yyk7XG5cblx0Zm9yIChjb25zdCBzaG9ydGN1dCBvZiBzaG9ydGN1dHNPZldpbmRvdykge1xuXHRcdHNob3J0Y3V0LmVuYWJsZWQgPSB0cnVlO1xuXHR9XG59XG5cbi8qKlxuICogVW5yZWdpc3RlcnMgYWxsIG9mIHRoZSBzaG9ydGN1dHMgcmVnaXN0ZXJlZCBvbiBhbnkgZm9jdXNlZCBCcm93c2VyV2luZG93XG4gKiBpbnN0YW5jZS4gVGhpcyBtZXRob2QgZG9lcyBub3QgdW5yZWdpc3RlciBhbnkgc2hvcnRjdXQgeW91IHJlZ2lzdGVyZWQgb25cbiAqIGEgcGFydGljdWxhciB3aW5kb3cgaW5zdGFuY2UuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gQnJvd3NlcldpbmRvdyBpbnN0YW5jZVxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiB1bnJlZ2lzdGVyQWxsKHdpbikge1xuXHRkZWJ1ZyhgVW5yZWdpc3RlcmluZyBhbGwgc2hvcnRjdXRzIG9uIHdpbmRvdyAke3RpdGxlKHdpbil9YCk7XG5cdGNvbnN0IHdjID0gd2luLndlYkNvbnRlbnRzO1xuXHRjb25zdCBzaG9ydGN1dHNPZldpbmRvdyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3Yyk7XG5cblx0Ly8gUmVtb3ZlIGxpc3RlbmVyIGZyb20gd2luZG93XG5cdHNob3J0Y3V0c09mV2luZG93LnJlbW92ZUxpc3RlbmVyKCk7XG5cblx0d2luZG93c1dpdGhTaG9ydGN1dHMuZGVsZXRlKHdjKTtcbn1cblxuZnVuY3Rpb24gX25vcm1hbGl6ZUV2ZW50KGlucHV0KSB7XG5cdGNvbnN0IG5vcm1hbGl6ZWRFdmVudCA9IHtcblx0XHRjb2RlOiBpbnB1dC5jb2RlLFxuXHRcdGtleTogaW5wdXQua2V5XG5cdH07XG5cblx0WydhbHQnLCAnc2hpZnQnLCAnbWV0YSddLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0aWYgKHR5cGVvZiBpbnB1dFtwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdG5vcm1hbGl6ZWRFdmVudFtgJHtwcm9wfUtleWBdID0gaW5wdXRbcHJvcF07XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAodHlwZW9mIGlucHV0LmNvbnRyb2wgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0bm9ybWFsaXplZEV2ZW50LmN0cmxLZXkgPSBpbnB1dC5jb250cm9sO1xuXHR9XG5cblx0cmV0dXJuIG5vcm1hbGl6ZWRFdmVudDtcbn1cblxuZnVuY3Rpb24gX2ZpbmRTaG9ydGN1dChldmVudCwgc2hvcnRjdXRzT2ZXaW5kb3cpIHtcblx0bGV0IGkgPSAwO1xuXHRmb3IgKGNvbnN0IHNob3J0Y3V0IG9mIHNob3J0Y3V0c09mV2luZG93KSB7XG5cdFx0aWYgKGVxdWFscyhzaG9ydGN1dC5ldmVudFN0YW1wLCBldmVudCkpIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0XHRpKys7XG5cdH1cblx0cmV0dXJuIC0xO1xufVxuXG5jb25zdCBfb25CZWZvcmVJbnB1dCA9IHNob3J0Y3V0c09mV2luZG93ID0+IChlLCBpbnB1dCkgPT4ge1xuXHRpZiAoaW5wdXQudHlwZSA9PT0gJ2tleVVwJykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGV2ZW50ID0gX25vcm1hbGl6ZUV2ZW50KGlucHV0KTtcblxuXHRkZWJ1ZyhgYmVmb3JlLWlucHV0LWV2ZW50OiAke2lucHV0fSBpcyB0cmFuc2xhdGVkIHRvOiAke2V2ZW50fWApO1xuXHRmb3IgKGNvbnN0IHtldmVudFN0YW1wLCBjYWxsYmFja30gb2Ygc2hvcnRjdXRzT2ZXaW5kb3cpIHtcblx0XHRpZiAoZXF1YWxzKGV2ZW50U3RhbXAsIGV2ZW50KSkge1xuXHRcdFx0ZGVidWcoYGV2ZW50U3RhbXA6ICR7ZXZlbnRTdGFtcH0gbWF0Y2hgKTtcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGRlYnVnKGBldmVudFN0YW1wOiAke2V2ZW50U3RhbXB9IG5vIG1hdGNoYCk7XG5cdH1cbn07XG5cbi8qKlxuKiBSZWdpc3RlcnMgdGhlIHNob3J0Y3V0IGBhY2NlbGVyYXRvcmBvbiB0aGUgQnJvd3NlcldpbmRvdyBpbnN0YW5jZS5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiAtIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UgdG8gcmVnaXN0ZXIuXG4gKiBUaGlzIGFyZ3VtZW50IGNvdWxkIGJlIG9taXR0ZWQsIGluIHRoaXMgY2FzZSB0aGUgZnVuY3Rpb24gcmVnaXN0ZXJcbiAqIHRoZSBzaG9ydGN1dCBvbiBhbGwgYXBwIHdpbmRvd3MuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGFjY2VsZXJhdG9yIC0gdGhlIHNob3J0Y3V0IHRvIHJlZ2lzdGVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgICAgVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgc2hvcnRjdXQgaXMgcHJlc3NlZFxuICogYW5kIHRoZSB3aW5kb3cgaXMgZm9jdXNlZCBhbmQgbm90IG1pbmltaXplZC5cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXIod2luLCBhY2NlbGVyYXRvciwgY2FsbGJhY2spIHtcblx0bGV0IHdjO1xuXHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSAndW5kZWZpbmVkJykge1xuXHRcdHdjID0gQU5ZX1dJTkRPVztcblx0XHRjYWxsYmFjayA9IGFjY2VsZXJhdG9yO1xuXHRcdGFjY2VsZXJhdG9yID0gd2luO1xuXHR9IGVsc2Uge1xuXHRcdHdjID0gd2luLndlYkNvbnRlbnRzO1xuXHR9XG5cblx0ZGVidWcoYFJlZ2lzdGVyaW5nIGNhbGxiYWNrIGZvciAke2FjY2VsZXJhdG9yfSBvbiB3aW5kb3cgJHt0aXRsZSh3aW4pfWApO1xuXHRfY2hlY2tBY2NlbGVyYXRvcihhY2NlbGVyYXRvcik7XG5cblx0ZGVidWcoYCR7YWNjZWxlcmF0b3J9IHNlZW1zIGEgdmFsaWQgc2hvcnRjdXQgc2VxdWVuY2UuYCk7XG5cblx0bGV0IHNob3J0Y3V0c09mV2luZG93O1xuXHRpZiAod2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKHdjKSkge1xuXHRcdGRlYnVnKGBXaW5kb3cgaGFzIG90aGVycyBzaG9ydGN1dHMgcmVnaXN0ZXJlZC5gKTtcblx0XHRzaG9ydGN1dHNPZldpbmRvdyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3Yyk7XG5cdH0gZWxzZSB7XG5cdFx0ZGVidWcoYFRoaXMgaXMgdGhlIGZpcnN0IHNob3J0Y3V0IG9mIHRoZSB3aW5kb3cuYCk7XG5cdFx0c2hvcnRjdXRzT2ZXaW5kb3cgPSBbXTtcblx0XHR3aW5kb3dzV2l0aFNob3J0Y3V0cy5zZXQod2MsIHNob3J0Y3V0c09mV2luZG93KTtcblxuXHRcdGlmICh3YyA9PT0gQU5ZX1dJTkRPVykge1xuXHRcdFx0Y29uc3Qga2V5SGFuZGxlciA9IF9vbkJlZm9yZUlucHV0KHNob3J0Y3V0c09mV2luZG93KTtcblx0XHRcdGNvbnN0IGVuYWJsZUFwcFNob3J0Y3V0cyA9IChlLCB3aW4pID0+IHtcblx0XHRcdFx0Y29uc3Qgd2MgPSB3aW4ud2ViQ29udGVudHM7XG5cdFx0XHRcdHdjLm9uKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBrZXlIYW5kbGVyKTtcblx0XHRcdFx0d2Mub25jZSgnY2xvc2VkJywgKCkgPT5cblx0XHRcdFx0XHR3Yy5yZW1vdmVMaXN0ZW5lcignYmVmb3JlLWlucHV0LWV2ZW50Jywga2V5SGFuZGxlcilcblx0XHRcdFx0KTtcblx0XHRcdH07XG5cblx0XHRcdC8vIEVuYWJsZSBzaG9ydGN1dCBvbiBjdXJyZW50IHdpbmRvd3Ncblx0XHRcdGNvbnN0IHdpbmRvd3MgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKTtcblxuXHRcdFx0d2luZG93cy5mb3JFYWNoKHdpbiA9PiBlbmFibGVBcHBTaG9ydGN1dHMobnVsbCwgd2luKSk7XG5cblx0XHRcdC8vIEVuYWJsZSBzaG9ydGN1dCBvbiBmdXR1cmUgd2luZG93c1xuXHRcdFx0YXBwLm9uKCdicm93c2VyLXdpbmRvdy1jcmVhdGVkJywgZW5hYmxlQXBwU2hvcnRjdXRzKTtcblxuXHRcdFx0c2hvcnRjdXRzT2ZXaW5kb3cucmVtb3ZlTGlzdGVuZXIgPSAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHdpbmRvd3MgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKTtcblx0XHRcdFx0d2luZG93cy5mb3JFYWNoKHdpbiA9PlxuXHRcdFx0XHRcdHdpbi53ZWJDb250ZW50cy5yZW1vdmVMaXN0ZW5lcignYmVmb3JlLWlucHV0LWV2ZW50Jywga2V5SGFuZGxlcilcblx0XHRcdFx0KTtcblx0XHRcdFx0YXBwLnJlbW92ZUxpc3RlbmVyKCdicm93c2VyLXdpbmRvdy1jcmVhdGVkJywgZW5hYmxlQXBwU2hvcnRjdXRzKTtcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGtleUhhbmRsZXIgPSBfb25CZWZvcmVJbnB1dChzaG9ydGN1dHNPZldpbmRvdyk7XG5cdFx0XHR3Yy5vbignYmVmb3JlLWlucHV0LWV2ZW50Jywga2V5SGFuZGxlcik7XG5cblx0XHRcdC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gYWxsb3cgcmVtb3ZlIG9mIGxpc3RlbmVyIGZyb20gZWxzZXdoZXJlXG5cdFx0XHRzaG9ydGN1dHNPZldpbmRvdy5yZW1vdmVMaXN0ZW5lciA9ICgpID0+XG5cdFx0XHRcdHdjLnJlbW92ZUxpc3RlbmVyKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBrZXlIYW5kbGVyKTtcblx0XHRcdHdjLm9uY2UoJ2Nsb3NlZCcsIHNob3J0Y3V0c09mV2luZG93LnJlbW92ZUxpc3RlbmVyKTtcblx0XHR9XG5cdH1cblxuXHRkZWJ1ZyhgQWRkaW5nIHNob3J0Y3V0IHRvIHdpbmRvdyBzZXQuYCk7XG5cblx0Y29uc3QgZXZlbnRTdGFtcCA9IHRvS2V5RXZlbnQoYWNjZWxlcmF0b3IpO1xuXG5cdHNob3J0Y3V0c09mV2luZG93LnB1c2goe1xuXHRcdGV2ZW50U3RhbXAsXG5cdFx0Y2FsbGJhY2ssXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHR9KTtcblxuXHRkZWJ1ZyhgU2hvcnRjdXQgcmVnaXN0ZXJlZC5gKTtcbn1cblxuLyoqXG4gKiBVbnJlZ2lzdGVycyB0aGUgc2hvcnRjdXQgb2YgYGFjY2VsZXJhdG9yYCByZWdpc3RlcmVkIG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIC0gQnJvd3NlcldpbmRvdyBpbnN0YW5jZSB0byB1bnJlZ2lzdGVyLlxuICogVGhpcyBhcmd1bWVudCBjb3VsZCBiZSBvbWl0dGVkLCBpbiB0aGlzIGNhc2UgdGhlIGZ1bmN0aW9uIHVucmVnaXN0ZXIgdGhlIHNob3J0Y3V0XG4gKiBvbiBhbGwgYXBwIHdpbmRvd3MuIElmIHlvdSByZWdpc3RlcmVkIHRoZSBzaG9ydGN1dCBvbiBhIHBhcnRpY3VsYXIgd2luZG93IGluc3RhbmNlLCBpdCB3aWxsIGRvIG5vdGhpbmcuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGFjY2VsZXJhdG9yIC0gdGhlIHNob3J0Y3V0IHRvIHVucmVnaXN0ZXJcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gdW5yZWdpc3Rlcih3aW4sIGFjY2VsZXJhdG9yKSB7XG5cdGxldCB3Yztcblx0aWYgKHR5cGVvZiBhY2NlbGVyYXRvciA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR3YyA9IEFOWV9XSU5ET1c7XG5cdFx0YWNjZWxlcmF0b3IgPSB3aW47XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHdpbi5pc0Rlc3Ryb3llZCgpKSB7XG5cdFx0XHRkZWJ1ZyhgRWFybHkgcmV0dXJuIGJlY2F1c2Ugd2luZG93IGlzIGRlc3Ryb3llZC5gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0d2MgPSB3aW4ud2ViQ29udGVudHM7XG5cdH1cblxuXHRkZWJ1ZyhgVW5yZWdpc3RlcmluZyBjYWxsYmFjayBmb3IgJHthY2NlbGVyYXRvcn0gb24gd2luZG93ICR7dGl0bGUod2luKX1gKTtcblxuXHRfY2hlY2tBY2NlbGVyYXRvcihhY2NlbGVyYXRvcik7XG5cblx0ZGVidWcoYCR7YWNjZWxlcmF0b3J9IHNlZW1zIGEgdmFsaWQgc2hvcnRjdXQgc2VxdWVuY2UuYCk7XG5cblx0aWYgKCF3aW5kb3dzV2l0aFNob3J0Y3V0cy5oYXMod2MpKSB7XG5cdFx0ZGVidWcoYEVhcmx5IHJldHVybiBiZWNhdXNlIHdpbmRvdyBoYXMgbmV2ZXIgaGFkIHNob3J0Y3V0cyByZWdpc3RlcmVkLmApO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IHNob3J0Y3V0c09mV2luZG93ID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdjKTtcblxuXHRjb25zdCBldmVudFN0YW1wID0gdG9LZXlFdmVudChhY2NlbGVyYXRvcik7XG5cdGNvbnN0IHNob3J0Y3V0SWR4ID0gX2ZpbmRTaG9ydGN1dChldmVudFN0YW1wLCBzaG9ydGN1dHNPZldpbmRvdyk7XG5cdGlmIChzaG9ydGN1dElkeCA9PT0gLTEpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzaG9ydGN1dHNPZldpbmRvdy5zcGxpY2Uoc2hvcnRjdXRJZHgsIDEpO1xuXG5cdC8vIElmIHRoZSB3aW5kb3cgaGFzIG5vIG1vcmUgc2hvcnRjdXRzLFxuXHQvLyB3ZSByZW1vdmUgaXQgZWFybHkgZnJvbSB0aGUgV2Vha01hcFxuXHQvLyBhbmQgdW5yZWdpc3RlcmluZyB0aGUgZXZlbnQgbGlzdGVuZXJcblx0aWYgKHNob3J0Y3V0c09mV2luZG93Lmxlbmd0aCA9PT0gMCkge1xuXHRcdC8vIFJlbW92ZSBsaXN0ZW5lciBmcm9tIHdpbmRvd1xuXHRcdHNob3J0Y3V0c09mV2luZG93LnJlbW92ZUxpc3RlbmVyKCk7XG5cblx0XHQvLyBSZW1vdmUgd2luZG93IGZyb20gc2hydGN1dHMgY2F0YWxvZ1xuXHRcdHdpbmRvd3NXaXRoU2hvcnRjdXRzLmRlbGV0ZSh3Yyk7XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBvciBgZmFsc2VgIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBzaG9ydGN1dCBgYWNjZWxlcmF0b3JgXG4gKiBpcyByZWdpc3RlcmVkIG9uIGB3aW5kb3dgLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIC0gQnJvd3NlcldpbmRvdyBpbnN0YW5jZSB0byBjaGVjay4gVGhpcyBhcmd1bWVudFxuICogY291bGQgYmUgb21pdHRlZCwgaW4gdGhpcyBjYXNlIHRoZSBmdW5jdGlvbiByZXR1cm5zIHdoZXRoZXIgdGhlIHNob3J0Y3V0XG4gKiBgYWNjZWxlcmF0b3JgIGlzIHJlZ2lzdGVyZWQgb24gYWxsIGFwcCB3aW5kb3dzLiBJZiB5b3UgcmVnaXN0ZXJlZCB0aGVcbiAqIHNob3J0Y3V0IG9uIGEgcGFydGljdWxhciB3aW5kb3cgaW5zdGFuY2UsIGl0IHJldHVybiBmYWxzZS5cbiAqIEBwYXJhbSAge1N0cmluZ30gYWNjZWxlcmF0b3IgLSB0aGUgc2hvcnRjdXQgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59IC0gaWYgdGhlIHNob3J0Y3V0IGBhY2NlbGVyYXRvcmAgaXMgcmVnaXN0ZXJlZCBvbiBgd2luZG93YC5cbiAqL1xuZnVuY3Rpb24gaXNSZWdpc3RlcmVkKHdpbiwgYWNjZWxlcmF0b3IpIHtcblx0X2NoZWNrQWNjZWxlcmF0b3IoYWNjZWxlcmF0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXIsXG5cdHVucmVnaXN0ZXIsXG5cdGlzUmVnaXN0ZXJlZCxcblx0dW5yZWdpc3RlckFsbCxcblx0ZW5hYmxlQWxsLFxuXHRkaXNhYmxlQWxsXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-localshortcut/index.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _electronDevtoolsInstaller() {\n  const data = _interopRequireWildcard(__webpack_require__(/*! electron-devtools-installer */ \"electron-devtools-installer\"));\n\n  _electronDevtoolsInstaller = function () {\n    return data;\n  };\n\n  return data;\n}\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\n// install vue-devtools\n__webpack_require__(/*! electron */ \"electron\").app.on(\"ready\", () => {\n  (0, _electronDevtoolsInstaller().default)(_electronDevtoolsInstaller().VUEJS_DEVTOOLS).catch(error => {\n    console.log(\"Unable to install `vue-devtools`: \\n\", error);\n  });\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=vue-main-dev-entry.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvY29uZmlndXJhdG9ycy92dWUvdnVlLW1haW4tZGV2LWVudHJ5LmpzP2FlZDciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQSx1Q0FBdUMsbUJBQU8sQ0FBQyxnRUFBNkI7O0FBRTVFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHVDQUF1Qyw2QkFBNkIsWUFBWSxFQUFFLE9BQU8saUJBQWlCLG1CQUFtQix1QkFBdUIsc0RBQXNELHNIQUFzSCw0QkFBNEIsMENBQTBDLEVBQUUsT0FBTyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxzQkFBc0IsZUFBZSxFQUFFOztBQUV0ZDtBQUNBLG1CQUFPLENBQUMsMEJBQVU7QUFDbEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2NvbmZpZ3VyYXRvcnMvdnVlL3Z1ZS1tYWluLWRldi1lbnRyeS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfZWxlY3Ryb25EZXZ0b29sc0luc3RhbGxlcigpIHtcbiAgY29uc3QgZGF0YSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIikpO1xuXG4gIF9lbGVjdHJvbkRldnRvb2xzSW5zdGFsbGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbi8vIGluc3RhbGwgdnVlLWRldnRvb2xzXG5yZXF1aXJlKFwiZWxlY3Ryb25cIikuYXBwLm9uKFwicmVhZHlcIiwgKCkgPT4ge1xuICAoMCwgX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXIoKS5kZWZhdWx0KShfZWxlY3Ryb25EZXZ0b29sc0luc3RhbGxlcigpLlZVRUpTX0RFVlRPT0xTKS5jYXRjaChlcnJvciA9PiB7XG4gICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gaW5zdGFsbCBgdnVlLWRldnRvb2xzYDogXFxuXCIsIGVycm9yKTtcbiAgfSk7XG59KTsgXG4vLyBfX3RzLWJhYmVsQDYuMC40XG4vLyMgc291cmNlTWFwcGluZ1VSTD12dWUtbWFpbi1kZXYtZW50cnkuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./node_modules/keyboardevent-from-electron-accelerator/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/keyboardevent-from-electron-accelerator/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, '__esModule', { value: true });\n\nconst modifiers = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|Alt|Option|AltGr|Shift|Super)/i;\nconst keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]'])/i;\nconst UNSUPPORTED = {};\n\nfunction reduceModifier({accelerator, event}, modifier) {\n\tswitch (modifier) {\n\t\tcase 'command':\n\t\tcase 'cmd': {\n\t\t\tif (process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'super': {\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Super` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'control':\n\t\tcase 'ctrl': {\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'commandorcontrol':\n\t\tcase 'cmdorctrl': {\n\t\t\tif (process.platform === 'darwin') {\n\t\t\t\tif (event.metaKey) {\n\t\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t\t}\n\n\t\t\t\treturn {\n\t\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'option':\n\t\tcase 'altgr':\n\t\tcase 'alt': {\n\t\t\tif (modifier === 'option' && process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.altKey) {\n\t\t\t\tthrow new Error('Double `Alt` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {altKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'shift': {\n\t\t\tif (event.shiftKey) {\n\t\t\t\tthrow new Error('Double `Shift` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {shiftKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\n\t\tdefault:\n\t\t\tconsole.error(modifier);\n\t}\n}\n\nfunction reducePlus({accelerator, event}) {\n\treturn {\n\t\tevent,\n\t\taccelerator: accelerator.trim().slice(1)\n\t};\n}\n\nconst virtualKeyCodes = {\n\t0: 'Digit0',\n\t1: 'Digit1',\n\t2: 'Digit2',\n\t3: 'Digit3',\n\t4: 'Digit4',\n\t5: 'Digit5',\n\t6: 'Digit6',\n\t7: 'Digit7',\n\t8: 'Digit8',\n\t9: 'Digit9',\n\t'-': 'Minus',\n\t'=': 'Equal',\n\tQ: 'KeyQ',\n\tW: 'KeyW',\n\tE: 'KeyE',\n\tR: 'KeyR',\n\tT: 'KeyT',\n\tY: 'KeyY',\n\tU: 'KeyU',\n\tI: 'KeyI',\n\tO: 'KeyO',\n\tP: 'KeyP',\n\t'[': 'BracketLeft',\n\t']': 'BracketRight',\n\tA: 'KeyA',\n\tS: 'KeyS',\n\tD: 'KeyD',\n\tF: 'KeyF',\n\tG: 'KeyG',\n\tH: 'KeyH',\n\tJ: 'KeyJ',\n\tK: 'KeyK',\n\tL: 'KeyL',\n\t';': 'Semicolon',\n\t'\\'': 'Quote',\n\t'`': 'Backquote',\n\t'/': 'Backslash',\n\tZ: 'KeyZ',\n\tX: 'KeyX',\n\tC: 'KeyC',\n\tV: 'KeyV',\n\tB: 'KeyB',\n\tN: 'KeyN',\n\tM: 'KeyM',\n\t',': 'Comma',\n\t'.': 'Period',\n\t'\\\\': 'Slash',\n\t' ': 'Space'\n};\n\nfunction reduceKey({accelerator, event}, key) {\n\tif (key.length > 1 || event.key) {\n\t\tthrow new Error(`Unvalid keycode \\`${key}\\`.`);\n\t}\n\n\tconst code =\n\t\tkey.toUpperCase() in virtualKeyCodes ?\n\t\t\tvirtualKeyCodes[key.toUpperCase()] :\n\t\t\tnull;\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice(key.length)\n\t};\n}\n\nconst domKeys = Object.assign(Object.create(null), {\n\tplus: 'Add',\n\tspace: ' ',\n\ttab: 'Tab',\n\tbackspace: 'Backspace',\n\tdelete: 'Delete',\n\tinsert: 'Insert',\n\treturn: 'Return',\n\tenter: 'Return',\n\tup: 'ArrowUp',\n\tdown: 'ArrowDown',\n\tleft: 'ArrowLeft',\n\tright: 'ArrowRight',\n\thome: 'Home',\n\tend: 'End',\n\tpageup: 'PageUp',\n\tpagedown: 'PageDown',\n\tescape: 'Escape',\n\tesc: 'Escape',\n\tvolumeup: 'AudioVolumeUp',\n\tvolumedown: 'AudioVolumeDown',\n\tvolumemute: 'AudioVolumeMute',\n\tmedianexttrack: 'MediaTrackNext',\n\tmediaprevioustrack: 'MediaTrackPrevious',\n\tmediastop: 'MediaStop',\n\tmediaplaypause: 'MediaPlayPause',\n\tprintscreen: 'PrintScreen'\n});\n\n// Add function keys\nfor (let i = 1; i <= 24; i++) {\n\tdomKeys[`f${i}`] = `F${i}`;\n}\n\nfunction reduceCode({accelerator, event}, {code, key}) {\n\tif (event.code) {\n\t\tthrow new Error(`Duplicated keycode \\`${key}\\`.`);\n\t}\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice((key && key.length) || 0)\n\t};\n}\n\n/**\n * This function transform an Electron Accelerator string into\n * a DOM KeyboardEvent object.\n *\n * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.\n * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.\n */\nfunction toKeyEvent(accelerator) {\n\tlet state = {accelerator, event: {}};\n\twhile (state.accelerator !== '') {\n\t\tconst modifierMatch = state.accelerator.match(modifiers);\n\t\tif (modifierMatch) {\n\t\t\tconst modifier = modifierMatch[0].toLowerCase();\n\t\t\tstate = reduceModifier(state, modifier);\n\t\t\tif (state === UNSUPPORTED) {\n\t\t\t\treturn {unsupportedKeyForPlatform: true};\n\t\t\t}\n\t\t} else if (state.accelerator.trim()[0] === '+') {\n\t\t\tstate = reducePlus(state);\n\t\t} else {\n\t\t\tconst codeMatch = state.accelerator.match(keyCodes);\n\t\t\tif (codeMatch) {\n\t\t\t\tconst code = codeMatch[0].toLowerCase();\n\t\t\t\tif (code in domKeys) {\n\t\t\t\t\tstate = reduceCode(state, {\n\t\t\t\t\t\tcode: domKeys[code],\n\t\t\t\t\t\tkey: code\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tstate = reduceKey(state, code);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tthrow new Error(`Unvalid accelerator: \"${state.accelerator}\"`);\n\t\t\t}\n\t\t}\n\t}\n\treturn state.event;\n}\n\nexports.UNSUPPORTED = UNSUPPORTED;\nexports.reduceModifier = reduceModifier;\nexports.reducePlus = reducePlus;\nexports.reduceKey = reduceKey;\nexports.reduceCode = reduceCode;\nexports.toKeyEvent = toKeyEvent;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1mcm9tLWVsZWN0cm9uLWFjY2VsZXJhdG9yL2luZGV4LmpzPzU3N2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsOENBQThDLGNBQWM7O0FBRTVEO0FBQ0EscVZBQXFWLEVBQUUsRUFBRTtBQUN6Vjs7QUFFQSx5QkFBeUIsbUJBQW1CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsVUFBVSxjQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFVBQVUsY0FBYztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFVBQVUsY0FBYztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsVUFBVSxjQUFjO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsVUFBVSxjQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsVUFBVSxhQUFhO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFVBQVUsZUFBZTtBQUNwRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLG1CQUFtQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0EsdUNBQXVDLElBQUk7QUFDM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsVUFBVSxJQUFJLFVBQVUsS0FBSztBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBLGVBQWUsU0FBUztBQUN4QixhQUFhLEVBQUUsU0FBUyxFQUFFO0FBQzFCOztBQUVBLHFCQUFxQixtQkFBbUIsR0FBRyxVQUFVO0FBQ3JEO0FBQ0EsMENBQTBDLElBQUk7QUFDOUM7O0FBRUE7QUFDQSx5QkFBeUIsVUFBVSxJQUFJLFVBQVUsS0FBSztBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSTtBQUNKLDZDQUE2QyxrQkFBa0I7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1mcm9tLWVsZWN0cm9uLWFjY2VsZXJhdG9yL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5jb25zdCBtb2RpZmllcnMgPSAvXihDb21tYW5kT3JDb250cm9sfENtZE9yQ3RybHxDb21tYW5kfENtZHxDb250cm9sfEN0cmx8QWx0fE9wdGlvbnxBbHRHcnxTaGlmdHxTdXBlcikvaTtcbmNvbnN0IGtleUNvZGVzID0gL14oUGx1c3xTcGFjZXxUYWJ8QmFja3NwYWNlfERlbGV0ZXxJbnNlcnR8UmV0dXJufEVudGVyfFVwfERvd258TGVmdHxSaWdodHxIb21lfEVuZHxQYWdlVXB8UGFnZURvd258RXNjYXBlfEVzY3xWb2x1bWVVcHxWb2x1bWVEb3dufFZvbHVtZU11dGV8TWVkaWFOZXh0VHJhY2t8TWVkaWFQcmV2aW91c1RyYWNrfE1lZGlhU3RvcHxNZWRpYVBsYXlQYXVzZXxQcmludFNjcmVlbnxGMjR8RjIzfEYyMnxGMjF8RjIwfEYxOXxGMTh8RjE3fEYxNnxGMTV8RjE0fEYxM3xGMTJ8RjExfEYxMHxGOXxGOHxGN3xGNnxGNXxGNHxGM3xGMnxGMXxbMC05QS1aKSFAIyQlXiYqKDorPF8+P357fH1cIjs9LFxcLS4vYFtcXFxcXFxdJ10pL2k7XG5jb25zdCBVTlNVUFBPUlRFRCA9IHt9O1xuXG5mdW5jdGlvbiByZWR1Y2VNb2RpZmllcih7YWNjZWxlcmF0b3IsIGV2ZW50fSwgbW9kaWZpZXIpIHtcblx0c3dpdGNoIChtb2RpZmllcikge1xuXHRcdGNhc2UgJ2NvbW1hbmQnOlxuXHRcdGNhc2UgJ2NtZCc6IHtcblx0XHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuXHRcdFx0XHRyZXR1cm4gVU5TVVBQT1JURUQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldmVudC5tZXRhS2V5KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBDb21tYW5kYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge21ldGFLZXk6IHRydWV9KSxcblx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNhc2UgJ3N1cGVyJzoge1xuXHRcdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYFN1cGVyYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge21ldGFLZXk6IHRydWV9KSxcblx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNhc2UgJ2NvbnRyb2wnOlxuXHRcdGNhc2UgJ2N0cmwnOiB7XG5cdFx0XHRpZiAoZXZlbnQuY3RybEtleSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgQ29udHJvbGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHtjdHJsS2V5OiB0cnVlfSksXG5cdFx0XHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjYXNlICdjb21tYW5kb3Jjb250cm9sJzpcblx0XHRjYXNlICdjbWRvcmN0cmwnOiB7XG5cdFx0XHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcblx0XHRcdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgQ29tbWFuZGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHttZXRhS2V5OiB0cnVlfSksXG5cdFx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2ZW50LmN0cmxLZXkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYENvbnRyb2xgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7Y3RybEtleTogdHJ1ZX0pLFxuXHRcdFx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3Iuc2xpY2UobW9kaWZpZXIubGVuZ3RoKVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y2FzZSAnb3B0aW9uJzpcblx0XHRjYXNlICdhbHRncic6XG5cdFx0Y2FzZSAnYWx0Jzoge1xuXHRcdFx0aWYgKG1vZGlmaWVyID09PSAnb3B0aW9uJyAmJiBwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuXHRcdFx0XHRyZXR1cm4gVU5TVVBQT1JURUQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldmVudC5hbHRLZXkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYEFsdGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHthbHRLZXk6IHRydWV9KSxcblx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNhc2UgJ3NoaWZ0Jzoge1xuXHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBTaGlmdGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHtzaGlmdEtleTogdHJ1ZX0pLFxuXHRcdFx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3Iuc2xpY2UobW9kaWZpZXIubGVuZ3RoKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc29sZS5lcnJvcihtb2RpZmllcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVkdWNlUGx1cyh7YWNjZWxlcmF0b3IsIGV2ZW50fSkge1xuXHRyZXR1cm4ge1xuXHRcdGV2ZW50LFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci50cmltKCkuc2xpY2UoMSlcblx0fTtcbn1cblxuY29uc3QgdmlydHVhbEtleUNvZGVzID0ge1xuXHQwOiAnRGlnaXQwJyxcblx0MTogJ0RpZ2l0MScsXG5cdDI6ICdEaWdpdDInLFxuXHQzOiAnRGlnaXQzJyxcblx0NDogJ0RpZ2l0NCcsXG5cdDU6ICdEaWdpdDUnLFxuXHQ2OiAnRGlnaXQ2Jyxcblx0NzogJ0RpZ2l0NycsXG5cdDg6ICdEaWdpdDgnLFxuXHQ5OiAnRGlnaXQ5Jyxcblx0Jy0nOiAnTWludXMnLFxuXHQnPSc6ICdFcXVhbCcsXG5cdFE6ICdLZXlRJyxcblx0VzogJ0tleVcnLFxuXHRFOiAnS2V5RScsXG5cdFI6ICdLZXlSJyxcblx0VDogJ0tleVQnLFxuXHRZOiAnS2V5WScsXG5cdFU6ICdLZXlVJyxcblx0STogJ0tleUknLFxuXHRPOiAnS2V5TycsXG5cdFA6ICdLZXlQJyxcblx0J1snOiAnQnJhY2tldExlZnQnLFxuXHQnXSc6ICdCcmFja2V0UmlnaHQnLFxuXHRBOiAnS2V5QScsXG5cdFM6ICdLZXlTJyxcblx0RDogJ0tleUQnLFxuXHRGOiAnS2V5RicsXG5cdEc6ICdLZXlHJyxcblx0SDogJ0tleUgnLFxuXHRKOiAnS2V5SicsXG5cdEs6ICdLZXlLJyxcblx0TDogJ0tleUwnLFxuXHQnOyc6ICdTZW1pY29sb24nLFxuXHQnXFwnJzogJ1F1b3RlJyxcblx0J2AnOiAnQmFja3F1b3RlJyxcblx0Jy8nOiAnQmFja3NsYXNoJyxcblx0WjogJ0tleVonLFxuXHRYOiAnS2V5WCcsXG5cdEM6ICdLZXlDJyxcblx0VjogJ0tleVYnLFxuXHRCOiAnS2V5QicsXG5cdE46ICdLZXlOJyxcblx0TTogJ0tleU0nLFxuXHQnLCc6ICdDb21tYScsXG5cdCcuJzogJ1BlcmlvZCcsXG5cdCdcXFxcJzogJ1NsYXNoJyxcblx0JyAnOiAnU3BhY2UnXG59O1xuXG5mdW5jdGlvbiByZWR1Y2VLZXkoe2FjY2VsZXJhdG9yLCBldmVudH0sIGtleSkge1xuXHRpZiAoa2V5Lmxlbmd0aCA+IDEgfHwgZXZlbnQua2V5KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBVbnZhbGlkIGtleWNvZGUgXFxgJHtrZXl9XFxgLmApO1xuXHR9XG5cblx0Y29uc3QgY29kZSA9XG5cdFx0a2V5LnRvVXBwZXJDYXNlKCkgaW4gdmlydHVhbEtleUNvZGVzID9cblx0XHRcdHZpcnR1YWxLZXlDb2Rlc1trZXkudG9VcHBlckNhc2UoKV0gOlxuXHRcdFx0bnVsbDtcblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2tleX0sIGNvZGUgPyB7Y29kZX0gOiBudWxsKSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3IudHJpbSgpLnNsaWNlKGtleS5sZW5ndGgpXG5cdH07XG59XG5cbmNvbnN0IGRvbUtleXMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHtcblx0cGx1czogJ0FkZCcsXG5cdHNwYWNlOiAnICcsXG5cdHRhYjogJ1RhYicsXG5cdGJhY2tzcGFjZTogJ0JhY2tzcGFjZScsXG5cdGRlbGV0ZTogJ0RlbGV0ZScsXG5cdGluc2VydDogJ0luc2VydCcsXG5cdHJldHVybjogJ1JldHVybicsXG5cdGVudGVyOiAnUmV0dXJuJyxcblx0dXA6ICdBcnJvd1VwJyxcblx0ZG93bjogJ0Fycm93RG93bicsXG5cdGxlZnQ6ICdBcnJvd0xlZnQnLFxuXHRyaWdodDogJ0Fycm93UmlnaHQnLFxuXHRob21lOiAnSG9tZScsXG5cdGVuZDogJ0VuZCcsXG5cdHBhZ2V1cDogJ1BhZ2VVcCcsXG5cdHBhZ2Vkb3duOiAnUGFnZURvd24nLFxuXHRlc2NhcGU6ICdFc2NhcGUnLFxuXHRlc2M6ICdFc2NhcGUnLFxuXHR2b2x1bWV1cDogJ0F1ZGlvVm9sdW1lVXAnLFxuXHR2b2x1bWVkb3duOiAnQXVkaW9Wb2x1bWVEb3duJyxcblx0dm9sdW1lbXV0ZTogJ0F1ZGlvVm9sdW1lTXV0ZScsXG5cdG1lZGlhbmV4dHRyYWNrOiAnTWVkaWFUcmFja05leHQnLFxuXHRtZWRpYXByZXZpb3VzdHJhY2s6ICdNZWRpYVRyYWNrUHJldmlvdXMnLFxuXHRtZWRpYXN0b3A6ICdNZWRpYVN0b3AnLFxuXHRtZWRpYXBsYXlwYXVzZTogJ01lZGlhUGxheVBhdXNlJyxcblx0cHJpbnRzY3JlZW46ICdQcmludFNjcmVlbidcbn0pO1xuXG4vLyBBZGQgZnVuY3Rpb24ga2V5c1xuZm9yIChsZXQgaSA9IDE7IGkgPD0gMjQ7IGkrKykge1xuXHRkb21LZXlzW2BmJHtpfWBdID0gYEYke2l9YDtcbn1cblxuZnVuY3Rpb24gcmVkdWNlQ29kZSh7YWNjZWxlcmF0b3IsIGV2ZW50fSwge2NvZGUsIGtleX0pIHtcblx0aWYgKGV2ZW50LmNvZGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQga2V5Y29kZSBcXGAke2tleX1cXGAuYCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2tleX0sIGNvZGUgPyB7Y29kZX0gOiBudWxsKSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3IudHJpbSgpLnNsaWNlKChrZXkgJiYga2V5Lmxlbmd0aCkgfHwgMClcblx0fTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRyYW5zZm9ybSBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcgaW50b1xuICogYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBhY2NlbGVyYXRvciBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcsIGUuZy4gYEN0cmwrQ2Agb3IgYFNoaWZ0K1NwYWNlYC5cbiAqIEByZXR1cm4ge29iamVjdH0gYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QgZGVyaXZhdGUgZnJvbSB0aGUgYGFjY2VsZXJhdG9yYCBhcmd1bWVudC5cbiAqL1xuZnVuY3Rpb24gdG9LZXlFdmVudChhY2NlbGVyYXRvcikge1xuXHRsZXQgc3RhdGUgPSB7YWNjZWxlcmF0b3IsIGV2ZW50OiB7fX07XG5cdHdoaWxlIChzdGF0ZS5hY2NlbGVyYXRvciAhPT0gJycpIHtcblx0XHRjb25zdCBtb2RpZmllck1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2gobW9kaWZpZXJzKTtcblx0XHRpZiAobW9kaWZpZXJNYXRjaCkge1xuXHRcdFx0Y29uc3QgbW9kaWZpZXIgPSBtb2RpZmllck1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRzdGF0ZSA9IHJlZHVjZU1vZGlmaWVyKHN0YXRlLCBtb2RpZmllcik7XG5cdFx0XHRpZiAoc3RhdGUgPT09IFVOU1VQUE9SVEVEKSB7XG5cdFx0XHRcdHJldHVybiB7dW5zdXBwb3J0ZWRLZXlGb3JQbGF0Zm9ybTogdHJ1ZX07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzdGF0ZS5hY2NlbGVyYXRvci50cmltKClbMF0gPT09ICcrJykge1xuXHRcdFx0c3RhdGUgPSByZWR1Y2VQbHVzKHN0YXRlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgY29kZU1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2goa2V5Q29kZXMpO1xuXHRcdFx0aWYgKGNvZGVNYXRjaCkge1xuXHRcdFx0XHRjb25zdCBjb2RlID0gY29kZU1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmIChjb2RlIGluIGRvbUtleXMpIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUNvZGUoc3RhdGUsIHtcblx0XHRcdFx0XHRcdGNvZGU6IGRvbUtleXNbY29kZV0sXG5cdFx0XHRcdFx0XHRrZXk6IGNvZGVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUtleShzdGF0ZSwgY29kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW52YWxpZCBhY2NlbGVyYXRvcjogXCIke3N0YXRlLmFjY2VsZXJhdG9yfVwiYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzdGF0ZS5ldmVudDtcbn1cblxuZXhwb3J0cy5VTlNVUFBPUlRFRCA9IFVOU1VQUE9SVEVEO1xuZXhwb3J0cy5yZWR1Y2VNb2RpZmllciA9IHJlZHVjZU1vZGlmaWVyO1xuZXhwb3J0cy5yZWR1Y2VQbHVzID0gcmVkdWNlUGx1cztcbmV4cG9ydHMucmVkdWNlS2V5ID0gcmVkdWNlS2V5O1xuZXhwb3J0cy5yZWR1Y2VDb2RlID0gcmVkdWNlQ29kZTtcbmV4cG9ydHMudG9LZXlFdmVudCA9IHRvS2V5RXZlbnQ7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/keyboardevent-from-electron-accelerator/index.js\n");

/***/ }),

/***/ "./node_modules/keyboardevents-areequal/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/keyboardevents-areequal/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _lower(key) {\n\tif (typeof key !== 'string') {\n\t\treturn key;\n\t}\n\treturn key.toLowerCase();\n}\n\nfunction areEqual(ev1, ev2) {\n\tif (ev1 === ev2) {\n\t\t// Same object\n\t\t// console.log(`Events are same.`)\n\t\treturn true;\n\t}\n\n\tfor (const prop of ['altKey', 'ctrlKey', 'shiftKey', 'metaKey']) {\n\t\tconst [value1, value2] = [ev1[prop], ev2[prop]];\n\n\t\tif (Boolean(value1) !== Boolean(value2)) {\n\t\t\t// One of the prop is different\n\t\t\t// console.log(`Comparing prop ${prop}: ${value1} ${value2}`);\n\t\t\treturn false;\n\t\t}\n\t}\n\n\tif ((_lower(ev1.key) === _lower(ev2.key) && ev1.key !== undefined) ||\n\t\t(ev1.code === ev2.code && ev1.code !== undefined)) {\n\t\t// Events are equals\n\t\treturn true;\n\t}\n\n\t// Key or code are differents\n\t// console.log(`key or code are differents. ${ev1.key} !== ${ev2.key} ${ev1.code} !== ${ev2.code}`);\n\n\treturn false;\n}\n\nmodule.exports = areEqual;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudHMtYXJlZXF1YWwvaW5kZXguanM/NWYxNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQyxLQUFLLElBQUksT0FBTyxHQUFHLE9BQU87QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0MsUUFBUSxPQUFPLFFBQVEsR0FBRyxTQUFTLE9BQU8sU0FBUzs7QUFFbEc7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50cy1hcmVlcXVhbC9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2xvd2VyKGtleSkge1xuXHRpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4ga2V5O1xuXHR9XG5cdHJldHVybiBrZXkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gYXJlRXF1YWwoZXYxLCBldjIpIHtcblx0aWYgKGV2MSA9PT0gZXYyKSB7XG5cdFx0Ly8gU2FtZSBvYmplY3Rcblx0XHQvLyBjb25zb2xlLmxvZyhgRXZlbnRzIGFyZSBzYW1lLmApXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHByb3Agb2YgWydhbHRLZXknLCAnY3RybEtleScsICdzaGlmdEtleScsICdtZXRhS2V5J10pIHtcblx0XHRjb25zdCBbdmFsdWUxLCB2YWx1ZTJdID0gW2V2MVtwcm9wXSwgZXYyW3Byb3BdXTtcblxuXHRcdGlmIChCb29sZWFuKHZhbHVlMSkgIT09IEJvb2xlYW4odmFsdWUyKSkge1xuXHRcdFx0Ly8gT25lIG9mIHRoZSBwcm9wIGlzIGRpZmZlcmVudFxuXHRcdFx0Ly8gY29uc29sZS5sb2coYENvbXBhcmluZyBwcm9wICR7cHJvcH06ICR7dmFsdWUxfSAke3ZhbHVlMn1gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRpZiAoKF9sb3dlcihldjEua2V5KSA9PT0gX2xvd2VyKGV2Mi5rZXkpICYmIGV2MS5rZXkgIT09IHVuZGVmaW5lZCkgfHxcblx0XHQoZXYxLmNvZGUgPT09IGV2Mi5jb2RlICYmIGV2MS5jb2RlICE9PSB1bmRlZmluZWQpKSB7XG5cdFx0Ly8gRXZlbnRzIGFyZSBlcXVhbHNcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIEtleSBvciBjb2RlIGFyZSBkaWZmZXJlbnRzXG5cdC8vIGNvbnNvbGUubG9nKGBrZXkgb3IgY29kZSBhcmUgZGlmZmVyZW50cy4gJHtldjEua2V5fSAhPT0gJHtldjIua2V5fSAke2V2MS5jb2RlfSAhPT0gJHtldjIuY29kZX1gKTtcblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJlRXF1YWw7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/keyboardevents-areequal/index.js\n");

/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isNaN(val) === false) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  return plural(ms, d, 'day') ||\n    plural(ms, h, 'hour') ||\n    plural(ms, m, 'minute') ||\n    plural(ms, s, 'second') ||\n    ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanM/MTQ2OCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixXQUFXLE9BQU87QUFDbEIsWUFBWSxNQUFNO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWwpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhcbiAgICBzdHJcbiAgKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIH1cbiAgaWYgKG1zID49IGgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICB9XG4gIGlmIChtcyA+PSBtKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgfVxuICBpZiAobXMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIH1cbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdExvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpIHx8XG4gICAgcGx1cmFsKG1zLCBoLCAnaG91cicpIHx8XG4gICAgcGx1cmFsKG1zLCBtLCAnbWludXRlJykgfHxcbiAgICBwbHVyYWwobXMsIHMsICdzZWNvbmQnKSB8fFxuICAgIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG1zIDwgbiAqIDEuNSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lO1xuICB9XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/ms/index.js\n");

/***/ }),

/***/ "./src/main/SteamSettingsManager.ts":
/*!******************************************!*\
  !*** ./src/main/SteamSettingsManager.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SteamSettingsManager; });\nconst regedit = __webpack_require__(/*! regedit */ \"regedit\");\nclass SteamSettingsManager {\n    static getSettings() {\n        const regPath = 'HKCU\\\\SOFTWARE\\\\Valve\\\\Steam';\n        regedit.list(regPath, (err, result) => {\n            if (err) {\n                // TODO: Не установлен стим.\n                console.log(err);\n                return;\n            }\n            let steamSettings = result[regPath].values;\n            return {\n                steamPath: steamSettings.SteamPath.value,\n                autoLoginUser: steamSettings.AutoLoginUser.value,\n            };\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9TdGVhbVNldHRpbmdzTWFuYWdlci50cz9mMWZiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQSxNQUFNLE9BQU8sR0FBRyxtQkFBTyxDQUFDLHdCQUFTLENBQUMsQ0FBQztBQUVwQixNQUFNLG9CQUFvQjtJQUVyQyxNQUFNLENBQUMsV0FBVztRQUVkLE1BQU0sT0FBTyxHQUFHLDhCQUE4QixDQUFDO1FBRS9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBUSxFQUFFLE1BQVcsRUFBRSxFQUFFO1lBQzVDLElBQUksR0FBRyxFQUFFO2dCQUNMLDRCQUE0QjtnQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakIsT0FBTzthQUNWO1lBRUQsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUUzQyxPQUFPO2dCQUNILFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUs7Z0JBQ3hDLGFBQWEsRUFBRSxhQUFhLENBQUMsYUFBYSxDQUFDLEtBQUs7YUFDbkQ7UUFFTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FFSiIsImZpbGUiOiIuL3NyYy9tYWluL1N0ZWFtU2V0dGluZ3NNYW5hZ2VyLnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVnZWRpdCA9IHJlcXVpcmUoJ3JlZ2VkaXQnKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0ZWFtU2V0dGluZ3NNYW5hZ2VyIHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0U2V0dGluZ3MoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlZ1BhdGggPSAnSEtDVVxcXFxTT0ZUV0FSRVxcXFxWYWx2ZVxcXFxTdGVhbSc7XHJcblxyXG4gICAgICAgIHJlZ2VkaXQubGlzdChyZWdQYXRoLCAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86INCd0LUg0YPRgdGC0LDQvdC+0LLQu9C10L0g0YHRgtC40LwuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgc3RlYW1TZXR0aW5ncyA9IHJlc3VsdFtyZWdQYXRoXS52YWx1ZXM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3RlYW1QYXRoOiBzdGVhbVNldHRpbmdzLlN0ZWFtUGF0aC52YWx1ZSxcclxuICAgICAgICAgICAgICAgIGF1dG9Mb2dpblVzZXI6IHN0ZWFtU2V0dGluZ3MuQXV0b0xvZ2luVXNlci52YWx1ZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/SteamSettingsManager.ts\n");

/***/ }),

/***/ "./src/main/index.dev.ts":
/*!*******************************!*\
  !*** ./src/main/index.dev.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * This file is used specifically and only for development. It installs\n * `electron-debug` & `vue-devtools`. There shouldn't be any need to\n *  modify this file, but it can be used to extend your development\n *  environment.\n */\n// Install `electron-debug` with `devtron`\n__webpack_require__(/*! electron-debug */ \"./node_modules/electron-debug/index.js\")({ showDevTools: false });\n// Install `vue-devtools`\n__webpack_require__(/*! electron */ \"electron\").app.on('ready', () => {\n    let installExtension = __webpack_require__(/*! electron-devtools-installer */ \"electron-devtools-installer\");\n    installExtension.default(installExtension.VUEJS_DEVTOOLS)\n        .then(() => { })\n        .catch((err) => {\n        console.log('Unable to install `vue-devtools`: \\n', err);\n    });\n});\n// Require `main` process to boot app\n__webpack_require__(/*! ./index */ \"./src/main/index.ts\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5kZXYudHM/NWMwZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7QUFFSCwwQ0FBMEM7QUFDMUMsbUJBQU8sQ0FBQyw4REFBZ0IsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBRWxELHlCQUF5QjtBQUN6QixtQkFBTyxDQUFDLDBCQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDdkMsSUFBSSxnQkFBZ0IsR0FBRyxtQkFBTyxDQUFDLGdFQUE2QixDQUFDO0lBQzdELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUM7U0FDdEQsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztTQUNkLEtBQUssQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxDQUFDO0lBQzFELENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVGLHFDQUFxQztBQUNyQyxtQkFBTyxDQUFDLG9DQUFTLENBQUMiLCJmaWxlIjoiLi9zcmMvbWFpbi9pbmRleC5kZXYudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgZmlsZSBpcyB1c2VkIHNwZWNpZmljYWxseSBhbmQgb25seSBmb3IgZGV2ZWxvcG1lbnQuIEl0IGluc3RhbGxzXG4gKiBgZWxlY3Ryb24tZGVidWdgICYgYHZ1ZS1kZXZ0b29sc2AuIFRoZXJlIHNob3VsZG4ndCBiZSBhbnkgbmVlZCB0b1xuICogIG1vZGlmeSB0aGlzIGZpbGUsIGJ1dCBpdCBjYW4gYmUgdXNlZCB0byBleHRlbmQgeW91ciBkZXZlbG9wbWVudFxuICogIGVudmlyb25tZW50LlxuICovXG5cbi8vIEluc3RhbGwgYGVsZWN0cm9uLWRlYnVnYCB3aXRoIGBkZXZ0cm9uYFxucmVxdWlyZSgnZWxlY3Ryb24tZGVidWcnKSh7IHNob3dEZXZUb29sczogZmFsc2UgfSlcblxuLy8gSW5zdGFsbCBgdnVlLWRldnRvb2xzYFxucmVxdWlyZSgnZWxlY3Ryb24nKS5hcHAub24oJ3JlYWR5JywgKCkgPT4ge1xuICBsZXQgaW5zdGFsbEV4dGVuc2lvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcicpXG4gIGluc3RhbGxFeHRlbnNpb24uZGVmYXVsdChpbnN0YWxsRXh0ZW5zaW9uLlZVRUpTX0RFVlRPT0xTKVxuICAgIC50aGVuKCgpID0+IHt9KVxuICAgIC5jYXRjaCgoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdVbmFibGUgdG8gaW5zdGFsbCBgdnVlLWRldnRvb2xzYDogXFxuJywgZXJyKVxuICAgIH0pXG59KVxuXG4vLyBSZXF1aXJlIGBtYWluYCBwcm9jZXNzIHRvIGJvb3QgYXBwXG5yZXF1aXJlKCcuL2luZGV4JylcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/index.dev.ts\n");

/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-class-component */ \"vue-class-component\");\n/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue_class_component__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _SteamSettingsManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SteamSettingsManager */ \"./src/main/SteamSettingsManager.ts\");\n\n//Vue.use(VueElectron);\nvue_class_component__WEBPACK_IMPORTED_MODULE_0___default.a.prototype.$electron = __webpack_require__(/*! electron */ \"electron\");\n\n\nconst isDevelopment = \"development\" === 'development';\n/**\n * Set `__static` path to static files in production\n * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html\n */\nif (!isDevelopment) {\n    global.__static = __webpack_require__(/*! path */ \"path\").join(__dirname, '/static').replace(/\\\\/g, '\\\\\\\\');\n}\nlet mainWindow;\nconst applicationUrl = isDevelopment\n    ? `http://localhost:9080`\n    : `file://${__dirname}/index.html`;\nfunction createWindow() {\n    /**\n     * Initial window options\n     */\n    mainWindow = new electron__WEBPACK_IMPORTED_MODULE_1__[\"BrowserWindow\"]({\n        height: 500,\n        useContentSize: true,\n        width: 1000,\n        frame: false,\n    });\n    if (isDevelopment) {\n        mainWindow.webContents.openDevTools();\n    }\n    mainWindow.on('closed', () => mainWindow = null);\n    let steamSettings = _SteamSettingsManager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getSettings();\n    console.log(steamSettings);\n    mainWindow.loadURL(applicationUrl);\n}\nelectron__WEBPACK_IMPORTED_MODULE_1__[\"app\"].on('ready', createWindow);\nelectron__WEBPACK_IMPORTED_MODULE_1__[\"app\"].on('window-all-closed', () => {\n    if (process.platform !== 'darwin') {\n        electron__WEBPACK_IMPORTED_MODULE_1__[\"app\"].quit();\n    }\n});\nelectron__WEBPACK_IMPORTED_MODULE_1__[\"app\"].on('activate', () => {\n    if (mainWindow === null) {\n        createWindow();\n    }\n});\n/**\n * Auto Updater\n *\n * Uncomment the following code below and install `electron-updater` to\n * support auto updating. Code Signing with a valid certificate is required.\n * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating\n */\n/*\nimport { autoUpdater } from 'electron-updater'\n\nautoUpdater.on('update-downloaded', () => {\n  autoUpdater.quitAndInstall()\n})\n\napp.on('ready', () => {\n  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()\n})\n */\n\n/* WEBPACK VAR INJECTION */}.call(this, \"src\\\\main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cz8wNWI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFxQztBQUdyQyx1QkFBdUI7QUFDdEIsMERBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLG1CQUFPLENBQUMsMEJBQVUsQ0FBQyxDQUFDO0FBRVQ7QUFDWTtBQUsxRCxNQUFNLGFBQWEsR0FBRyxhQUFvQixLQUFLLGFBQWEsQ0FBQztBQUU3RDs7O0dBR0c7QUFDSCxJQUFJLENBQUMsYUFBYSxFQUFFO0lBQ2YsTUFBYyxDQUFDLFFBQVEsR0FBRyxtQkFBTyxDQUFDLGtCQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDaEc7QUFFRCxJQUFJLFVBQWUsQ0FBQztBQUNwQixNQUFNLGNBQWMsR0FBRyxhQUFhO0lBQ2hCLENBQUMsQ0FBQyx1QkFBdUI7SUFDekIsQ0FBQyxDQUFDLFVBQVUsU0FBUyxhQUFhLENBQUM7QUFFdkQsU0FBUyxZQUFZO0lBQ2pCOztPQUVHO0lBQ0gsVUFBVSxHQUFHLElBQUksc0RBQWEsQ0FBQztRQUMzQixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLEtBQUs7S0FFZixDQUFDLENBQUM7SUFFSCxJQUFJLGFBQWEsRUFBRTtRQUNmLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFO0tBQ3hDO0lBRUQsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRWpELElBQUksYUFBYSxHQUFHLDZEQUFvQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFM0IsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsNENBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRTlCLDRDQUFHLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQy9CLDRDQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZDtBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsNENBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7UUFDckIsWUFBWSxFQUFFLENBQUM7S0FDbEI7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVIOzs7Ozs7R0FNRztBQUVIOzs7Ozs7Ozs7O0dBVUciLCJmaWxlIjoiLi9zcmMvbWFpbi9pbmRleC50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlLWNsYXNzLWNvbXBvbmVudCdcclxuaW1wb3J0IFZ1ZUVsZWN0cm9uIGZyb20gJ3Z1ZS1lbGVjdHJvbidcclxuXHJcbi8vVnVlLnVzZShWdWVFbGVjdHJvbik7XHJcbihWdWUgYXMgYW55KS5wcm90b3R5cGUuJGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcclxuXHJcbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0IFN0ZWFtU2V0dGluZ3NNYW5hZ2VyIGZyb20gJy4vU3RlYW1TZXR0aW5nc01hbmFnZXInO1xyXG5cclxuXHJcblxyXG5cclxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuLyoqXHJcbiAqIFNldCBgX19zdGF0aWNgIHBhdGggdG8gc3RhdGljIGZpbGVzIGluIHByb2R1Y3Rpb25cclxuICogaHR0cHM6Ly9zaW11bGF0ZWRncmVnLmdpdGJvb2tzLmlvL2VsZWN0cm9uLXZ1ZS9jb250ZW50L2VuL3VzaW5nLXN0YXRpYy1hc3NldHMuaHRtbFxyXG4gKi9cclxuaWYgKCFpc0RldmVsb3BtZW50KSB7XHJcbiAgICAoZ2xvYmFsIGFzIGFueSkuX19zdGF0aWMgPSByZXF1aXJlKCdwYXRoJykuam9pbihfX2Rpcm5hbWUsICcvc3RhdGljJykucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKTtcclxufVxyXG5cclxubGV0IG1haW5XaW5kb3c6IGFueTtcclxuY29uc3QgYXBwbGljYXRpb25VcmwgPSBpc0RldmVsb3BtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgPyBgaHR0cDovL2xvY2FsaG9zdDo5MDgwYFxyXG4gICAgICAgICAgICAgICAgICAgIDogYGZpbGU6Ly8ke19fZGlybmFtZX0vaW5kZXguaHRtbGA7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWwgd2luZG93IG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgICAgICBoZWlnaHQ6IDUwMCxcclxuICAgICAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcclxuICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICBmcmFtZTogZmFsc2UsXHJcbiAgICAgICAgLy90cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChpc0RldmVsb3BtZW50KSB7XHJcbiAgICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtYWluV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiBtYWluV2luZG93ID0gbnVsbCk7XHJcblxyXG4gICAgbGV0IHN0ZWFtU2V0dGluZ3MgPSBTdGVhbVNldHRpbmdzTWFuYWdlci5nZXRTZXR0aW5ncygpO1xyXG4gICAgY29uc29sZS5sb2coc3RlYW1TZXR0aW5ncyk7XHJcblxyXG4gICAgbWFpbldpbmRvdy5sb2FkVVJMKGFwcGxpY2F0aW9uVXJsKTtcclxufVxyXG5cclxuYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdyk7XHJcblxyXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XHJcbiAgICAgICAgYXBwLnF1aXQoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xyXG4gICAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcclxuICAgICAgICBjcmVhdGVXaW5kb3coKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vKipcclxuICogQXV0byBVcGRhdGVyXHJcbiAqXHJcbiAqIFVuY29tbWVudCB0aGUgZm9sbG93aW5nIGNvZGUgYmVsb3cgYW5kIGluc3RhbGwgYGVsZWN0cm9uLXVwZGF0ZXJgIHRvXHJcbiAqIHN1cHBvcnQgYXV0byB1cGRhdGluZy4gQ29kZSBTaWduaW5nIHdpdGggYSB2YWxpZCBjZXJ0aWZpY2F0ZSBpcyByZXF1aXJlZC5cclxuICogaHR0cHM6Ly9zaW11bGF0ZWRncmVnLmdpdGJvb2tzLmlvL2VsZWN0cm9uLXZ1ZS9jb250ZW50L2VuL3VzaW5nLWVsZWN0cm9uLWJ1aWxkZXIuaHRtbCNhdXRvLXVwZGF0aW5nXHJcbiAqL1xyXG5cclxuLypcclxuaW1wb3J0IHsgYXV0b1VwZGF0ZXIgfSBmcm9tICdlbGVjdHJvbi11cGRhdGVyJ1xyXG5cclxuYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1kb3dubG9hZGVkJywgKCkgPT4ge1xyXG4gIGF1dG9VcGRhdGVyLnF1aXRBbmRJbnN0YWxsKClcclxufSlcclxuXHJcbmFwcC5vbigncmVhZHknLCAoKSA9PiB7XHJcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIGF1dG9VcGRhdGVyLmNoZWNrRm9yVXBkYXRlcygpXHJcbn0pXHJcbiAqL1xyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/index.ts\n");

/***/ }),

/***/ 0:
/*!****************************************************************************************************************************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/index.dev.ts ./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js ./src/main/index.ts ***!
  \****************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! D:\Programming\Electron\electron-vue\node_modules\electron-webpack\out\electron-main-hmr\main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
__webpack_require__(/*! D:\Programming\Electron\electron-vue\src\main\index.dev.ts */"./src/main/index.dev.ts");
__webpack_require__(/*! D:\Programming\Electron\electron-vue\node_modules\electron-webpack\out\configurators\vue\vue-main-dev-entry.js */"./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js");
module.exports = __webpack_require__(/*! D:\Programming\Electron\electron-vue\src\main\index.ts */"./src/main/index.ts");


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-devtools-installer":
/*!**********************************************!*\
  !*** external "electron-devtools-installer" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-devtools-installer\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIj9jZThjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-devtools-installer\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiP2E0MGQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///fs\n");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXRcIj8yMWVkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6Im5ldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5ldFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///net\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "regedit":
/*!**************************!*\
  !*** external "regedit" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"regedit\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWdlZGl0XCI/MGRkZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJyZWdlZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZWRpdFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///regedit\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"tty\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0dHlcIj9hN2NiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InR0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///tty\n");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCI/YmUwYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///util\n");

/***/ }),

/***/ "vue-class-component":
/*!**************************************!*\
  !*** external "vue-class-component" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"vue-class-component\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ2dWUtY2xhc3MtY29tcG9uZW50XCI/ZGE3MSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ2dWUtY2xhc3MtY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidnVlLWNsYXNzLWNvbXBvbmVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///vue-class-component\n");

/***/ })

/******/ });