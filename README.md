# QVoG Query

> THIS PROJECT IS A WORK IN PROGRESS

## Build

To initialize the project, run the following command:

```bash
npm install
```

It depends on [QVoG-Engine](https://github.com/QVoG-BUAA/QVoG-Engine-TS) and [QVoG-Lib](https://github.com/QVoG-BUAA/QVoG-Lib-TS), since they are not yet uploaded to npm, you need to link them to the project. To do this, first run `npm link` in those two repos, and then run the following commands in this project:

```bash
npm link qvog-engine qvog-lib
```

If you have other custom query libraries, you can also link them in the same way.

> Note that the modules added by `npm link` will be removed when you run `npm install` again. And you have to specify all linked modules in one command.

To build the project, run the following command:

```bash
npm run build
```

## Run

Before you run the project, you need to create a `config.json` file in the root directory of the project. For now, it specifies the gremlin connection. The content of the file should be like this:

```json
{
    "gremlin": {
        "host": "localhost",
        "port": 8182
    }
}
```

The entry point of the project is `src/index.ts`. Currently, you have to manually configure the engine and add queries to run. Then, you can build and run the project with the following command:

```bash
npm run dev
```

### Demo

The project now comes with some demo queries in `src/demo.ts`. And the current configuration will output the result in Markdown syntax to `result.md`.

## Future Work

In order to run queries more flexibly, the `index.ts` file should be automatically generated depending on the configurations and queries to run, thus some external scripts are needed.
