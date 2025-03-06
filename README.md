# QVoG Query

> [!NOTE]
> This is a demo collection of queries for QVoG Engine.

## Build

To initialize the project, run the following command:

```bash
npm install
```

If you have [`qvog-engine`](https://github.com/QVoG-BUAA/QVoG-Engine-TS) and [`qvog-lib`](https://github.com/QVoG-BUAA/QVoG-Lib-TS) locally, link them after installing the dependencies.

```bash
npm link qvog-engine qvog-lib
```

If you have other custom query libraries, you can also link them in the same way.

> [!NOTE] Note that the modules added by `npm link` will be removed when you run `npm install` again. And you have to specify all linked modules in one command.

> [!ERROR] For `qvog-engine` or `qvog-lib`, you must ensure they are both local or from NPM, or package duplication will occur, causing runtime type identification to fail.

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

The entry point of the project is `src/index.ts`, which should be generated from DSL. However, this translation is not yet complete, so you have to manually write query with the underlying API. Currently, only ArkTS is partially supported, and its entry points is `src/index.ark.ts`. To build and run the queries, use the following command.

```bash
./run.ps1 index.ark      # run demo
./run.ps1 index.vul.ark  # run vulnerability demo
```

> [!NOTE]
> Once DSL translation is ready, you can use `npm run dev` to run queries.

### Demo

The project now comes with some demo queries in `src/queries`. And the current configuration will output the result in Markdown syntax to `result.<language>[.<tag>].md`.

## Future Work

In order to run queries more flexibly, the `index.ts` file should be automatically generated depending on the configurations and queries to run, thus some external scripts are needed.
