import { exists, FlowClause, from, query, Queryable, select, where } from "qvog-engine";
import { ArrayType, AssignStmt, BinaryOperator, Constant, DataFlow, IfStmt, InstanceOfExpr, InvokeExpr, P, Reference, ReturnStmt, S, UnionType, Variable } from "qvog-lib";

export const FindBinaryOperator = query("Find Binary Operator", () => {
    from(f => S.data(s => s instanceof BinaryOperator).as("Binary Operator"));

    select("Binary Operator");
});

export const FindStringAssignment = query("Find String Assignment", () => {
    from(f => S.dataOf<AssignStmt>(AssignStmt, s => {
        if ((s.value instanceof Constant) && (s.value.type.name === "string")) {
            return s.value.value === "hello there";
        }
        return false;
    }).as("String Assignment"));

    select("String Assignment", "This is a string assignment");
});

export const FindInvoke: Queryable = [
    "Find Invoke", q => q
        .from(f => S.dataOf<InvokeExpr>(InvokeExpr, s =>
            // call to `foo` with a number argument
            (
                (s.getTarget() == "foo") &&
                (s.getArg(0).type.name === "number")
            ) ||
            // baz.d
            (
                (s.getTarget() === "d") && s.getBase() &&
                (v => (v instanceof Variable) && (v.name === "baz"))(s.getBase())
            ) ||
            // baz.e.f
            (
                s.code.match(/baz\.e\.f/) !== null
            )).as("Invoke"))
        .select("Invoke", "Invoke found")
];

// An alternative way to write the above query.
// Just for fun to check what the Fluent API can do. :)
// Neglect this if you are not interested.
export const FindInvokeAlt: Queryable = [
    "Find Invoke Alt", q => q
        .from(f => S.dataOf<InvokeExpr>(InvokeExpr,
            P<InvokeExpr>(
                t => ((t.getTarget() === "foo") && (t.getArg(0).type.name === "number"))
            ).or<InvokeExpr>(
                P<InvokeExpr>(
                    t => (t.getTarget() === "d") && (t.getBase() instanceof Variable)
                ).and<Variable>(
                    t => t.name === "baz",
                    t => t.getBase()! as Variable
                )
            ).or<InvokeExpr>(
                t => t.code.match(/baz\.e\.f/) !== null
            ).done()).as("Invoke"))
        .select("Invoke", "Invoke found")
];

export const FindInstanceOf: Queryable = [
    "Find Instance Of", q => q
        .from(f => S.dataOf<InstanceOfExpr>(InstanceOfExpr, s =>
            s.testType.name === "TestObject"
        ).as("Instance Of"))
        .select("Instance Of", "TestObject instanceof")
];

export const FindReturn: Queryable = [
    "Find Return", q => q
        .from(f => S.dataOf<ReturnStmt>(ReturnStmt).as("Return"))
        .select("Return", "Return statement found")
];

export const FindIf: Queryable = [
    "Find If", q => q
        .from(f => S.dataOf<IfStmt>(IfStmt).as("If"))
        .select("If", "If statement found")
];

export const FindUnion: Queryable = [
    "Find Union", q => q
        .from(f => S.dataOf<Variable>(Variable,
            P<Variable>(s => s.type instanceof ArrayType)
                .and<ArrayType>(
                    t => t.elementType instanceof UnionType,
                    t => t.type as ArrayType
                ).done()).as("Union"))
        .select("Union", "Union type found")
];

export const FindReference: Queryable = [
    "Find Reference", q => q
        .from(f => S.dataOf<Reference>(Reference).as("Reference"))
        .select("Reference", "Reference found")
];

export const FindDataFlow = query("Find Data Flow", () => {
    from(f => S.dataOf<AssignStmt>(AssignStmt).as("Source"));
    from(f => S.dataOf<BinaryOperator>(BinaryOperator).as("Sink"));

    exists(f => f.source("Source").sink("Sink").as("Flow"), () => new DataFlow());

    select("Flow", "Data flow found");
});
