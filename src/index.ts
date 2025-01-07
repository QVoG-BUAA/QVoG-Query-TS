import { PythonSpecification } from 'qvog-lib';
import { Configuration, DefaultResultFormatter, FilePrintStream, QVoGEngine } from 'qvog-engine';

import { AllCodeNodes, AllNodes } from './demo';

Configuration.setSpecification(PythonSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.submit([AllNodes, AllCodeNodes]);

engine.close();
