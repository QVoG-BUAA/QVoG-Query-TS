import { Queryable } from "qvog-engine";
import { AssignStmt, BinaryOperator, InvokeExpr } from "qvog-lib";

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
                (s instanceof AssignStmt) && (s.getValue().getType().getName() === "string")
            ))
            .as("String Assignment"))
        .select(["String Assignment", "This is a string assignment"])
];

export const FindFunctionCall: Queryable = [
    "Find Function Call", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof InvokeExpr) &&
                (s.getTarget() == "foo") &&
                (s.getArg(0).getType().getName() === "number")
            ))
            .as("Call"))
        .select(["Call", "`foo` called with a number argument"])
];
