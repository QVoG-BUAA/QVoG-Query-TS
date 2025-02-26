import { ArkTsSpecification } from 'qvog-lib';
import { Configuration, DefaultResultFormatter, FilePrintStream, QVoGEngine } from 'qvog-engine';
import { AllValidNodes, FindBinaryOperator, FindStringAssignment } from './queries/demo.ark';
import { AllNodes } from './queries/demo';

Configuration.setSpecification(ArkTsSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.ark.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.submit([AllNodes, AllValidNodes, FindBinaryOperator, FindStringAssignment]);

engine.close();
