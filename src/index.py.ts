import { PythonSpecification } from 'qvog-lib';
import { Configuration, DefaultResultFormatter, FilePrintStream, QVoGEngine } from 'qvog-engine';

import { AllNodes, AllCodeNodes, ErrorQuery, ExistsDataFlow, ExistsTaintFlow } from '~/queries/demo';

Configuration.setSpecification(PythonSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.py.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.submit([AllNodes, AllCodeNodes, ErrorQuery, ExistsDataFlow, ExistsTaintFlow]);

engine.close();
