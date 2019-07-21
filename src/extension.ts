import {
    window,
    commands,
    TextEditor,
    Disposable,
    StatusBarItem,
    ExtensionContext,
    StatusBarAlignment
} from 'vscode';
import { makeHash } from './utils/hasher';

export function activate(context: ExtensionContext) {

    const StatusBarButtons = new StatusBarButtonsController();

    const bcryptLine = commands.registerCommand('extension.bcrypt-line', () => {
        StatusBarButtons.bcryptLine();
    });

    context.subscriptions.push(bcryptLine);
    context.subscriptions.push(StatusBarButtons);
}

class BcryptButton {
    private _editor: TextEditor;
    private _statusBarItem: StatusBarItem;

    constructor(command: string, text: string) {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarItem.text = text;
            this._statusBarItem.command = command;
        }
        this._switchStatusBarItem(this._getEditor());
    }

    public bcryptLine() {
        this._getEditor();
        const parts = this._getParts();

        const result = parts.map(line => this._makeHash(line));

        this._updateText(result.join('\n'));
    }

    public checkForShowing() {
        const editor = this._getEditor();
        this._switchStatusBarItem(editor.document.getText(editor.selection).length > 0);
    }

    private _getEditor() {
        return this._editor = window.activeTextEditor;
    }

    private _switchStatusBarItem(value: any) {
        if (value) {
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    private _getParts() {
        let text = this._editor.document.getText(this._editor.selection);
        return text.split('\n');
    }

    private _updateText(newText: string) {
        this._editor.edit(builder => {
            for (const selection of this._editor.selections) {
                builder.replace(selection, newText);
            }
        });
    }

    private _makeHash(text: string) {
        return makeHash(text);
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class StatusBarButtonsController {
    private _disposable: Disposable;
    private _bcryptLineButton: BcryptButton;

    constructor() {
        this._bcryptLineButton = new BcryptButton('extension.bcrypt-line', 'Bcrypt Line');

        let subscriptions: Disposable[] = [];
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private showButtons() {
        this._bcryptLineButton.checkForShowing();
    }

    private _onEvent() {
        this.showButtons();
    }

    public bcryptLine() {
        this._bcryptLineButton.bcryptLine();
    }

    dispose() {
        this._disposable.dispose();
    }
}