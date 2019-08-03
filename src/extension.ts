import {
    commands,
    ExtensionContext
} from 'vscode';
import StatusBarButtonsController from './StatusBarButtonsController';

export function activate(context: ExtensionContext) {

    const StatusBarButtons = new StatusBarButtonsController();

    const bcryptLineButton = commands
        .registerCommand('extension.bcrypt-line', () => {
        StatusBarButtons.bcryptLine();
    });
    const matchLineButton = commands
        .registerCommand('extension.match-line', () => {
        StatusBarButtons.matchLine();
    });

    context.subscriptions.push(bcryptLineButton);
    context.subscriptions.push(matchLineButton);
    context.subscriptions.push(StatusBarButtons);
}
