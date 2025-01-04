import { Queryable, Value, ValuePredicate } from "qvog-engine";

const demo: Queryable = [
    "Get All Nodes", q => q
        .from(f => f.withData(new ValuePredicate(v => v instanceof Value)).as("all"))
        .select(["all", "This is a node"])
];

export { demo };
