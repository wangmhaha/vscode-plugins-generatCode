import { commands, ExtensionContext } from "vscode";
import { CrudPanel } from "./panels/crudPanel";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showTroyCrudCommand = commands.registerCommand("troy", () => {
    CrudPanel.render(context.extensionUri);

    // 获取配置
  });

  // Add command to the extension context
  context.subscriptions.push(showTroyCrudCommand);
}
