import * as path from 'path';
import * as cp from 'child_process';
import { workspace, ExtensionContext } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  StreamInfo,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const serverPath = 'D:\\dev\\hill\\hill\\bin\\debug\\hill.exe';

  // let serverPath = '';
  if (process.platform === 'win32') {
    // serverPath = context.asAbsolutePath(
    //   path.join('server', 'hill-win-x64.exe')
    // );
  } else if (process.platform === 'darwin') {
    throw Error("We don't support MacOS");
    // serverPath = context.asAbsolutePath(path.join('server', 'hill-macos-x64'));
  } else {
    // Assume Linux
    throw Error("We don't support Linux");
    // serverPath = context.asAbsolutePath(path.join('server', 'hill-linux-x64'));
  }

  // Start the server process
  const serverProcess = cp.spawn(serverPath, ['lsp'], { stdio: 'pipe' });

  // Create the stream info for stdio
  const serverOptions = () =>
    Promise.resolve<StreamInfo>({
      reader: serverProcess.stdout!,
      writer: serverProcess.stdin!,
    });

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'hill' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'hill-lsp',
    'Hill Language Server',
    serverOptions,
    clientOptions
  );

  // context.subscriptions.push(client.start());
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
