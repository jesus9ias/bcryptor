import {
    window,
    commands,
    TextEditor,
    Disposable,
    StatusBarItem,
    ExtensionContext,
    StatusBarAlignment
} from 'vscode';
import { makeHash, matchHash } from './utils/hasher';

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

        const result = parts.map(line => {
            return this._makeHash(line.trim());
        });

        this._updateText(result.join('\n'));
    }

    public matchLine() {
        this._getEditor();
        const parts = this._getParts();
        const text = parts[0].trim();
        const hash = parts[1];
        if (text && hash) {
            if (matchHash(text, hash)) {
                window.showInformationMessage('Text Match with bcrypt hash');
            } else {
                window.showWarningMessage('Text didn`t match with bcrypt hash');
            }
        } else {
            window.showErrorMessage('Need to provide two lines: first line is the plain text and second line is bcrypted text');
        }
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
    private _matchLineButton: BcryptButton;

    constructor() {
        this._bcryptLineButton = new BcryptButton('extension.bcrypt-line', 'Bcrypt Line');
        this._matchLineButton = new BcryptButton('extension.match-line', 'Match Line');

        let subscriptions: Disposable[] = [];
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private showButtons() {
        this._bcryptLineButton.checkForShowing();
        this._matchLineButton.checkForShowing();
    }

    private _onEvent() {
        this.showButtons();
    }

    public bcryptLine() {
        this._bcryptLineButton.bcryptLine();
    }

    public matchLine() {
        this._matchLineButton.matchLine();
    }

    dispose() {
        this._disposable.dispose();
    }
}