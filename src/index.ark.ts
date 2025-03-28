import { ArkTsSpecification } from 'qvog-lib';
import { Configuration, FilePrintStream, QVoGEngine } from 'qvog-engine';

import {
    FindBinaryOperator,
    FindIf,
    FindInstanceOf,
    FindInvoke,
    FindInvokeAlt,
    FindReference,
    FindReturn,
    FindStringAssignment,
    FindUnion,
    FindDataFlow,
    FindSensitiveData
} from './queries/demo.ark';

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.md", false));

engine.submit([
    FindBinaryOperator,
    FindIf,
    FindInstanceOf,
    FindInvoke,
    FindInvokeAlt,
    FindReference,
    FindReturn,
    FindStringAssignment,
    FindUnion,
    FindDataFlow,
    FindSensitiveData
]);

engine.close();
