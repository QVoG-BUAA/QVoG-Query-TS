import { Queryable } from "qvog-engine";
import { AssignStmt, BinaryOperator, InstanceOfExpr, InvokeExpr, ReturnStmt, Variable } from "qvog-lib";

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

export const FindInvoke: Queryable = [
    "Find Invoke", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof InvokeExpr) && (
                    // call to `foo` with a number argument
                    (
                        (s.getTarget() == "foo") &&
                        (s.getArg(0).getType().getName() === "number")
                    ) ||
                    // baz.d
                    (
                        (s.getTarget() === "d") && s.getBase() &&
                        (v => (v instanceof Variable) && (v.getName() === "baz"))(s.getBase())
                    ) ||
                    // baz.e.f
                    (
                        s.getCode().match(/baz\.e\.f/) !== null
                    )
                )
            ))
            .as("Invoke"))
        .select(["Invoke", "Invoke found"])
];

export const FindInstanceOf: Queryable = [
    "Find Instance Of", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof InstanceOfExpr) &&
                (s.getTestType().getName() === "TestObject")
            ))
            .as("Instance Of"))
        .select(["Instance Of", "TestObject instanceof"])
];

export const FindReturn: Queryable = [
    "Find Return", q => q
        .from(f => f
            .withData(v => v.stream().any(s => s instanceof ReturnStmt))
            .as("Return"))
        .select(["Return", "Return statement found"])
];
