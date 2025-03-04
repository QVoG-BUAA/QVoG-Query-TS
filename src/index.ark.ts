import { ArkTsSpecification } from 'qvog-lib';
import { Configuration, DefaultResultFormatter, FilePrintStream, QVoGEngine } from 'qvog-engine';

import {
    AllValidNodes,
    FindBinaryOperator,
    FindInvoke,
    FindInstanceOf,
    FindReturn,
    FindStringAssignment,
    FindIf
} from './queries/demo.ark';
import {
    FindLocalStoragePassword,
    FindLocalStoragePasswordThroughDataFlow,
    FindMathRandom,
    FindLogSensitiveInfo,
    FindUnsafeRedirect,
    FindXSS,
    FindInfiniteLoop,
    FindInsecureHttpRequest,
    FindInsecureHttpRequestThroughDataflow,
    FindCSRFVulnerability,
    FindExcessiveSQLPrivileges,

} from './queries/homeCheck.ark'

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.submit([
    AllValidNodes,
    FindBinaryOperator,
    FindStringAssignment,
    FindInvoke,
    FindInstanceOf,
    FindReturn,
    FindIf
]);

engine.submit([
    FindLocalStoragePassword,
    FindLocalStoragePasswordThroughDataFlow,
    FindMathRandom,
    FindLogSensitiveInfo,
    FindUnsafeRedirect,
    FindXSS,
    FindInfiniteLoop,
    FindInsecureHttpRequest,
    FindInsecureHttpRequestThroughDataflow,
    FindCSRFVulnerability,
    FindExcessiveSQLPrivileges,
    
]);

engine.close();
