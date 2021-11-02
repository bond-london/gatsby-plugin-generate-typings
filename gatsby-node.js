"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@graphql-codegen/core");
const typescript_1 = require("@graphql-codegen/typescript");
const typescript_operations_1 = require("@graphql-codegen/typescript-operations");
const graphql_1 = require("graphql");
const fs_1 = require("fs");
const path_1 = require("path");
const defaultLocation = (0, path_1.resolve)(process.cwd(), "graphql-types.d.ts");
exports.onPostBootstrap = async (args, options = { plugins: [] }, callback) => {
    const { store, reporter } = args;
    const dest = options.dest || defaultLocation;
    const { schema } = store.getState();
    const introspectionQuery = (0, graphql_1.getIntrospectionQuery)();
    const res = await (0, graphql_1.graphql)(schema, introspectionQuery);
    const introspectSchema = res.data;
    const parsedSchema = (0, graphql_1.parse)((0, graphql_1.printSchema)((0, graphql_1.buildClientSchema)(introspectSchema)));
    const config = {
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
                    avoidOptionals: false,
                    maybeValue: "T",
                    immutableTypes: true,
                },
            },
            {
                typescriptOperation: {
                    skipTypename: false,
                    avoidOptionals: false,
                },
            },
        ],
    };
    const output = await (0, core_1.codegen)(config);
    const outputDir = (0, path_1.dirname)(dest);
    (0, fs_1.mkdirSync)(outputDir, { recursive: true });
    (0, fs_1.writeFileSync)(dest, output);
    reporter.info(`[gatsby-plugin-generate-typings] Wrote typings to ${dest}`);
    callback && callback(null);
};
//# sourceMappingURL=gatsby-node.js.map