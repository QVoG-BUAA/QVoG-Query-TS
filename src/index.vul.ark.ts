import { Configuration, QVoGEngine, FilePrintStream, DefaultResultFormatter } from 'qvog-engine';
import { ArkTsSpecification } from 'qvog-lib';
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
} from './queries/vulnerability.ark'

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.vul.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

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
