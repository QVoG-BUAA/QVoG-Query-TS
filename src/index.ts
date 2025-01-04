import { Configuration, QVoGEngine, PythonSpecification, FilePrintStream, DefaultResultFormatter } from 'qvog-engine';
import { demo } from './demo';

Configuration.setSpecification(PythonSpecification);

let engine = QVoGEngine.getInstance()
    .withOutput(new FilePrintStream("result.md", false))
    .withFormatter(new DefaultResultFormatter())
    .withStyle("markdown");

engine.execute(demo[0], demo[1])

engine.close();
