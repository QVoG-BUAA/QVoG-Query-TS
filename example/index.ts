/**
 * This is an example subject file to test the query.
 * Build the graph with Ark2Graph.
 */

// WARNING: inserted nodes will have -1 line number, should we ignore them?

function typeSpec() {
    var any_type: any;
    var unknown_type: unknown;

    // primitive types
    var boolean_type: boolean;
    var number_type: number;
    var string_type: string;
    var null_type: null;
    var undefined_type: undefined;
    var object_type: object;    // WARNING: this is undefined type

    // composite types
    var array_type: any[];
    var tuple_type: [number, string];

    // WARNING: what the?
    // "type": {
    //     "_identifier": "FunctionType",
    //     "name": "@easytest/file.ts: %dflt.%AM0()"
    // }
    var function_type: () => void;
}

function constantSpec() {
    // primitive types
    var boolean_constant = true;
    var number_constant = 1;
    var string_constant = "hello there";
    var null_constant = null;
    var undefined_constant = undefined;

    // composite types
    var array_constant = [1, 2, 3];
    var tuple_constant = [1, "hello there"];
}

function expressionSpec() {
    // variable declaration
    // WARNING: will be converted into assignment statement with undefined value
    var _1: number = 1;
    var _2: number = 2, _3: string = "hello there";

    // assignment
    _1 = 1;
    _2 = _2 = 2;    // WARNING: will be split into two statements

    // WARNING: all expressions will be wrapped into an assignment statement.
    // e.g. `_1 + _2` will be converted into `%0 = _1 + _2`

    // increment/decrement
    // WARNING: will be converted into `_1 = _1 + 1` and `_1 = _1 - 1`
    _1++;
    _1--;
    ++_1;
    --_1;

    // binary operation
    _1 + _2;
    _1 < _2;

    // unary operation
    +_1; // WARNING: will be optimized out (not exits in graph)
    !_1;
}


class TestObject {
    constructor() { }
}

// BUG: This function should have no cycle in CFG, but it has a back edge
//      pointing to the function entry, i.e. `function specialExpressionSpec()`.
//      It seems to be constructor call, which have multiple outgoing edges.
function specialExpressionSpec() {
    var obj = new TestObject();

    // BUG: This will cause stack overflow (recursive call) with function
    //      `getValue` and `getExprValue`.
    // var type = typeof obj;

    // instanceof
    var isTestObject = obj instanceof TestObject;

    // cast
    var castedObj = obj as TestObject;
}

// BUG: This function should have no cycle in CFG, but it has multiple back edges
//      pointing to the function entry, i.e. `function invokeSpec()`.
//      It seems to be constructor call, which have multiple outgoing edges.
function invokeSpec() {
    var func = (i: number): void => { };
    var foo = (i: number, str: string): string => { return str[i]; };
    var bar = () => foo;

    // invocation
    func(1);    // ArkInvokeStmt > ArkStaticInvokeExpr
    // WARNING: `ArkPtrInvokeExpr` and `ArkInvokeExpr`?
    foo(1, "hello");    // ArkAssignStmt > ArkPtrInvokeExpr
    var _ = bar()(2, "there");  // ArkInvokeStmt > ArkStaticInvokeExpr

    var baz = { a: 1, b: { c: 2 }, d: foo, e: { f: foo } };
    baz.a;
    baz.b.c;
    baz.d(3, "general kenobi");
    baz.e.f(4, "you are a bold one");
}

function returnSpec(): number {
    return 1;
}

function ifSpec() {
    var a = 1;
    var b = 2;

    if (a) {

    }

    var func = () => false;
    if (func()) {
        return a;
    }

    if (a < b) {
        return a;
    } else {
        return b;
    }
}

function switchSpec() {
    var a = 1;

    // WARNING: switch statement does not exists in graph?

    switch (a) {
        case 1:
            a = 2;
            break;
        case 2:
            a = 3;
            break;
        default:
            break;
    }
}

class StaticField {
    static a = 1;
}

function refSpec() {
    var obj = { a: 1, b: { c: 2 } };
    var array = [1, 2, 3];
    var value;

    value = obj.a;
    value = array[3];
    value = StaticField.a;
}
