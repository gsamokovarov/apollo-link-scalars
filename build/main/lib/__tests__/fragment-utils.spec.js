"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fragment_utils_1 = require("../fragment-utils");
exports.fragments = [
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
    },
    {
        kind: "FragmentDefinition",
        name: { kind: "Name", value: "DashboardInfo" },
        typeCondition: {
            kind: "NamedType",
            name: { kind: "Name", value: "Dashboard" }
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
                    name: { kind: "Name", value: "dashboardKey" },
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
                    name: { kind: "Name", value: "visibility" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "description" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "owner" },
                    arguments: [],
                    directives: [],
                    selectionSet: {
                        kind: "SelectionSet",
                        selections: [
                            {
                                kind: "FragmentSpread",
                                name: { kind: "Name", value: "UserProfile" },
                                directives: []
                            },
                            { kind: "Field", name: { kind: "Name", value: "__typename" } }
                        ]
                    }
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "createdBy" },
                    arguments: [],
                    directives: [],
                    selectionSet: {
                        kind: "SelectionSet",
                        selections: [
                            {
                                kind: "FragmentSpread",
                                name: { kind: "Name", value: "UserProfile" },
                                directives: []
                            },
                            { kind: "Field", name: { kind: "Name", value: "__typename" } }
                        ]
                    }
                },
                { kind: "Field", name: { kind: "Name", value: "__typename" } }
            ]
        }
    },
    {
        kind: "FragmentDefinition",
        name: { kind: "Name", value: "UserProfile" },
        typeCondition: {
            kind: "NamedType",
            name: { kind: "Name", value: "UserProfile" }
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
                    name: { kind: "Name", value: "email" },
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
                    name: { kind: "Name", value: "nickname" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "picture" },
                    arguments: [],
                    directives: []
                },
                { kind: "Field", name: { kind: "Name", value: "__typename" } }
            ]
        }
    },
    {
        kind: "FragmentDefinition",
        name: { kind: "Name", value: "Focus" },
        typeCondition: {
            kind: "NamedType",
            name: { kind: "Name", value: "Focus" }
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
                    name: { kind: "Name", value: "focusKey" },
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
                    name: { kind: "Name", value: "visibility" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "boardKeys" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "peopleIds" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "multiFilters" },
                    arguments: [],
                    directives: [],
                    selectionSet: {
                        kind: "SelectionSet",
                        selections: [
                            {
                                kind: "FragmentSpread",
                                name: { kind: "Name", value: "MultiFilter" },
                                directives: []
                            },
                            { kind: "Field", name: { kind: "Name", value: "__typename" } }
                        ]
                    }
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "boolFilters" },
                    arguments: [],
                    directives: [],
                    selectionSet: {
                        kind: "SelectionSet",
                        selections: [
                            {
                                kind: "FragmentSpread",
                                name: { kind: "Name", value: "BoolFilter" },
                                directives: []
                            },
                            { kind: "Field", name: { kind: "Name", value: "__typename" } }
                        ]
                    }
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "owner" },
                    arguments: [],
                    directives: [],
                    selectionSet: {
                        kind: "SelectionSet",
                        selections: [
                            {
                                kind: "FragmentSpread",
                                name: { kind: "Name", value: "UserProfile" },
                                directives: []
                            },
                            { kind: "Field", name: { kind: "Name", value: "__typename" } }
                        ]
                    }
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "createdBy" },
                    arguments: [],
                    directives: [],
                    selectionSet: {
                        kind: "SelectionSet",
                        selections: [
                            {
                                kind: "FragmentSpread",
                                name: { kind: "Name", value: "UserProfile" },
                                directives: []
                            },
                            { kind: "Field", name: { kind: "Name", value: "__typename" } }
                        ]
                    }
                },
                { kind: "Field", name: { kind: "Name", value: "__typename" } }
            ]
        }
    },
    {
        kind: "FragmentDefinition",
        name: { kind: "Name", value: "MultiFilter" },
        typeCondition: {
            kind: "NamedType",
            name: { kind: "Name", value: "MultiFilter" }
        },
        directives: [],
        selectionSet: {
            kind: "SelectionSet",
            selections: [
                {
                    kind: "Field",
                    name: { kind: "Name", value: "key" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "values" },
                    arguments: [],
                    directives: []
                },
                { kind: "Field", name: { kind: "Name", value: "__typename" } }
            ]
        }
    },
    {
        kind: "FragmentDefinition",
        name: { kind: "Name", value: "BoolFilter" },
        typeCondition: {
            kind: "NamedType",
            name: { kind: "Name", value: "BoolFilter" }
        },
        directives: [],
        selectionSet: {
            kind: "SelectionSet",
            selections: [
                {
                    kind: "Field",
                    name: { kind: "Name", value: "key" },
                    arguments: [],
                    directives: []
                },
                {
                    kind: "Field",
                    name: { kind: "Name", value: "value" },
                    arguments: [],
                    directives: []
                },
                { kind: "Field", name: { kind: "Name", value: "__typename" } }
            ]
        }
    }
];
exports.flatten = {
    Client: [
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
    ],
    DashboardInfo: [
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
            name: { kind: "Name", value: "dashboardKey" },
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
            name: { kind: "Name", value: "visibility" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "description" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "owner" },
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
                        name: { kind: "Name", value: "email" },
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
                        name: { kind: "Name", value: "nickname" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "picture" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "createdBy" },
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
                        name: { kind: "Name", value: "email" },
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
                        name: { kind: "Name", value: "nickname" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "picture" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        },
        { kind: "Field", name: { kind: "Name", value: "__typename" } }
    ],
    UserProfile: [
        {
            kind: "Field",
            name: { kind: "Name", value: "id" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "email" },
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
            name: { kind: "Name", value: "nickname" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "picture" },
            arguments: [],
            directives: []
        },
        { kind: "Field", name: { kind: "Name", value: "__typename" } }
    ],
    Focus: [
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
            name: { kind: "Name", value: "focusKey" },
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
            name: { kind: "Name", value: "visibility" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "boardKeys" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "peopleIds" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "multiFilters" },
            arguments: [],
            directives: [],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "key" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "values" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "boolFilters" },
            arguments: [],
            directives: [],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "key" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "value" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "owner" },
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
                        name: { kind: "Name", value: "email" },
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
                        name: { kind: "Name", value: "nickname" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "picture" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "createdBy" },
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
                        name: { kind: "Name", value: "email" },
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
                        name: { kind: "Name", value: "nickname" },
                        arguments: [],
                        directives: []
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "picture" },
                        arguments: [],
                        directives: []
                    },
                    { kind: "Field", name: { kind: "Name", value: "__typename" } }
                ]
            }
        },
        { kind: "Field", name: { kind: "Name", value: "__typename" } }
    ],
    MultiFilter: [
        {
            kind: "Field",
            name: { kind: "Name", value: "key" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "values" },
            arguments: [],
            directives: []
        },
        { kind: "Field", name: { kind: "Name", value: "__typename" } }
    ],
    BoolFilter: [
        {
            kind: "Field",
            name: { kind: "Name", value: "key" },
            arguments: [],
            directives: []
        },
        {
            kind: "Field",
            name: { kind: "Name", value: "value" },
            arguments: [],
            directives: []
        },
        { kind: "Field", name: { kind: "Name", value: "__typename" } }
    ]
};
describe("fragmentMapFrom(fragmentList: FragmentDefinitionNode[]): Dictionary<ReducedFieldNode[]>", () => {
    it("returns an object with each Fragment name as key, and as value the list of all FieldNodes, replacing all fragment spreads for the actual Field nodes, deeply", () => {
        expect(fragment_utils_1.fragmentMapFrom(exports.fragments)).toEqual(exports.flatten);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhZ21lbnQtdXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvX190ZXN0c19fL2ZyYWdtZW50LXV0aWxzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxzREFBb0Q7QUFHdkMsUUFBQSxTQUFTLEdBQTZCO0lBQ2pEO1FBQ0UsSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDdkMsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLFdBQVc7WUFDakIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1NBQ3hDO1FBQ0QsVUFBVSxFQUFFLEVBQUU7UUFDZCxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsY0FBYztZQUNwQixVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsSUFBSSxFQUFFLE9BQU87b0JBQ2IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO29CQUNuQyxTQUFTLEVBQUUsRUFBRTtvQkFDYixVQUFVLEVBQUUsRUFBRTtpQkFDZjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsT0FBTztvQkFDYixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7b0JBQzFDLFNBQVMsRUFBRSxFQUFFO29CQUNiLFVBQVUsRUFBRSxFQUFFO2lCQUNmO2dCQUNEO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtvQkFDckMsU0FBUyxFQUFFLEVBQUU7b0JBQ2IsVUFBVSxFQUFFLEVBQUU7aUJBQ2Y7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLE9BQU87b0JBQ2IsSUFBSSxF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QUFVLEVBQUUsRUFBRTtTQUNmO1FBQ0QsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFO0tBQy9EO0lBQ0QsYUFBYSxFQUFFO1FBQ2I7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNuQyxTQUFTLEVBQUUsRUFBRTtZQUNiLFVBQVUsRUFBRSxFQUFFO1NBQ2Y7UUFDRDtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQzFDLFNBQVMsRUFBRSxFQUFFO1lBQ2IsVUFBVSxFQUFFLEVBQUU7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDN0MsU0FBUyxFQUFFLEVBQUU7WUFDYixVQUFVLEVBQUUsRUFBRTtTQUNmO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUNyQyxTQUFTLEVBQUUsRUFBRTtZQUNiLFVBQVUsRUFBRSxFQUFFO1NBQ2Y7UUFDRDtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzNDLFNBQVMsRUFBRSxFQUFFO1lBQ2IsVUFBVSxFQUFFLEVBQUU7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDNUMsU0FBUyxFQUFFLEVBQUU7WUFDYixVQUFV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