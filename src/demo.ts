import { CodeNode, Queryable, ValuePredicate } from "qvog-engine";

const AllNodes: Queryable = [
    "Get All Nodes", q => q
        .from(f => f.withData(ValuePredicate.any()).as("Nodes"))
        .select(["Nodes", "This is a node"])
];

const AllCodeNodes: Queryable = [
    "Get All Code Nodes", q => q
        .from(f => f.withData(ValuePredicate.any()).as("CodeNodes"))
        .where(f => f.on("CodeNodes").where(ValuePredicate.of(v => v.getNode() instanceof CodeNode)))
        .select(["CodeNodes", "This is a code node"])
];

export { AllNodes, AllCodeNodes };
