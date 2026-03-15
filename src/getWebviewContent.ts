import * as vscode from 'vscode';

export function getWebviewContent(cspSource: string, toolkitUri: vscode.Uri, codiconUri: vscode.Uri, nonce: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; font-src ${cspSource}; script-src ${cspSource} 'nonce-${nonce}' 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${codiconUri}" rel="stylesheet" />
    <title>Sequential Search</title>
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --primary-dark: #5a67d8;
            --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            --danger-gradient: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            --info-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --card-bg: var(--vscode-editor-background);
            --card-border: rgba(102, 126, 234, 0.3);
            --card-hover-border: rgba(102, 126, 234, 0.6);
            --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
            --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            padding: 0;
            margin: 0;
            font-family: var(--vscode-font-family);
            background: var(--vscode-editor-background);
            color: var(--vscode-foreground);
        }
        
        .header {
            background: var(--primary-gradient);
            padding: 20px 24px;
            color: white;
            box-shadow: var(--shadow-md);
        }
        
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .header h1 .codicon {
            font-size: 26px;
        }
        
        .header-subtitle {
            margin: 6px 0 0 0;
            font-size: 12px;
            opacity: 0.95;
        }
        
        .container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--vscode-foreground);
            opacity: 0.6;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .queries-section {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 20px;
            box-shadow: var(--shadow-md);
            animation: fadeIn 0.4s ease;
        }
        
        .query-container {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            flex-wrap: wrap;
            gap: 10px;
            padding: 12px 14px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 10px;
            transition: all 0.2s;
        }
        
        .query-container:hover {
            border-color: var(--card-hover-border);
            box-shadow: var(--shadow-sm);
        }
        
        .query-container:last-child {
            margin-bottom: 0;
        }
        
        .query-input {
            flex: 1;
            min-width: 200px;
            padding: 8px 12px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-family: var(--vscode-font-family);
            font-size: 13px;
        }
        
        .query-input:focus {
            outline: 1px solid var(--primary-dark);
            border-color: var(--primary-dark);
        }
        
        .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 6px;
        }
        
        .color-picker-wrapper span {
            font-size: 11px;
            font-weight: 600;
            opacity: 0.8;
        }
        
        input[type="color"] {
            width: 32px;
            height: 32px;
            border: 2px solid var(--vscode-widget-border);
            border-radius: 6px;
            cursor: pointer;
            padding: 0;
            background: transparent;
        }
        
        input[type="color"]:hover {
            border-color: var(--primary-dark);
        }
        
        input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        
        input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 4px;
        }
        
        .type-dropdown {
            padding: 6px 10px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            font-size: 12px;
            cursor: pointer;
        }
        
        .type-dropdown:focus {
            outline: 1px solid var(--primary-dark);
            border-color: var(--primary-dark);
        }
        
        .query-options {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 10px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 6px;
            border: 1px solid var(--vscode-widget-border);
        }
        
        .query-options label {
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }
        
        .query-options input[type="checkbox"] {
            cursor: pointer;
            width: 14px;
            height: 14px;
        }
        
        .remove-btn {
            margin-left: auto;
            opacity: 0.5;
            transition: all 0.2s;
            background: transparent;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
        }
        
        .remove-btn:hover {
            opacity: 1;
            background: var(--vscode-inputValidation-errorBackground);
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--vscode-widget-border);
        }
        
        .btn {
            padding: 10px 18px;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .btn-primary {
            background: var(--primary-gradient);
            color: white;
        }
        
        .btn-success {
            background: var(--success-gradient);
            color: white;
        }
        
        .btn-info {
            background: var(--info-gradient);
            color: white;
        }
        
        .btn-danger {
            background: var(--danger-gradient);
            color: white;
        }
        
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .results-section {
            margin-top: 20px;
            animation: fadeIn 0.5s ease;
        }
        
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            padding: 10px 14px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 8px;
            border: 1px solid var(--vscode-widget-border);
        }
        
        .results-count {
            font-size: 13px;
            font-weight: 600;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .result-card {
            display: flex;
            align-items: flex-start;
            padding: 14px 16px;
            margin-bottom: 10px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 10px;
            background: var(--card-bg);
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: var(--shadow-sm);
        }
        
        .result-card:hover {
            border-color: var(--card-hover-border);
            transform: translateX(6px);
            box-shadow: var(--shadow-md);
        }
        
        .line-number-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
            height: 36px;
            padding: 0 10px;
            background: var(--primary-gradient);
            color: white;
            border-radius: 8px;
            font-weight: 700;
            font-size: 13px;
            margin-right: 12px;
            box-shadow: var(--shadow-sm);
            flex-shrink: 0;
        }
        
        .line-content-wrapper {
            flex: 1;
            min-width: 0;
        }
        
        .line-content {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: 1.6;
            color: var(--vscode-foreground);
            white-space: pre-wrap;
            word-break: break-word;
            padding: 6px 10px;
            background: var(--vscode-textBlockQuote-background);
            border-radius: 6px;
            border-left: 3px solid var(--card-border);
        }
        
        .match-highlight {
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        
        .no-results, .no-editor {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            color: var(--vscode-descriptionForeground);
            background: var(--card-bg);
            border: 2px dashed var(--vscode-widget-border);
            border-radius: 12px;
        }
        
        .no-results .codicon, .no-editor .codicon {
            font-size: 56px;
            margin-bottom: 16px;
            opacity: 0.4;
        }
        
        .no-results h3, .no-editor h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--vscode-foreground);
        }
        
        .no-results p, .no-editor p {
            margin: 0;
            font-size: 13px;
            max-width: 400px;
        }
        
        .status-message {
            padding: 12px 16px;
            margin-bottom: 14px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            box-shadow: var(--shadow-sm);
        }
        
        .status-message.success {
            background: linear-gradient(135deg, rgba(17, 153, 142, 0.15) 0%, rgba(56, 239, 125, 0.15) 100%);
            border: 2px solid #38ef7d;
            color: #38ef7d;
        }
        
        .status-message.error {
            background: var(--vscode-inputValidation-errorBackground);
            border: 2px solid var(--vscode-inputValidation-errorBorder);
            color: var(--vscode-errorForeground);
        }
        
        .status-message.info {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 2px solid var(--vscode-widget-border);
            color: var(--vscode-foreground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>
            <span class="codicon codicon-search"></span>
            Sequential Search
        </h1>
        <p class="header-subtitle">Search & highlight multiple patterns with custom colors</p>
    </div>
    
    <div class="container">
        <div class="queries-section">
            <div class="section-title">
                <span class="codicon codicon-symbol-keyword"></span>
                Search Queries
            </div>
            
            <div id="queries">
                <div class="query-container">
                    <input type="checkbox" class="enabled" checked title="Enable/Disable this query" />
                    <input type="text" class="query-input" placeholder="Enter search query..." />
                    <div class="color-picker-wrapper">
                        <span>Color:</span>
                        <input type="color" class="color" value="#ffff00" />
                    </div>
                    <select class="type-dropdown">
                        <option value="plain">Plain Text</option>
                        <option value="regex">Regex</option>
                    </select>
                    <select class="type-dropdown colorType">
                        <option value="background">Background</option>
                        <option value="foreground">Text Color</option>
                    </select>
                    <div class="query-options">
                        <label title="Highlight the entire line">
                            <input type="checkbox" class="isWholeLine" />
                            Whole Line
                        </label>
                    </div>
                    <button class="remove-btn" title="Remove this query">
                        <span class="codicon codicon-close"></span>
                    </button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-secondary" id="add-query">
                    <span class="codicon codicon-add"></span> Add Query
                </button>
                <button class="btn btn-primary" id="search">
                    <span class="codicon codicon-search"></span> Search
                </button>
                <button class="btn btn-secondary" id="clear">
                    <span class="codicon codicon-clear-all"></span> Clear
                </button>
                <button class="btn btn-success" id="export-queries">
                    <span class="codicon codicon-export"></span> Export
                </button>
                <button class="btn btn-info" id="import-queries">
                    <span class="codicon codicon-folder-opened"></span> Import
                </button>
            </div>
        </div>
        
        <div class="results-section">
            <div class="results-header">
                <div class="section-title" style="margin: 0;">
                    <span class="codicon codicon-list-filter"></span>
                    Results
                </div>
                <div class="results-count" id="results-count"></div>
            </div>
            
            <div id="status-message"></div>
            <div id="results"></div>
        </div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const queriesDiv = document.getElementById('queries');
        const resultsDiv = document.getElementById('results');
        const statusMessageDiv = document.getElementById('status-message');
        const resultsCountDiv = document.getElementById('results-count');

        // Add Query Button
        document.getElementById('add-query').addEventListener('click', function() {
            const newQueryDiv = document.createElement('div');
            newQueryDiv.className = 'query-container';
            newQueryDiv.innerHTML = 
                '<input type="checkbox" class="enabled" checked title="Enable/Disable this query" />' +
                '<input type="text" class="query-input" placeholder="Enter search query..." />' +
                '<div class="color-picker-wrapper">' +
                    '<span>Color:</span>' +
                    '<input type="color" class="color" value="#ffff00" />' +
                '</div>' +
                '<select class="type-dropdown">' +
                    '<option value="plain">Plain Text</option>' +
                    '<option value="regex">Regex</option>' +
                '</select>' +
                '<select class="type-dropdown colorType">' +
                    '<option value="background">Background</option>' +
                    '<option value="foreground">Text Color</option>' +
                '</select>' +
                '<div class="query-options">' +
                    '<label title="Highlight the entire line">' +
                        '<input type="checkbox" class="isWholeLine" />' +
                        'Whole Line' +
                    '</label>' +
                '</div>' +
                '<button class="remove-btn" title="Remove this query">' +
                    '<span class="codicon codicon-close"></span>' +
                '</button>';
            queriesDiv.appendChild(newQueryDiv);
        });

        // Remove Query
        queriesDiv.addEventListener('click', function(event) {
            const removeBtn = event.target.closest('.remove-btn');
            if (removeBtn) {
                const container = removeBtn.closest('.query-container');
                container.style.opacity = '0';
                setTimeout(function() { container.remove(); }, 200);
            }
        });

        // Search Button
        document.getElementById('search').addEventListener('click', function() {
            const containers = document.getElementsByClassName('query-container');
            const queries = [];
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i];
                queries.push({
                    enabled: container.querySelector('.enabled').checked,
                    query: container.querySelector('.query-input').value,
                    color: container.querySelector('.color').value,
                    type: container.querySelector('.type-dropdown').value,
                    colorType: container.querySelector('.colorType').value,
                    isWholeLine: container.querySelector('.isWholeLine').checked
                });
            }
            vscode.postMessage({
                command: 'search',
                queries: queries
            });
        });

        // Clear Button
        document.getElementById('clear').addEventListener('click', function() {
            vscode.postMessage({ command: 'clear' });
        });

        // Export Button
        document.getElementById('export-queries').addEventListener('click', function() {
            const containers = document.getElementsByClassName('query-container');
            const queries = [];
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i];
                queries.push({
                    enabled: container.querySelector('.enabled').checked,
                    query: container.querySelector('.query-input').value,
                    color: container.querySelector('.color').value,
                    type: container.querySelector('.type-dropdown').value,
                    colorType: container.querySelector('.colorType').value,
                    isWholeLine: container.querySelector('.isWholeLine').checked
                });
            }
            vscode.postMessage({
                command: 'exportQueries',
                queries: queries
            });
        });

        // Import Button
        document.getElementById('import-queries').addEventListener('click', function() {
            vscode.postMessage({ command: 'importQueries' });
        });

        // Handle Enter key in search input
        queriesDiv.addEventListener('keydown', function(event) {
            if (event.target.classList.contains('query-input') && event.key === 'Enter') {
                document.getElementById('search').click();
            }
        });

        function showStatus(message, type) {
            const icon = type === 'success' ? 'check' : type === 'error' ? 'error' : 'info';
            statusMessageDiv.innerHTML = '<div class="status-message ' + type + '">' + 
                '<span class="codicon codicon-' + icon + '"></span>' +
                '<span>' + message + '</span>' +
                '</div>';
            setTimeout(function() {
                statusMessageDiv.innerHTML = '';
            }, 4000);
        }

        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }

        function renderResults(results) {
            resultsDiv.innerHTML = '';
            
            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results">' +
                    '<span class="codicon codicon-search"></span>' +
                    '<h3>No Results Yet</h3>' +
                    '<p>Enter your search queries above and click "Search" to find matches.</p>' +
                    '</div>';
                resultsCountDiv.textContent = '';
                return;
            }
            
            resultsCountDiv.textContent = results.length + ' line' + (results.length === 1 ? '' : 's') + ' with matches';
            
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const resultCard = document.createElement('div');
                resultCard.className = 'result-card';
                resultCard.style.cursor = 'pointer';
                resultCard.addEventListener('click', function() {
                    vscode.postMessage({
                        command: 'goToLine',
                        line: result.line,
                        character: 1
                    });
                });

                const lineNumberBadge = document.createElement('div');
                lineNumberBadge.className = 'line-number-badge';
                lineNumberBadge.textContent = 'L' + result.line;

                const lineContentWrapper = document.createElement('div');
                lineContentWrapper.className = 'line-content-wrapper';

                const lineContent = document.createElement('div');
                lineContent.className = 'line-content';
                
                const hasWholeLineMatch = result.matches.some(function(m) { return m.isWholeLine; });
                
                if (hasWholeLineMatch) {
                    const wholeLineMatch = result.matches.find(function(m) { return m.isWholeLine; });
                    const wholeLineColor = wholeLineMatch ? wholeLineMatch.color : '#ffff00';
                    const wholeLineColorType = wholeLineMatch ? wholeLineMatch.colorType : 'background';
                    
                    // Apply the selected color to the entire line background or foreground
                    if (wholeLineColorType === 'foreground') {
                        lineContent.style.color = wholeLineColor;
                    } else {
                        // Full line background highlight with the selected color
                        lineContent.style.background = wholeLineColor;
                        lineContent.style.display = 'block';
                        lineContent.style.padding = '6px 10px';
                        lineContent.style.margin = '-6px -10px';
                        lineContent.style.borderRadius = '6px';
                    }
                    
                    const sortedMatches = result.matches.slice().sort(function(a, b) { return b.startChar - a.startChar; });

                    let lineText = result.text;
                    for (let j = 0; j < sortedMatches.length; j++) {
                        const match = sortedMatches[j];
                        const before = lineText.substring(0, match.startChar);
                        const matched = lineText.substring(match.startChar, match.endChar);
                        const after = lineText.substring(match.endChar);
                        
                        let matchStyleAttr;
                        if (match.colorType === 'foreground') {
                            matchStyleAttr = 'color: ' + match.color;
                        } else {
                            matchStyleAttr = 'background: ' + match.color;
                        }
                        
                        lineText = before + '<span class="match-highlight" style="' + matchStyleAttr + '">' + matched + '</span>' + after;
                    }
                    
                    lineContent.innerHTML = lineText;
                } else {
                    const sortedMatches = result.matches.slice().sort(function(a, b) { return b.startChar - a.startChar; });

                    let lineText = result.text;
                    for (let j = 0; j < sortedMatches.length; j++) {
                        const match = sortedMatches[j];
                        const before = lineText.substring(0, match.startChar);
                        const matched = lineText.substring(match.startChar, match.endChar);
                        const after = lineText.substring(match.endChar);
                        
                        let matchStyleAttr;
                        if (match.colorType === 'foreground') {
                            matchStyleAttr = 'color: ' + match.color;
                        } else {
                            matchStyleAttr = 'background: ' + match.color;
                        }
                        
                        lineText = before + '<span class="match-highlight" style="' + matchStyleAttr + '">' + matched + '</span>' + after;
                    }
                    lineContent.innerHTML = lineText;
                }

                lineContentWrapper.appendChild(lineContent);
                resultCard.appendChild(lineNumberBadge);
                resultCard.appendChild(lineContentWrapper);
                resultsDiv.appendChild(resultCard);
            }
        }

        window.addEventListener('message', function(event) {
            const message = event.data;
            switch (message.command) {
                case 'importQueries':
                    if (message.message) {
                        showStatus(message.message, 'success');
                    }
                    queriesDiv.innerHTML = '';
                    if (message.queries.length === 0) {
                        queriesDiv.innerHTML = 
                            '<div class="query-container">' +
                                '<input type="checkbox" class="enabled" checked />' +
                                '<input type="text" class="query-input" placeholder="Enter search query..." />' +
                                '<div class="color-picker-wrapper">' +
                                    '<span>Color:</span>' +
                                    '<input type="color" class="color" value="#ffff00" />' +
                                '</div>' +
                                '<select class="type-dropdown">' +
                                    '<option value="plain">Plain Text</option>' +
                                    '<option value="regex">Regex</option>' +
                                '</select>' +
                                '<select class="type-dropdown colorType">' +
                                    '<option value="background">Background</option>' +
                                    '<option value="foreground">Text Color</option>' +
                                '</select>' +
                                '<div class="query-options">' +
                                    '<label>' +
                                        '<input type="checkbox" class="isWholeLine" />' +
                                        'Whole Line' +
                                    '</label>' +
                                '</div>' +
                                '<button class="remove-btn">' +
                                    '<span class="codicon codicon-close"></span>' +
                                '</button>' +
                            '</div>';
                    } else {
                        for (let i = 0; i < message.queries.length; i++) {
                            const query = message.queries[i];
                            const queryDiv = document.createElement('div');
                            queryDiv.className = 'query-container';
                            queryDiv.innerHTML = 
                                '<input type="checkbox" class="enabled" ' + (query.enabled ? 'checked' : '') + ' />' +
                                '<input type="text" class="query-input" value="' + query.query.replace(/"/g, '&quot;') + '" />' +
                                '<div class="color-picker-wrapper">' +
                                    '<span>Color:</span>' +
                                    '<input type="color" class="color" value="' + query.color + '" />' +
                                '</div>' +
                                '<select class="type-dropdown">' +
                                    '<option value="plain"' + (query.type === 'plain' ? ' selected' : '') + '>Plain Text</option>' +
                                    '<option value="regex"' + (query.type === 'regex' ? ' selected' : '') + '>Regex</option>' +
                                '</select>' +
                                '<select class="type-dropdown colorType">' +
                                    '<option value="background"' + (query.colorType === 'background' ? ' selected' : '') + '>Background</option>' +
                                    '<option value="foreground"' + (query.colorType === 'foreground' ? ' selected' : '') + '>Text Color</option>' +
                                '</select>' +
                                '<div class="query-options">' +
                                    '<label>' +
                                        '<input type="checkbox" class="isWholeLine"' + (query.isWholeLine ? ' checked' : '') + ' />' +
                                        'Whole Line' +
                                    '</label>' +
                                '</div>' +
                                '<button class="remove-btn">' +
                                    '<span class="codicon codicon-close"></span>' +
                                '</button>';
                            queriesDiv.appendChild(queryDiv);
                        }
                    }
                    break;
                case 'noEditor':
                    resultsDiv.innerHTML = '<div class="no-editor">' +
                        '<span class="codicon codicon-warning"></span>' +
                        '<h3>No Active Editor</h3>' +
                        '<p>' + message.message + '</p>' +
                        '</div>';
                    break;
                case 'results':
                    renderResults(message.results);
                    break;
            }
        });

        renderResults([]);
    </script>
</body>
</html>`;
}
