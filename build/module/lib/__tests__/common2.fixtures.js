export const operationQuery = {
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
export const expectedFragmentsReduced = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uMi5maXh0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvX190ZXN0c19fL2NvbW1vbjIuZml4dHVyZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFpQjtJQUMxQyxJQUFJLEVBQUUsVUFBVTtJQUNoQixXQUFXLEVBQUU7UUFDWDtZQUNFLElBQUksRUFBRSxxQkFBcUI7WUFDM0IsU0FBUyxFQUFFLE9BQU87WUFDbEIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzNDLG1CQUFtQixFQUFFLEVBQUU7WUFDdkIsVUFBVSxFQUFFLEVBQUU7WUFDZCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDVjt3QkFDRSxJQUFJLEVBQUUsT0FBTzt3QkFDYixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7d0JBQ3hDLFNBQVMsRUFBRSxFQUFFO3dCQUNiLFVBQVUsRUFBRSxFQUFFO3dCQUNkLFlBQVksRUFBRTs0QkFDWixJQUFJLEVBQUUsY0FBYzs0QkFDcEIsVUFBVSxFQUFFO2dDQUNWO29DQUNFLElBQUksRUFBRSxnQkFBZ0I7b0NBQ3RCLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtvQ0FDdkMsVUFBVSxFQUFFLEVBQUU7aUNBQ2Y7Z0NBQ0QsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFOzZCQUMvRDt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsT0FBTzt3QkFDYixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFF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