"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationQuery = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetClients" },
            variableDefinitions: [],
            directives: [],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "clients" },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "Client" },
                                    directives: []
                                },
                                { kind: "Field", name: { kind: "Name", value: "__typename" } }
                            ]
                        }
                    },
                    {
                        kind: "Field",
                        alias: { kind: "Name", value: "more" },
                        name: { kind: "Name", value: "clients" },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "Client" },
                                    directives: []
                                },
                                { kind: "Field", name: { kind: "Name", value: "__typename" } }
                            ]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "now" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        alias: { kind: "Name", value: "what" },
                        name: { kind: "Name", value: "now" },
                        arguments: [],
                        directives: []
                    }
                ]
            }
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Client" },
            typeCondition: {
                kind: "NamedType",
                name: { kind: "Name", value: "Client" }
            },
            directives: [],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "id" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "clientKey" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "name" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        }
    ]
    // loc: { start: 0, end: 205 }
};
// 1. resolve fragments
exports.expectedFragmentsReduced = {
    kind: "OperationDefinition",
    operation: "query",
    name: { kind: "Name", value: "GetClients" },
    variableDefinitions: [],
    directives: [],
    selectionSet: {
        kind: "SelectionSet",
        selections: [
            {
                kind: "Field",
                name: { kind: "Name", value: "clients" },
                arguments: [],
                directives: [],
                selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "id" },
                            arguments: [],
                            directives: []
                        },
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "clientKey" },
                            arguments: [],
                            directives: []
                        },
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "name" },
                            arguments: [],
                            directives: []
                        },
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "status" },
                            arguments: [],
                            directives: []
                        },
                        { kind: "Field", name: { kind: "Name", value: "__typename" } }
                    ]
                }
            },
            {
                kind: "Field",
                alias: { kind: "Name", value: "more" },
                name: { kind: "Name", value: "clients" },
                arguments: [],
                directives: [],
                selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "id" },
                            arguments: [],
                            directives: []
                        },
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "clientKey" },
                            arguments: [],
                            directives: []
                        },
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "name" },
                            arguments: [],
                            directives: []
                        },
                        {
                            kind: "Field",
                            name: { kind: "Name", value: "status" },
                            arguments: [],
                            directives: []
                        },
                        { kind: "Field", name: { kind: "Name", value: "__typename" } }
                    ]
                }
            },
            {
                kind: "Field",
                name: { kind: "Name", value: "now" },
                arguments: [],
                directives: []
            },
            {
                kind: "Field",
                alias: { kind: "Name", value: "what" },
                name: { kind: "Name", value: "now" },
                arguments: [],
                directives: []
            }
        ]
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uMi5maXh0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvX190ZXN0c19fL2NvbW1vbjIuZml4dHVyZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFYSxRQUFBLGNBQWMsR0FBaUI7SUFDMUMsSUFBSSxFQUFFLFVBQVU7SUFDaEIsV0FBVyxFQUFFO1FBQ1g7WUFDRSxJQUFJLEVBQUUscUJBQXFCO1lBQzNCLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMzQyxtQkFBbUIsRUFBRSxFQUFFO1lBQ3ZCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxjQUFjO2dCQUNwQixVQUFVLEVBQUU7b0JBQ1Y7d0JBQ0UsSUFBSSxFQUFFLE9BQU87d0JBQ2IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO3dCQUN4QyxTQUFTLEVBQUUsRUFBRTt3QkFDYixVQUFVLEVBQUUsRUFBRTt3QkFDZCxZQUFZLEVBQUU7NEJBQ1osSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLFVBQVUsRUFBRTtnQ0FDVjtvQ0FDRSxJQUFJLEVBQUUsZ0JBQWdCO29DQUN0QixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7b0NBQ3ZDLFVBQVUsRUFBRSxFQUFFO2lDQUNmO2dDQUNELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRTs2QkFDL0Q7eUJBQ0Y7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsSUFBSSxFQUFFLE9BQU87d0JBQ2IsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVB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