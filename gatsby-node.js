"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@graphql-codegen/core");
var typescript_1 = require("@graphql-codegen/typescript");
var typescript_operations_1 = require("@graphql-codegen/typescript-operations");
var graphql_1 = require("graphql");
var fs_1 = require("fs");
var path_1 = require("path");
var defaultLocation = path_1.resolve(process.cwd(), "graphql-types.d.ts");
exports.onPostBootstrap = function (args, options, callback) {
    if (options === void 0) { options = { plugins: [] }; }
    return __awaiter(void 0, void 0, void 0, function () {
        var store, reporter, dest, schema, introspectionQuery, res, introspectSchema, parsedSchema, config, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = args.store, reporter = args.reporter;
                    dest = options.dest || defaultLocation;
                    schema = store.getState().schema;
                    introspectionQuery = graphql_1.getIntrospectionQuery();
                    return [4 /*yield*/, graphql_1.graphql(schema, introspectionQuery)];
                case 1:
                    res = _a.sent();
                    introspectSchema = res.data;
                    parsedSchema = graphql_1.parse(graphql_1.printSchema(graphql_1.buildClientSchema(introspectSchema)));
                    config = {
                        // documents,
                        documents: [],
                        config: {},
                        filename: dest,
                        schema: parsedSchema,
                        pluginMap: {
                            typescript: {
                                plugin: typescript_1.plugin,
                            },
                            typescriptOperation: {
                                plugin: typescript_operations_1.plugin,
                            },
                        },
                        plugins: [
                            {
                                typescript: {
                                    skipTypename: false,
                                    enumsAsTypes: true,
                                },
                            },
                            {
                                typescriptOperation: {
                                    skipTypename: false,
                                },
                            },
                        ],
                    };
                    return [4 /*yield*/, core_1.codegen(config)];
                case 2:
                    output = _a.sent();
                    // write the typings
                    fs_1.writeFileSync(dest, output);
                    reporter.info("[gatsby-plugin-generate-typings] Wrote typings to " + dest);
                    // tell gatsby we are done
                    callback && callback(null);
                    return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=gatsby-node.js.map