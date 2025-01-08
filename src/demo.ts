import { DataFlow } from "qvog-lib";
import { CodeNode, FlowPredicate, Queryable, ValuePredicate } from "qvog-engine";

export const AllNodes: Queryable = [
    "Get All Nodes", q => q
        .from(f => f.withData(ValuePredicate.any()).as("Nodes"))
        .select(["Nodes", "This is a node"])
];

export const AllCodeNodes: Queryable = [
    "Get All Code Nodes", q => q
        .from(f => f.withData(ValuePredicate.of(v => v.stream().any(ValuePredicate.any().test))).as("CodeNodes"))
        .where(f => f.on("CodeNodes").where(ValuePredicate.of(v => v.getNode() instanceof CodeNode)))
        .select(["CodeNodes", "This is a code node"])
];

export const ExistsDfg: Queryable = [
    "Find DFG Path", q => q
        .from(f => f.withData(ValuePredicate.any()).as("Source"))
        .from(f => f.withPredicate(ValuePredicate.any()).as("Sink"))
        .where(f => f.source("Source").sink("Sink").as("DFG"), () => new DataFlow())
        .where(f => f.on("DFG").where(FlowPredicate.of(p => p.getSize() > 1)))
        .select(["Source", "Sink", "DFG"])
];
