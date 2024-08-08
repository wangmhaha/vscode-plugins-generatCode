import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
  workspace,
} from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import type { interfaceCodeDataType } from "../data.d";
import Handlebars from "handlebars";
import * as path from "path";
const fs = require("fs");
/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class CrudPanel {
  public static currentPanel: CrudPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * The CrudPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);

    //获取配置并发送消息给webview
    this._getWorkSpaceConfig();

    // 监听webivew切换并且显示事件
    this._onDidChangeViewState();
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri) {
    if (CrudPanel.currentPanel) {
      // If the webview panel already exists reveal it
      CrudPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "crudView",
        // Panel title
        "Crud",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
          localResourceRoots: [
            Uri.joinPath(extensionUri, "out"),
            Uri.joinPath(extensionUri, "webview-ui/build"),
          ],
        }
      );
      CrudPanel.currentPanel = new CrudPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    CrudPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);

    const antdUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "antd.js",
    ]);

    const antdCssUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "react.js",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" crossorigin href="${stylesUri}">
          <link rel="modulepreload" crossorigin href="${antdCssUri}">
          <link rel="modulepreload" crossorigin href="${antdUri}">
          <title>Troy CRUD</title>
          </head>
          <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "ready":
            // Code that should run in response to the hello message command
            // window.showInformationMessage(text);
            console.log("ready");
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside media/main.js)
          case "error":
            window.showErrorMessage(text);
            return;
          // 生成代码逻辑
          case "generatCode":
            this._generatCode(JSON.parse(text));
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  // 监听webivew切换并且显示事件
  private _onDidChangeViewState() {
    this._panel.onDidChangeViewState(
      (e) => {
        // 当前webview显示时获取配置
        if (e.webviewPanel.visible) {
          // 获取配置
          this._getWorkSpaceConfig();
        }
      },
      undefined,
      this._disposables
    );
  }

  // 获取配置信息并发送给webview
  private _getWorkSpaceConfig() {
    const workspaceFolders = workspace.workspaceFolders;
    if (workspaceFolders) {
      const workspacePath = workspaceFolders[0].uri.fsPath;
      const configFilePath = path.join(
        workspacePath,
        ".vscode",
        "project.json"
      );

      fs.readFile(
        configFilePath,
        "utf8",
        (err: { message: any }, data: string) => {
          if (err) {
            window.showErrorMessage(`获取配置失败: ${err.message}`);
            return;
          }

          try {
            const config = JSON.parse(data);
            this._panel.webview.postMessage({
              command: "config",
              data: config,
            });
          } catch (err) {
            window.showErrorMessage(`获取配置失败`);
          }
        }
      );
    }
  }

  // 生成代码逻辑
  private _generatCode(data: interfaceCodeDataType) {
    const workspaceFolders = workspace.workspaceFolders;
    if (workspaceFolders) {
      this._registerHandlebarsHelper();
      const workspacePath = workspaceFolders[0].uri.fsPath;

      const codeFilePath = path.join(workspacePath, data.path);

      const codeFileList = [
        "index.hbs",
        "add.hbs",
        "edit.hbs",
        "view.hbs",
        "basicForm.hbs",
        "data.d.hbs",
        "service.hbs",
      ];
      const writeFileList = [
        "index.tsx",
        "add.tsx",
        "edit.tsx",
        "view.tsx",
        "basicForm.tsx",
        "data.d.ts",
        "service.ts",
      ];

      codeFileList.forEach((item: string, index: number) => {
        const writeCodePath = path.join(codeFilePath, writeFileList[index]);
        fs.readFile(
          path.join(__dirname, "../template", item),
          "utf8",
          (err: { message: any }, codeTemplate: string) => {
            if (err) {
              window.showErrorMessage(`读取模板文件失败: ${err.message}`);
              return;
            }
            try {
              const template = Handlebars.compile(codeTemplate);
              const code = template(data);

              // 判断路径是否存在，不存在则创建
              if (!fs.existsSync(codeFilePath)) {
                fs.mkdirSync(codeFilePath, { recursive: true });
              }

              // 判断文件是否存在，不存在则创建
              if (!fs.existsSync(writeCodePath)) {
                fs.writeFileSync(writeCodePath, "");
              }

              // 写入代码
              fs.writeFile(writeCodePath, code, (err: { message: any }) => {
                if (err) {
                  window.showErrorMessage(`写入文件失败: ${err.message}`);
                  return;
                }
              });
            } catch (err) {
              console.log("err", err);
              window.showErrorMessage(`获取配置失败`);
            }
          }
        );
      });

      window.showInformationMessage("生成代码成功!, 开始你的编码吧！");
    }
  }

  // 注册Handlebars helper
  private _registerHandlebarsHelper() {
    // 注册{{}}
    Handlebars.registerHelper("reactExpr", function (this: any, options) {
      return "{{" + options.fn(this) + "}}";
    });
    // 注册eq
    Handlebars.registerHelper("eq", function (v1, v2) {
      return v1 === v2;
    });
    // 注册首字母大写
    Handlebars.registerHelper("capitalize", function (str) {
      if (str && typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      return str;
    });
    // 注册把integer类型转换为number
    Handlebars.registerHelper("integerToNumber", function (str) {
      if (str === "integer") {
        return "number";
      }
      return str;
    });
  }
}
