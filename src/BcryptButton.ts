import {
    window,
    TextEditor,
    StatusBarItem,
    StatusBarAlignment,
    QuickPickOptions
} from 'vscode';
import { makeHash, matchHash } from './utils/hasher';

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

    public selectCost() {
        const quickPicker = window.createQuickPick();
        const items = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
        quickPicker.items =items.map(label => ({ label }));
        quickPicker.onDidChangeSelection(selection => {
            quickPicker.dispose()
            if (selection[0]) {
                this.bcryptLine(Number(selection[0].label));
            } else {
                console.log('Non accepted value')
            }
        });
        quickPicker.onDidHide(() => quickPicker.dispose());
        quickPicker.show();
    }

    public bcryptLine(cost: number) {
        this._getEditor();
        const parts = this._getParts();

        const result = parts.map(line => {
            return this._makeHash(line.trim(), cost);
        });

        this._updateText(result.join('\n'));
    }

    public matchLine() {
        this._getEditor();
        const parts = this._getParts();
        const text = parts[0].trim();
        const hash = parts[1].trim();
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

    private _makeHash(text: string, cost: number) {
        return makeHash(text, cost);
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

export default BcryptButton;
