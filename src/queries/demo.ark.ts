import { from, query, Queryable, select, Type, Value } from "qvog-engine";
import { ArrayType, AssignStmt, BinaryOperator, Constant, IfStmt, InstanceOfExpr, InvokeExpr, P, Reference, ReturnStmt, UnionType, Variable } from "qvog-lib";

export const FindBinaryOperator = query("Find Binary Operator", () => {
    from(f => f
        .withData(v => v.stream().any(s => s instanceof BinaryOperator))
        .as("Binary Operator"));
    select("Binary Operator");
});

export const FindStringAssignment = query("Find String Assignment", () => {
    from(f => f
        .withData(v => v.stream().any(s => {
            if (s instanceof AssignStmt) {
                const value = s.getValue();
                if ((value instanceof Constant) && (value.getType().getName() === "string")) {
                    return value.getValue() === "hello there";
                }
            }
            return false;
        }))
        .as("String Assignment"));
    select("String Assignment", "This is a string assignment");
});

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
        .select("Invoke", "Invoke found")
];

// An alternative way to write the above query.
// Just for fun to check what the Fluent API can do. :)
// Neglect this if you are not interested.
export const FindInvokeAlt: Queryable = [
    "Find Invoke Alt", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                P<Value>(s => s instanceof InvokeExpr).and(
                    P<InvokeExpr>(
                        t => ((t.getTarget() === "foo") && (t.getArg(0).getType().getName() === "number"))
                    ).or<InvokeExpr>(
                        P<InvokeExpr>(
                            t => (t.getTarget() === "d") && (t.getBase() instanceof Variable)
                        ).and<Variable>(
                            t => t.getName() === "baz",
                            t => t.getBase()! as Variable
                        )
                    ).or<InvokeExpr>(
                        t => t.getCode().match(/baz\.e\.f/) !== null
                    )
                ).test(s)))
            .as("Invoke"))
        .select("Invoke", "Invoke found")
];

export const FindInstanceOf: Queryable = [
    "Find Instance Of", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof InstanceOfExpr) &&
                (s.getTestType().getName() === "TestObject")
            ))
            .as("Instance Of"))
        .select("Instance Of", "TestObject instanceof")
];

export const FindReturn: Queryable = [
    "Find Return", q => q
        .from(f => f
            .withData(v => v.stream().any(s => s instanceof ReturnStmt))
            .as("Return"))
        .select("Return", "Return statement found")
];

export const FindIf: Queryable = [
    "Find If", q => q
        .from(f => f
            .withData(v => v.stream().any(s => s instanceof IfStmt))
            .as("If"))
        .select("If", "If statement found")
];

export const FindUnion: Queryable = [
    "Find Union", q => q
        .from(f => f
            .withData(v => v.stream().any(s => P<Value>(s => s instanceof Variable)
                .and<Type>(
                    t => t instanceof ArrayType,
                    s => s.getType()
                )
                .and<ArrayType>(
                    t => t.getElementType() instanceof UnionType
                )
                .test(s)
            ))
            .as("Union"))
        .select("Union", "Union type found")
];

export const FindReference: Queryable = [
    "Find Reference", q => q
        .from(f => f
            .withData(v => v.stream().any(s => s instanceof Reference))
            .as("Reference"))
        .select("Reference", "Reference found")
];
