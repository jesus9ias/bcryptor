import {
  window,
  Disposable
} from 'vscode';
import BcryptButton from './BcryptButton';

class StatusBarButtonsController {
    private _disposable: Disposable;
    private _bcryptLineButton: BcryptButton;
    private _matchLineButton: BcryptButton;

    constructor() {
        this._bcryptLineButton = new BcryptButton('extension.bcrypt-line', 'Bcrypt Lines');
        this._matchLineButton = new BcryptButton('extension.match-line', 'Match Lines');

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
        this._bcryptLineButton.selectCost();
    }

    public matchLine() {
        this._matchLineButton.matchLine();
    }

    dispose() {
        this._disposable.dispose();
    }

    onDidAccept() {
        console.log('ok');
    };
}

export default StatusBarButtonsController;
