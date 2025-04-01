import { exists, FlowPath, FlowPredicate, nodes, pattern, predicate, query, report, where } from "qvog-engine";
import { ArrayType, AssignStmt, BinaryOperator, Constant, DataFlow, flow, InvokeExpr, P, Predicate, Q, Reference, UnionType, value, Variable } from "qvog-lib";

export const FindBinaryOperator = query("Find Binary Operator", () => {
    const ops = nodes(Q(BinaryOperator));

    report(ops);
});

export const FindStringAssignment = query("Find String Assignment", () => {
    const assignments = nodes(Q(AssignStmt, s => {
        if ((s.value instanceof Constant) && (s.value.type.name === "string")) {
            return s.value.value === "hello there";
        }
        return false;
    }));

    report(assignments, "This is a string assignment");
});

export const FindInvoke = pattern("Find Invoke", q => q
    .from(f => f.withData(v => v.stream().any(Q(InvokeExpr, s =>
        // call to `foo` with a number argument
        (
            (s.target == "foo") &&
            (s.args[0].type.name === "number")
        ) ||
        // baz.d
        (
            (s.target === "d") && s.base &&
            Q(Variable, v => v.name === "baz")(s.base)
        ) ||
        // baz.e.f
        (
            s.code.match(/baz\.e\.f/) !== null
        )))).as("Invoke"))
    .select("Invoke", "Invoke found")
);

// An alternative way to write the above query.
// Just for fun to check what the Fluent API can do. :)
// Neglect this if you are not interested.
export const FindInvokeAlt = pattern("Find Invoke Alt", q => q
    .from(f => f.withData(v => v.stream().any(Q(InvokeExpr,
        P<InvokeExpr>(
            t => ((t.target === "foo") && (t.args[0].type.name === "number"))
        ).or<InvokeExpr>(
            P<InvokeExpr>(
                t => (t.target === "d") && (t.base instanceof Variable)
            ).and<Variable>(
                t => t.name === "baz",
                t => t.base! as Variable
            )
        ).or<InvokeExpr>(
            t => t.code.match(/baz\.e\.f/) !== null
        ).done()))).as("Invoke"))
    .select("Invoke", "Invoke found")
);

export const FindUnion = pattern("Find Union", q => q
    .from(f => f.withData(v => v.stream().any(Q(Variable,
        P<Variable>(s => s.type instanceof ArrayType)
            .and<ArrayType>(
                t => t.elementType instanceof UnionType,
                t => t.type as ArrayType
            ).done()))).as("Union"))
    .select("Union", "Union type found")
);

// FIXME: is it OK to instanceof an abstract class?
export const FindReference = pattern(
    "Find Reference", q => q
        .from(f => f.withData(v => v.stream().any(w => w instanceof Reference)).as("Reference"))
        .select("Reference", "Reference found")
);

export const FindDataFlowFluent = pattern("Find Data Flow Fluent", q => q
    .from(f => f.withData(Q(AssignStmt, Q(Variable, v => v.name === 'a', v => v.target))).as("source"))
    .from(f => f.withPredicate(v => v.stream().any(Q(BinaryOperator))).as("sink"))
    .exists(f => f.source("source").sink("sink").as("path"), () => new DataFlow())
    .where(f => f.on("path").where(FlowPredicate.of((p: FlowPath) => p.size > 1)))
    .select("source", "sink", "path", "Data flow found")
);

// Exactly the same as `FindDataFlowFluent` but using non-fluent API and non-nested Q.
export const FindDataFlow = query("Find Data Flow", () => {
    const source = nodes(Q(AssignStmt, v => v.target instanceof Variable && v.target.name === 'a'));
    const sink = predicate(Q(BinaryOperator));

    const path = exists(DataFlow, source, sink);

    // The type annotation here can be omitted, added for clarity.
    where(flow(path, (p: FlowPath) => p.size > 1));

    report(source, sink, path, "Data flow found");
});

// The same as `FindDataFlow`, but with some changes in behavior.
export const FindDataFlowAlt = query("Find Data Flow Alt", () => {
    const source = nodes(Q(AssignStmt));
    const sink = predicate(Q(BinaryOperator));

    // Demonstrates filtering nodes.
    // Since we only ensured the source node's AST **contains** `AssignStmt` in `nodes`,
    // we can further filter the ones that has `AssignStmt` as the root node with some
    // other conditions.
    where(value(source, Q(AssignStmt, v => v.target instanceof Variable && v.target.name === 'a')));

    // The rest are the same as `FindDataFlow`.

    const path = exists(DataFlow, source, sink);

    where(flow(path, p => p.size > 1));

    report(source, sink, path, "Data flow found");
});


function checkLocalStorage(keywords: string[]): Predicate<InvokeExpr> {
    return P<InvokeExpr>(s => s.target === "setItem")
        .and<Variable>(s => s.name == "localStorage", v => v.base! as Variable, Variable)
        .and(s => s.argCount === 2)
        .and<Constant>(
            s => keywords.includes(s.stringValue),
            s => s.args[0] as Constant,
            Constant
        )
        .done();
}

export const FindSensitiveData = query("Find Sensitive Data", () => {
    const s = nodes(Q(InvokeExpr, checkLocalStorage(
        ["password", "pwd"]
    )));

    report(s, "Sensitive data found");
});
