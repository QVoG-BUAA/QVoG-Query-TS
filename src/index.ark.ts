import { ArkTsSpecification } from 'qvog-lib';
import { Configuration, FilePrintStream, QVoGEngine } from 'qvog-engine';

import {
    FindBinaryOperator,
    FindInvoke,
    FindInvokeAlt,
    FindReference,
    FindStringAssignment,
    FindUnion,
    FindDataFlowFluent,
    FindDataFlow,
    FindDataFlowAlt,
    FindSensitiveData
} from './queries/demo.ark';

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.md", false));

engine.submit([
    FindBinaryOperator,
    FindInvoke,
    FindInvokeAlt,
    FindReference,
    FindStringAssignment,
    FindUnion,
    FindDataFlowFluent,
    FindDataFlow,
    FindDataFlowAlt,
    FindSensitiveData
]);

engine.close();
