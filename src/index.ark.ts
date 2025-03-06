import { ArkTsSpecification } from 'qvog-lib';
import { Configuration, DefaultResultFormatter, FilePrintStream, QVoGEngine } from 'qvog-engine';

import {
    AllValidNodes,
    FindBinaryOperator,
    FindIf,
    FindInstanceOf,
    FindInvoke,
    FindInvokeAlt,
    FindReference,
    FindReturn,
    FindStringAssignment,
    FindUnion
} from './queries/demo.ark';

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.submit([
    AllValidNodes,
    FindBinaryOperator,
    FindIf,
    FindInstanceOf,
    FindInvoke,
    FindInvokeAlt,
    FindReference,
    FindReturn,
    FindStringAssignment,
    FindUnion
]);

engine.close();
