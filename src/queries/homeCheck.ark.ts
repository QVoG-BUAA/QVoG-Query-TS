import { CodeNode, FlowPredicate, Queryable, ValuePredicate } from "qvog-engine";
import { AssignStmt, BinaryOperator, Constant, InvokeExpr, InvokeStmt, Variable, DataFlow, DfgTraverse, HamiltonFlow, TaintFlow, FieldReference, Statement, IfStmt } from "qvog-lib";

export const FindLocalStoragePassword: Queryable = [
    "Find LocalStorage Password", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof InvokeExpr) && ((
                    (s.getTarget() === "setItem") &&
                    (base => base && base instanceof Variable ?
                        base.getName() === 'localStorage' : false)(s.getBase())
                ) || s.getCode().match(/localStorage\.setItem/) !== null) &&
                (arg0 => arg0 instanceof Constant && arg0.getType().getName() === "string" ?
                    ["password", "pwd", "pw", "passwd", "pass", "passw", "pswd"].includes(arg0.getValue()) : false)(s.getArg(0))
            ))
            .as("Warning"))
        .select("Warning")
];

export const FindLocalStoragePasswordThroughDataFlow: Queryable = [
    "Find Data Flow", q => q
        .from(f => f.withData(v => v.stream().any(s =>
            s instanceof AssignStmt && ((value => value instanceof Variable &&
                value.getName() === "localStorage")(s.getValue()) || (
                    (value => value instanceof FieldReference ? value.getName() === "localStorage" &&
                        (base => base instanceof Variable ? base.getName() === "window" : false)(value.getBase()) : false
                    )(s.getValue())
                ))
        )).as("Source"))
        .from(f => f.withPredicate(s => {
            if (s instanceof InvokeStmt) {
                let expr: InvokeExpr = s.getExpression();
                return expr.getTarget() === "setItem" && (arg0 => arg0 instanceof Constant && arg0.getType().getName() === "string" ?
                    ["password", "pwd", "pw", "passwd", "pass", "passw", "pswd"].includes(arg0.getValue()) : false)(expr.getArg(0))
            }
            return false;
        }).as("Sink"))
        .where(f => f.configure({
            flow: new HamiltonFlow(),
            strategy: new DfgTraverse()
        }).source("Source").sink("Sink").as("DataFlow"), () => new DataFlow())
        .where(f => f.on("DataFlow").where(FlowPredicate.of(p => p.getSize() > 1)))
        .select(["Source", "Sink", "DataFlow"])
];

export const FindMathRandom: Queryable = [
    "Find Math Random", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof InvokeExpr) && s.getTarget() === "random" &&
                (base => base instanceof Variable ? base.getName() === 'Math' : false)(s.getBase())
            )).as("Warning"))
        .select("Warning")
];

export const FindLogSensitiveInfo: Queryable = [
    "Find Log Sensitive Info", q => q
        .from(f => f
            .withData(v => v.stream().any(s =>
                (s instanceof AssignStmt) && (target => target instanceof Variable ? target.getName() === 'cardNumber' || target.getName() === 'cvv' : false)(s.getTarget())
            )).as("Source"))
        .from(f => f.withPredicate(v => v.stream().any(s =>
            s instanceof InvokeExpr && s.getTarget() === "log" && (base => base instanceof Variable ? base.getName() == "console" : false)(s.getBase()))).as("Sink"))
        .where(f => f.configure({
            flow: new HamiltonFlow(),
            strategy: new DfgTraverse()
        }).source("Source").sink("Sink").as("DataFlow"), () => new DataFlow())
        .select(["Source", "Sink", "DataFlow"])
];

export const FindUnsafeRedirect: Queryable = [
    "Find Unsafe Redirect", q => q
        .from(f => f.withData(v => v.stream().any(s =>s instanceof FieldReference && 
            s.getName() === "url")).as("Source"))
        .from(f => f.withPredicate(s => s instanceof InvokeStmt && 
            (expr => expr instanceof InvokeExpr && expr.getTarget() === "redirect")(s.getExpression())).as("Sink"))
        .from(f => f.withPredicate(s => s instanceof IfStmt).as("Barrier"))
        .where(f => f.source("Source").barrier("Barrier").sink("Sink").as("TaintFlow"), () => new TaintFlow())
        .select(["Source", "Sink", "TaintFlow"])
];

export const FindXSS: Queryable = [
    "Find XSS", q => q
        .from(f => f.withData(v => v.stream().any(s =>
            s instanceof AssignStmt && (value => value instanceof Constant && value.getType().getName() === "string" && value.getValue().match(/<script>.*<\/script>/) !== null
            )(s.getValue())
        )).as("Source"))
        .from(f => f.withPredicate(s => s instanceof AssignStmt &&
            (target => target instanceof FieldReference && target.getName() === "innerHTML")(s.getTarget())).as("Sink"))
        .from(f => f.withPredicate(v => v.stream().any(s =>
            s instanceof InvokeExpr && s.getTarget() === "sanitize")).as("Barrier"))
        .where(f => f.source("Source").barrier("Barrier").sink("Sink").as("TaintFlow"), () => new TaintFlow())
        .select(["Source", "Sink", "TaintFlow"])
];

export const FindInfiniteLoop: Queryable = [
    "Find Infinite Loop", q => q
        .from(f => f.withData(v => v.stream().any(s =>
            (s instanceof Statement) &&
            (
                /while\s*\(\s*(true|1==1|1)\s*\)/.test(s.getCode()) ||
                /for\s*\(\s*;\s*(true|1==1|1)?\s*;\s*\)/.test(s.getCode()) ||
                /do\s*\{[\s\S]*?\}\s*while\s*\(\s*(true|1==1|1)\s*\)/.test(s.getCode())
            )
        )).as("InfiniteLoop"))
        .select(["InfiniteLoop"])
];

export const FindInsecureHttpRequest: Queryable = [
    "Find Insecure HTTP Request", q => q
        //XMLHttpRequest、axios
        .from(f => f.withData(v => v.stream().any(s =>
        ((s instanceof InvokeExpr) && (() => {
            const target = s.getTarget();
            const base = s.getBase();
            const arg0 = s.getArg(0);
            const arg1 = s.getArg(1);

            //console.log(target);
            const isFetch = ["fetch"].includes(target) &&
                arg0 instanceof Constant;

            const isAxios = (base instanceof Variable) &&
                base.getName() === "axios" &&
                ["get", "post", "put", "delete"].includes(target) &&
                arg0 instanceof Constant;

            const isXHR = (base instanceof Variable) &&
                base.getType().getName().includes("XMLHttpRequest") &&
                //console.log(base?.getType().getName());
                target === "open" &&
                s.getArg(1) instanceof Constant;

            let url;
            if (isAxios || isFetch) {
                url = arg0 instanceof Constant ? arg0.getValue() : "";
            }
            else {
                url = arg1 instanceof Constant ? arg1.getValue() : "";
            }
            const isSecure = url.startsWith("https://");
            return (isAxios || isXHR || isFetch) && !isSecure;
        })())
        )).as("InsecureHttpRequest"))
        .select(["InsecureHttpRequest"])
];

export const FindInsecureHttpRequestThroughDataflow: Queryable = [
    "Find Insecure HTTP Request Data Flow", q => q
        .from(f => f.withData(v => v.stream().any(s =>
            s instanceof AssignStmt && (value => {
                return value instanceof Constant &&
                    value.getType().getName() === "string" &&
                    value.getValue().startsWith("http://");
            })(s.getValue())
        )).as("Source"))

        .from(f => f.withPredicate(s => {
            if (!(s instanceof InvokeStmt)) return false;
            const expr = s.getExpression();
            const isFetch = expr.getTarget() === "fetch" &&
                expr.getArgsCount() > 0 &&
                expr.getArg(0) instanceof Variable;

            const isAxios = (expr.getBase() instanceof Variable) &&
                (() => {
                    const base = expr.getBase() as Variable;
                    return base.getName() === "axios";
                })() &&
                ["get", "post", "put", "delete"].includes(expr.getTarget()) &&
                expr.getArgsCount() > 0 &&
                expr.getArg(0) instanceof Variable;

            const isXHR = expr.getBase() instanceof Variable &&
                expr.getBase()?.getType().getName().includes("XMLHttpRequest") &&
                expr.getTarget() === "open" &&
                expr.getArgsCount() > 1 &&
                expr.getArg(1) instanceof Variable;
            if (isFetch || isAxios || isXHR)
                return true;
            return false;
        }).as("Sink"))

        .where(f => f.configure({
            flow: new HamiltonFlow(),
            strategy: new DfgTraverse()
        }).source("Source").sink("Sink").as("DataFlow"), () => new DataFlow())
        .select(["Source", "Sink", "DataFlow"])
];

export const FindCSRFVulnerability: Queryable = [
    "Find CSRF Vulnerability", q => q
        .from(f => f.withData(v => v.stream().any(s =>
            s instanceof InvokeStmt &&
            (expr => {
                if (!(expr instanceof InvokeExpr)) return false;

                const isFetch = expr.getTarget() === "fetch";
                const arg0 = expr.getArg(0);
                const arg1 = expr.getArg(1);
                if (isFetch && arg1 instanceof Variable) {
                    console.log(arg1);
                    //console.log(expr.getTarget());
                    //console.log(expr.getArgsCount());
                }

                //console.log(expr.getArg(1).getCode()); 
                //const hasUnsafeMethod = !!(arg1 && arg1.getCode().match(/method\s*:\s*['"](POST|PUT|DELETE)['"]/));

                return isFetch && arg0 instanceof Constant;
                //&& hasUnsafeMethod;
            })(s.getExpression())
        )).as("CSRFSource"))
        // .from(f => f.withPredicate(s => {
        //     if (!(s instanceof InvokeStmt)) return false;

        //     const expr = s.getExpression() as InvokeExpr;
        //     const arg1 = expr.getArg(1);
        //     const hasHeaders = arg1 && !!arg1.getCode().match(/headers\s*:\s*\{/);
        //     const hasCSRFToken = arg1 && !!arg1.getCode().match(/['"]CSRF-Token['"]/);

        //     return hasHeaders && !hasCSRFToken;
        // }).as("CSRFVulnerability"))

        // .where(f => f.configure({
        //     flow: new HamiltonFlow(),
        //     strategy: new DfgTraverse()
        // }).source("CSRFSource").sink("CSRFVulnerability").as("UnprotectedFlow"), () => new DataFlow())
        //.select(["CSRFSource", "CSRFVulnerability", "UnprotectedFlow"])
        .select(["CSRFSource"])
];

export const FindExcessiveSQLPrivileges: Queryable = [
    "Find Excessive SQL Privileges", q => q
        .from(f => f.withData(v => v.stream().any(s =>
            s instanceof AssignStmt && (value => {
                return value instanceof Constant &&
                    value.getType().getName() === "string" &&
                    /GRANT\s+ALL\s+PRIVILEGES/i.test(value.getValue()) &&
                    /ON\s+.*\*.*\s+TO/i.test(value.getValue());
            })(s.getValue())
        )).as("Source"))

        .from(f => f.withPredicate(s => {
            if (!(s instanceof InvokeStmt)) return false;

            const expr = s.getExpression() as InvokeExpr;
            const target = expr.getTarget();
            const arg0 = expr.getArg(0);
            const isSQLExecute = ["execute", "query", "run"].includes(target);

            return isSQLExecute && (arg0 instanceof Variable || arg0 instanceof Constant);
        }).as("Sink"))

        .where(f => f.configure({
            flow: new HamiltonFlow(),
            strategy: new DfgTraverse()
        }).source("Source").sink("Sink").as("DataFlow"), () => new DataFlow())
        .select(["Source", "Sink", "DataFlow"])
];
