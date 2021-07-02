import { ParentSpanPluginArgs, PluginOptions, PluginCallback } from "gatsby";
import { codegen } from "@graphql-codegen/core";
import { plugin as typescriptPlugin } from "@graphql-codegen/typescript";
import { plugin as operationsPlugin } from "@graphql-codegen/typescript-operations";
import {
  buildClientSchema,
  getIntrospectionQuery,
  graphql,
  IntrospectionQuery,
  parse,
  printSchema,
} from "graphql";
import { writeFileSync, mkdirSync } from "fs";

import { resolve, dirname } from "path";

const defaultLocation = resolve(process.cwd(), "graphql-types.d.ts");

exports.onPostBootstrap = async (
  args: ParentSpanPluginArgs,
  options: PluginOptions = { plugins: [] },
  callback?: PluginCallback
) => {
  const { store, reporter } = args;
  const dest: string = (options.dest as string) || defaultLocation;

  // get the schema and load all graphql queries from pages
  const { schema } = store.getState();

  const introspectionQuery = getIntrospectionQuery();
  const res = await graphql(schema, introspectionQuery);
  const introspectSchema = res.data as IntrospectionQuery;
  const parsedSchema = parse(printSchema(buildClientSchema(introspectSchema)));

  // generate typings from schema
  const config = {
    // documents,
    documents: [],
    config: {},
    filename: dest,
    schema: parsedSchema,
    pluginMap: {
      typescript: {
        plugin: typescriptPlugin,
      },
      typescriptOperation: {
        plugin: operationsPlugin,
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
      } as any,
      {
        typescriptOperation: {
          skipTypename: false,
          avoidOptionals: false,
        },
      } as any,
    ],
  };

  const output = await codegen(config);

  // write the typings
  const outputDir = dirname(dest);
  mkdirSync(outputDir, { recursive: true });

  writeFileSync(dest, output);

  reporter.info(`[gatsby-plugin-generate-typings] Wrote typings to ${dest}`);

  // tell gatsby we are done
  callback && callback(null);
};
