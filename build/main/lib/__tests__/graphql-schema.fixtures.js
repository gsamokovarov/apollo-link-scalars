"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const introspection_json_1 = __importDefault(require("./introspection.json"));
// @ts-ignore
exports.graphqlSchemaObj = graphql_1.buildClientSchema(introspection_json_1.default);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC1zY2hlbWEuZml4dHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL19fdGVzdHNfXy9ncmFwaHFsLXNjaGVtYS5maXh0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFDQUE0QztBQUU1Qyw4RUFBNkQ7QUFFN0QsYUFBYTtBQUNBLFFBQUEsZ0JBQWdCLEdBQUcsMkJBQWlCLENBQUMsNEJBQXlCLENBQUMsQ0FBQyJ9