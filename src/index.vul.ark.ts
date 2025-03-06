import { ArkTsSpecification } from 'qvog-lib';
import { Configuration, DefaultResultFormatter, FilePrintStream, QVoGEngine } from 'qvog-engine';

import {
    FindCSRFVulnerability,
    FindExcessiveSQLPrivileges,
    FindInfiniteLoop,
    FindInsecureHttpRequest,
    FindInsecureHttpRequestThroughDataflow,
    FindLocalStoragePassword,
    FindLocalStoragePasswordThroughDataFlow,
    FindLogSensitiveInfo,
    FindMathRandom,
    FindUnsafeRedirect,
    FindXSS
} from './queries/vulnerability.ark'

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.vul.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.submit([
    FindCSRFVulnerability,
    FindExcessiveSQLPrivileges,
    FindInfiniteLoop,
    FindInsecureHttpRequest,
    FindInsecureHttpRequestThroughDataflow,
    FindLocalStoragePassword,
    FindLocalStoragePasswordThroughDataFlow,
    FindLogSensitiveInfo,
    FindMathRandom,
    FindUnsafeRedirect,
    FindXSS
]);

engine.close();
