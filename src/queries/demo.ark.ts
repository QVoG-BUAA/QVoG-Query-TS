import { Queryable, Value } from "qvog-engine";
import { Assignment, BinaryOperator } from "qvog-lib";

export const AllValidNodes: Queryable = [
    "Get All Valid Nodes", q => q
        .from(f => f.withData(v => v.isSupported()).as("Node"))
        .select("Node")
];

export const FindBinaryOperator: Queryable = [
    "Find Binary Operator", q => q
        .from(f => f
            .withData(v => v.stream().any(s => s instanceof BinaryOperator))
            .as("Binary Operator"))
        .select("Binary Operator")
];

export const FindStringAssignment: Queryable = [
    "Find String Assignment", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof Assignment) && (s.getValue().getType().getName() === "string")
            ))
            .as("String Assignment"))
        .select(["String Assignment", "This is a string assignment"])
];
