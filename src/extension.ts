import * as vscode from 'vscode';
import { getWebviewContent, getResultsWebviewContent } from './getWebviewContent';

interface QueryData {
    enabled: boolean;
    query: string;
    backgroundColor: string;
    foregroundColor: string;
    type: 'plain' | 'regex';
    isWholeLine: boolean;
    wrap: boolean;
}

let queryView: vscode.WebviewView | undefined = undefined;
let resultsView: vscode.WebviewView | undefined = undefined;
const decorationTypes: vscode.TextEditorDecorationType[] = [];
let activeEditor: vscode.TextEditor | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
    const queryProvider = new SearchQueryViewProvider(context);
    const resultsProvider = new SearchResultsViewProvider(context);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'omniSearchView',
            queryProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'omniSearchResultsView',
            resultsProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

    // Track active editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        activeEditor = editor;
    });
    
    // Initialize with current editor
    activeEditor = vscode.window.activeTextEditor;
}

class SearchQueryViewProvider implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ) {
        queryView = webviewView;
        
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')]
        };

        const toolkitUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'toolkit.js')
        );
        const codiconUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'codicon.css')
        );

        const nonce = getNonce();
        webviewView.webview.html = getWebviewContent(
            webviewView.webview.cspSource,
            toolkitUri,
            codiconUri,
            nonce
        );

        webviewView.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'exportQueries':
                        exportQueriesToFile(message.queries);
                        return;
                    case 'importQueries':
                        await importQueriesFromFile(queryView);
                        return;
                    case 'search':
                        handleSearch(message.queries);
                        return;
                    case 'goToLine':
                        handleGoToLine(message.line, message.character);
                        return;
                    case 'clear':
                        handleClear();
                        return;
                    case 'wrapToggle':
                        if (resultsView) {
                            resultsView.webview.postMessage({ command: 'wrapToggle', wrap: message.wrap });
                        }
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );
    }
}

class SearchResultsViewProvider implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ) {
        resultsView = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                vscode.Uri.joinPath(this.context.extensionUri, 'images')
            ]
        };

        const codiconUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'codicon.css')
        );

        const iconUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'images', 'icon.png')
        );

        const nonce = getNonce();
        webviewView.webview.html = getResultsWebviewContent(
            webviewView.webview.cspSource,
            codiconUri,
            iconUri,
            nonce
        );

        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'goToLine':
                        handleGoToLine(message.line, message.character);
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );
    }
}

function handleSearch(queries: QueryData[]) {
    const searchEditor = activeEditor;
    
    if (!searchEditor) {
        vscode.window.showWarningMessage('No active text editor found. Please open a file and make sure it is visible.');
        if (resultsView) {
            resultsView.webview.postMessage({ command: 'noEditor', message: 'No active text editor found. Please open a file first.' });
        }
        return;
    }
    
    const document = searchEditor.document;
    const decorations: vscode.DecorationOptions[][] = [];
    const results = [];
    
    // Clear previous decorations
    clearAllDecorations();

    for (let i = 0; i < queries.length; i++) {
        const queryData = queries[i];
        if (queryData.enabled && queryData.query) {
            const decorationOptions: vscode.DecorationRenderOptions = {
                isWholeLine: queryData.isWholeLine,
                backgroundColor: queryData.backgroundColor,
                color: queryData.foregroundColor,
            };

            const decorationType = vscode.window.createTextEditorDecorationType(decorationOptions);
            decorationTypes.push(decorationType);

            let regex: RegExp;
            if (queryData.type === 'regex') {
                try {
                    regex = new RegExp(queryData.query, 'gi');
                } catch (e) {
                    vscode.window.showErrorMessage(`Invalid regex: ${queryData.query}`);
                    continue;
                }
            } else {
                const escapedQuery = queryData.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(escapedQuery, 'gi');
            }

            for (let j = 0; j < document.lineCount; j++) {
                const line = document.lineAt(j);
                if (queryData.isWholeLine) {
                    if (line.text.match(regex)) {
                        const startPos = new vscode.Position(j, 0);
                        const endPos = new vscode.Position(j, line.text.length);
                        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: `Match for "${queryData.query}"` };
                        if (!decorations[i]) {
                            decorations[i] = [];
                        }
                        decorations[i].push(decoration);
                        results.push({
                            query: queryData.query,
                            line: j + 1,
                            character: 1,
                            text: line.text,
                            backgroundColor: queryData.backgroundColor,
                            foregroundColor: queryData.foregroundColor,
                            isWholeLine: queryData.isWholeLine,
                            matchedText: line.text
                        });
                    }
                } else {
                    let match: RegExpExecArray | null;
                    while (match = regex.exec(line.text)) {
                        const startPos = new vscode.Position(j, match.index);
                        const endPos = new vscode.Position(j, match.index + match[0].length);
                        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: `Match for "${queryData.query}"` };
                        if (!decorations[i]) {
                            decorations[i] = [];
                        }
                        decorations[i].push(decoration);
                        results.push({
                            query: queryData.query,
                            line: j + 1,
                            character: match.index + 1,
                            text: line.text,
                            backgroundColor: queryData.backgroundColor,
                            foregroundColor: queryData.foregroundColor,
                            isWholeLine: queryData.isWholeLine,
                            matchedText: match[0]
                        });
                    }
                }
            }
        }
    }

    // Sort results by line and character position
    results.sort((a, b) => {
        if (a.line !== b.line) {
            return a.line - b.line;
        }
        return a.character - b.character;
    });

    // Group results by line number
    const groupedResults: { [key: number]: { line: number; text: string; matches: { query: string; backgroundColor: string; foregroundColor: string; isWholeLine: boolean; startChar: number; endChar: number }[] } } = {};
    for (const result of results) {
        if (!groupedResults[result.line]) {
            groupedResults[result.line] = {
                line: result.line,
                text: result.text,
                matches: []
            };
        }
        const matchLength = result.matchedText ? result.matchedText.length : result.query.length;
        groupedResults[result.line].matches.push({
            query: result.query,
            backgroundColor: result.backgroundColor,
            foregroundColor: result.foregroundColor,
            isWholeLine: result.isWholeLine,
            startChar: result.character - 1,
            endChar: result.character - 1 + matchLength
        });
    }

    // Merge overlapping matches
    for (const lineResult of Object.values(groupedResults)) {
        lineResult.matches.sort((a, b) => {
            if (a.startChar !== b.startChar) {
                return a.startChar - b.startChar;
            }
            return (b.endChar - b.startChar) - (a.endChar - a.startChar);
        });

        const merged: { query: string; backgroundColor: string; foregroundColor: string; isWholeLine: boolean; startChar: number; endChar: number }[] = [];
        for (const match of lineResult.matches) {
            const isOverlapping = merged.some(m =>
                match.startChar < m.endChar && match.endChar > m.startChar
            );
            if (!isOverlapping) {
                merged.push(match);
            }
        }
        lineResult.matches = merged;
    }

    const finalResults = Object.values(groupedResults);

    for (let i = 0; i < decorationTypes.length; i++) {
        searchEditor.setDecorations(decorationTypes[i], decorations[i] || []);
    }

    if (resultsView) {
        resultsView.webview.postMessage({ command: 'results', results: finalResults });
    }
}

function handleGoToLine(line: number, character: number) {
    let goToEditor = vscode.window.activeTextEditor;
    if (!goToEditor && activeEditor) {
        goToEditor = activeEditor;
    }
    if (goToEditor) {
        const position = new vscode.Position(line - 1, character - 1);
        goToEditor.selection = new vscode.Selection(position, position);
        goToEditor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
        vscode.window.showTextDocument(goToEditor.document, goToEditor.viewColumn);
    }
}

function handleClear() {
    clearAllDecorations();
    if (resultsView) {
        resultsView.webview.postMessage({ command: 'results', results: [] });
    }
}

function clearAllDecorations() {
    const editorToClear = vscode.window.activeTextEditor || activeEditor;
    if (editorToClear) {
        for (const decorationType of decorationTypes) {
            editorToClear.setDecorations(decorationType, []);
        }
    }
    decorationTypes.length = 0;
}

async function exportQueriesToFile(queries: QueryData[]) {
    try {
        const saveUri = await vscode.window.showSaveDialog({
            filters: {
                'JSON': ['json'],
                'All Files': ['*']
            },
            defaultUri: vscode.Uri.file('search-queries.json'),
            title: 'Export Search Queries'
        });

        if (!saveUri) {
            return;
        }

        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            description: 'Omni Search Queries - Exported from VS Code Omni Search extension',
            queries: queries
        };

        const content = JSON.stringify(exportData, null, 2);
        await vscode.workspace.fs.writeFile(saveUri, Buffer.from(content, 'utf8'));
        
        vscode.window.showInformationMessage(`Exported ${queries.length} query/queries to: ${saveUri.fsPath}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to export queries: ${errorMessage}`);
    }
}

async function importQueriesFromFile(view: vscode.WebviewView | undefined) {
    try {
        const openUris = await vscode.window.showOpenDialog({
            filters: {
                'JSON': ['json'],
                'All Files': ['*']
            },
            title: 'Import Search Queries',
            canSelectMany: false
        });

        if (!openUris || openUris.length === 0) {
            return;
        }

        const fileUri = openUris[0];
        const fileContent = await vscode.workspace.fs.readFile(fileUri);
        const text = Buffer.from(fileContent).toString('utf8');
        
        let importData: any;
        try {
            importData = JSON.parse(text);
        } catch (parseError) {
            vscode.window.showErrorMessage('Invalid JSON file format. Please select a valid search queries JSON file.');
            return;
        }

        let queries: QueryData[];
        if (Array.isArray(importData)) {
            queries = importData;
        } else if (importData && Array.isArray(importData.queries)) {
            queries = importData.queries;
        } else {
            vscode.window.showErrorMessage('Invalid file format. File must contain an array of queries.');
            return;
        }

        const validQueries = queries.filter((q: any) => {
            return q && typeof q.query === 'string' && 
                   typeof q.backgroundColor === 'string' && 
                   typeof q.foregroundColor === 'string' &&
                   (q.type === 'plain' || q.type === 'regex');
        });

        if (validQueries.length === 0) {
            vscode.window.showErrorMessage('No valid queries found in the file.');
            return;
        }

        if (queryView) {
            queryView.webview.postMessage({ 
                command: 'importQueries', 
                queries: validQueries,
                message: `Imported ${validQueries.length} query/queries`
            });
        }
        
        vscode.window.showInformationMessage(`Imported ${validQueries.length} query/queries from: ${fileUri.fsPath}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to import queries: ${errorMessage}`);
    }
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {
    // Clean up all decorations on deactivation
    clearAllDecorations();
}
