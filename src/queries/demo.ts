import { asCodeNode, DataFlow, DfgTraverse, HamiltonFlow, TaintFlow } from "qvog-lib";
import { CodeNode, FlowPredicate, Queryable, ValuePredicate } from "qvog-engine";

export const AllNodes: Queryable = [
    "Get All Nodes", q => q
        .from(f => f.withData(ValuePredicate.any()).as("Nodes"))
        .select(["Nodes", "This is a node"])
];

export const AllCodeNodes: Queryable = [
    "Get All Code Nodes", q => q
        .from(f => f.withData(v => v.stream().any(ValuePredicate.any().test)).as("CodeNodes"))
        .where(f => f.on("CodeNodes").where(ValuePredicate.of(v => v.getNode() instanceof CodeNode)))
        .select(["CodeNodes", "This is a code node"])
];

export const ErrorQuery: Queryable = [
    "Error Query", q => q
        .from(f => f.withData(ValuePredicate.any()).as("Nodes"))
        .where(f => f.on("Not Exists").where(ValuePredicate.any()))
        .select(["Nodes", "This is a node"])
];

export const ExistsDataFlow: Queryable = [
    "Find Data Flow", q => q
        .from(f => f.withData(ValuePredicate.any()).as("Source"))
        .from(f => f.withPredicate(ValuePredicate.any()).as("Sink"))
        .where(f => f.configure({
            flow: new HamiltonFlow(),
            strategy: new DfgTraverse()
        }).source("Source").sink("Sink").as("DataFlow"), () => new DataFlow())
        .where(f => f.on("DataFlow").where(FlowPredicate.of(p => p.getSize() > 1)))
        .select(["Source", "Sink", "DataFlow"])
];

/**
 * Currently this is a Python specific query. The test file is shown below:

def f(p):
    pass

bad = 3
result = 0

a = bad     // source
f(a)        // barrier
result = a  // sink

a = bad     // source
result = a  // sink

 */
export const ExistsTaintFlow: Queryable = [
    "Find Taint Flow", q => q
        .from(f => f.withData(v => v.getCode() === "a = bad").as("Source"))
        .from(f => f.withData(v => v.getCode() === "f(a)").as("Barrier"))
        .from(f => f.withData(v => v.getCode() === "result = a").as("Sink"))
        .where(f => f.source("Source").barrier("Barrier").sink("Sink").as("TaintFlow"), () => new TaintFlow())
        .select(["Source", "Sink", "TaintFlow"])
];
