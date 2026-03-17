import * as vscode from 'vscode';

export function getWebviewContent(cspSource: string, toolkitUri: vscode.Uri, codiconUri: vscode.Uri, nonce: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; font-src ${cspSource}; script-src ${cspSource} 'nonce-${nonce}' 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${codiconUri}" rel="stylesheet" />
    <title>Omni Search</title>
    <style>
        :root {
            --primary: var(--vscode-button-background);
            --secondary: var(--vscode-button-secondaryBackground);
            --accent: var(--vscode-commandPalette-border);
            --success: #28a745;
            --warning: #ffc107;
            --danger: #dc3545;
            --card-bg: var(--vscode-editor-background);
            --card-border: var(--vscode-widget-border);
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
            --shadow-md: 0 4px 8px rgba(0,0,0,0.12);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
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
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: var(--vscode-panel-background);
            padding: 16px 18px;
            border-bottom: 1px solid var(--vscode-widget-border);
            flex-shrink: 0;
        }
        
        .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .header h1 .codicon {
            font-size: 20px;
        }
        
        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--vscode-descriptionForeground);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .queries-section {
            background: var(--card-bg);
            border-bottom: 1px solid var(--vscode-widget-border);
            padding: 12px;
            flex-shrink: 0;
            max-height: 100%;
            overflow-y: auto;
            border-radius: 0;
        }
        
        .queries-section .section-title {
            margin-bottom: 10px;
            padding: 0 4px;
        }
        
        .query-container {
            display: grid;
            grid-template-columns: 20px 1fr 40px 40px 60px 50px 60px 20px;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
            padding: 10px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            transition: all 0.2s;
        }

        .query-container:nth-child(odd) {
            background: var(--vscode-input-background);
        }

        .query-container:nth-child(even) {
            background: var(--vscode-input-background);
            border-color: var(--vscode-input-border);
        }

        .query-container:hover {
            border-color: var(--accent);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .query-input {
            padding: 6px 8px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 3px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-family: var(--vscode-editor-font-family);
            font-size: 11px;
            min-width: 0;
        }
        
        .query-input:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: 3px;
            background: transparent;
            border-radius: 3px;
            padding: 0;
        }
        
        .color-picker-wrapper span {
            font-size: 9px;
            font-weight: 500;
        }
        
        input[type="color"] {
            width: 28px;
            height: 28px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            cursor: pointer;
            padding: 0;
        }
        
        input[type="color"]:hover {
            border-color: var(--accent);
        }
        
        input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 1px;
        }
        
        input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 2px;
        }
        
        .type-dropdown, .colorType {
            padding: 6px 6px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 3px;
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            font-size: 10px;
            cursor: pointer;
            min-width: 0;
        }
        
        .type-dropdown:focus, .colorType:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .query-options {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .query-options label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            cursor: pointer;
        }

        .query-options input[type="checkbox"] {
            margin: 0;
            cursor: pointer;
        }

        .remove-btn {
            opacity: 0.6;
            transition: opacity 0.2s;
            background: transparent;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            padding: 2px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }
        
        .remove-btn:hover {
            opacity: 1;
            background: var(--vscode-inputValidation-errorBackground);
        }
        
        .action-buttons {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            padding: 8px 0 0 0;
            border-top: 1px solid var(--vscode-widget-border);
            margin-top: 8px;
            padding-top: 8px;
        }
        
        .btn {
            padding: 6px 10px;
            font-weight: 600;
            border-radius: 3px;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            user-select: none;
            white-space: nowrap;
        }
        
        .btn-primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid var(--accent);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .btn-primary:hover {
            opacity: 0.9;
            box-shadow: 0 3px 8px rgba(0,0,0,0.15);
            transform: translateY(-1px);
        }
        
        .btn-success {
            background: var(--success);
            color: white;
        }
        
        .btn-success:hover {
            opacity: 0.85;
        }
        
        .btn-info {
            background: var(--vscode-symbolIcon-fileForeground);
            color: white;
        }
        
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-widget-border);
        }
        
        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            border-color: var(--accent);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .results-section {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            animation: fadeIn 0.4s ease;
            background: var(--vscode-editor-background);
        }
        
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            padding: 0 4px;
            border-bottom: 1px solid var(--vscode-widget-border);
            padding-bottom: 10px;
        }
        
        .results-count {
            font-size: 12px;
            font-weight: 600;
            color: var(--vscode-button-background);
            opacity: 0.9;
        }
        
        .results-header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .results-header h1 .codicon {
            font-size: 20px;
        }

        .result-card {
            display: flex;
            align-items: flex-start;
            padding: 12px 14px;
            margin-bottom: 10px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            background: var(--vscode-editor-background);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .result-card:hover {
            background: var(--vscode-list-hoverBackground);
            border-color: var(--accent);
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            transform: translateY(-1px);
        }
        
        .result-card:active {
            transform: translateY(0);
        }
        
        .line-number-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 55px;
            height: 36px;
            padding: 0 10px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 4px;
            font-weight: 700;
            font-size: 13px;
            margin-right: 12px;
            border: none;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        
        .line-content-wrapper {
            flex: 1;
            min-width: 0;
            overflow: hidden;
        }
        
        .line-content {
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            line-height: 1.6;
            color: var(--vscode-foreground);
            word-break: break-word;
            padding: 4px 0;
            background: transparent;
            border: none;
        }
        
        .line-content.wrap {
            white-space: pre-wrap;
        }
        
        .line-content.no-wrap {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .match-highlight {
            padding: 1px 3px;
            border-radius: 2px;
            font-weight: 600;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
        }
        
        .no-results, .no-editor {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 50px 20px;
            text-align: center;
            color: var(--vscode-descriptionForeground);
        }
        
        .no-results .codicon, .no-editor .codicon {
            font-size: 40px;
            margin-bottom: 12px;
            opacity: 0.4;
        }
        
        .no-results h3, .no-editor h3 {
            margin: 0 0 6px 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--vscode-foreground);
        }
        
        .no-results p, .no-editor p {
            margin: 0;
            font-size: 12px;
            max-width: 350px;
            line-height: 1.4;
        }
        
        .status-message {
            padding: 12px 14px;
            margin-bottom: 12px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            font-size: 13px;
            animation: fadeIn 0.3s ease;
        }
        
        .status-message.success {
            background: var(--success);
            color: white;
            border: 1px solid var(--success);
            box-shadow: 0 2px 6px rgba(40, 167, 69, 0.2);
        }
        
        .status-message.error {
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            color: var(--vscode-errorForeground);
            box-shadow: 0 2px 6px rgba(220, 53, 69, 0.2);
        }
        
        .status-message.info {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-widget-border);
            color: var(--vscode-foreground);
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--vscode-editor-background);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--vscode-scrollbarSlider-background);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--vscode-scrollbarSlider-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>
            <span class="codicon codicon-search"></span>
            Omni Search
        </h1>
    </div>
    
    <div class="container">
        <div class="queries-section">
            <div class="section-title">
                <span class="codicon codicon-symbol-keyword"></span>
                Queries
            </div>
            
            <div id="queries">
                <div class="query-container">
                    <input type="checkbox" class="enabled" checked title="Enable/Disable" />
                    <input type="text" class="query-input" placeholder="Search..." />
                    <div class="color-picker-wrapper">
                        <input type="color" class="color-bg" value="#ffff00" />
                    </div>
                    <div class="color-picker-wrapper">
                        <input type="color" class="color-fg" value="#000000" />
                    </div>
                    <select class="type-dropdown">
                        <option value="plain">Plain</option>
                        <option value="regex">Regex</option>
                    </select>
                    <div class="query-options">
                        <label title="Whole line">
                            <input type="checkbox" class="isWholeLine" />
                            Whole Line
                        </label>
                    </div>
                    <button class="remove-btn" title="Remove">
                        <span class="codicon codicon-close"></span>
                    </button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-secondary" id="add-query" title="Add a new query">
                    <span class="codicon codicon-add"></span>
                    <span>Add</span>
                </button>
                <button class="btn btn-primary" id="search" title="Execute search">
                    <span class="codicon codicon-search"></span>
                    <span>Search</span>
                </button>
                <button class="btn btn-secondary" id="clear" title="Clear results">
                    <span class="codicon codicon-clear-all"></span>
                    <span>Clear</span>
                </button>
                <button class="btn btn-secondary" id="export-queries" title="Export as JSON">
                    <span class="codicon codicon-export"></span>
                    <span>Export</span>
                </button>
                <button class="btn btn-secondary" id="import-queries" title="Import from JSON">
                    <span class="codicon codicon-folder-opened"></span>
                    <span>Import</span>
                </button>
                <label style="flex: 1; text-align: right; padding-right: 4px; display: flex; align-items: center; justify-content: flex-end; gap: 6px; font-size: 11px;">
                    <input type="checkbox" id="wrap-toggle" checked />
                    Wrap
                </label>
            </div>
        </div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const queriesDiv = document.getElementById('queries');
        const wrapToggle = document.getElementById('wrap-toggle');
        let shouldWrap = true;

        // Function to get contrasting color
        function getContrastColor(hex) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // Convert to RGB
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            // http://www.w3.org/TR/AERT#color-contrast
            const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
            return (brightness > 125) ? 'black' : 'white';
        }

        // Function to generate a random color
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Show status message
        function showStatus(message, type) {
            const existingStatus = document.querySelector('.status-message');
            if (existingStatus) {
                existingStatus.remove();
            }
            const statusDiv = document.createElement('div');
            statusDiv.className = 'status-message ' + type;
            statusDiv.innerHTML = '<span class="codicon codicon-' + (type === 'success' ? 'check' : type === 'error' ? 'error' : 'info') + '"></span>' + message;
            const queriesSection = document.querySelector('.queries-section');
            queriesSection.insertBefore(statusDiv, queriesSection.firstChild);
            setTimeout(function() {
                statusDiv.style.opacity = '0';
                statusDiv.style.transition = 'opacity 0.3s ease';
                setTimeout(function() { statusDiv.remove(); }, 300);
            }, 2000);
        }

        // Wrap toggle
        wrapToggle.addEventListener('change', function() {
            shouldWrap = this.checked;
            vscode.postMessage({ command: 'wrapToggle', wrap: shouldWrap });
        });

        // Add Query Button
        document.getElementById('add-query').addEventListener('click', function() {
            const newQueryDiv = document.createElement('div');
            newQueryDiv.className = 'query-container';
            const bgColor = getRandomColor();
            const fgColor = getContrastColor(bgColor);
            newQueryDiv.innerHTML = 
                '<input type="checkbox" class="enabled" checked />' +
                '<input type="text" class="query-input" placeholder="Search..." />' +
                '<div class="color-picker-wrapper">' +
                    '<input type="color" class="color-bg" value="' + bgColor + '" />' +
                '</div>' +
                '<div class="color-picker-wrapper">' +
                    '<input type="color" class="color-fg" value="' + fgColor + '" />' +
                '</div>' +
                '<select class="type-dropdown">' +
                    '<option value="plain">Plain</option>' +
                    '<option value="regex">Regex</option>' +
                '</select>' +
                '<div class="query-options">' +
                    '<label>' +
                        '<input type="checkbox" class="isWholeLine" />' +
                        'Whole Line' +
                    '</label>' +
                '</div>' +
                '<button class="remove-btn" title="Remove">' +
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
                    backgroundColor: container.querySelector('.color-bg').value,
                    foregroundColor: container.querySelector('.color-fg').value,
                    type: container.querySelector('.type-dropdown').value,
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
                    backgroundColor: container.querySelector('.color-bg').value,
                    foregroundColor: container.querySelector('.color-fg').value,
                    type: container.querySelector('.type-dropdown').value,
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

        // Handle color picker changes
        queriesDiv.addEventListener('input', function(event) {
            if (event.target.classList.contains('color-bg')) {
                const fgColorInput = event.target.closest('.query-container').querySelector('.color-fg');
                fgColorInput.value = getContrastColor(event.target.value);
            }
        });

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
                                '<input type="text" class="query-input" placeholder="Search..." />' +
                                '<div class="color-picker-wrapper">' +
                                    '<input type="color" class="color-bg" value="#ffff00" />' +
                                '</div>' +
                                '<div class="color-picker-wrapper">' +
                                    '<input type="color" class="color-fg" value="#000000" />' +
                                '</div>' +
                                '<select class="type-dropdown">' +
                                    '<option value="plain">Plain</option>' +
                                    '<option value="regex">Regex</option>' +
                                '</select>' +
                                '<div class="query-options">' +
                                    '<label>' +
                                        '<input type="checkbox" class="isWholeLine" />' +
                                        'Whole Line' +
                                    '</label>' +
                                '</div>' +
                                '<button class="remove-btn" title="Remove">' +
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
                                    '<input type="color" class="color-bg" value="' + query.backgroundColor + '" />' +
                                '</div>' +
                                '<div class="color-picker-wrapper">' +
                                    '<input type="color" class="color-fg" value="' + query.foregroundColor + '" />' +
                                '</div>' +
                                '<select class="type-dropdown">' +
                                    '<option value="plain"' + (query.type === 'plain' ? ' selected' : '') + '>Plain</option>' +
                                    '<option value="regex"' + (query.type === 'regex' ? ' selected' : '') + '>Regex</option>' +
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
            }
        });
    </script>
</body>
</html>`;
}

export function getResultsWebviewContent(cspSource: string, codiconUri: vscode.Uri, iconUri: vscode.Uri, nonce: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; font-src ${cspSource}; img-src ${cspSource}; script-src ${cspSource} 'nonce-${nonce}' 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${codiconUri}" rel="stylesheet" />
    <title>Omni Search Results</title>
    <style>
        @font-face {
            font-family: "codicon";
            font-display: swap;
            src: url("${codiconUri.toString()}") format("truetype");
        }

        :root {
            --primary: var(--vscode-button-background);
            --primary-foreground: var(--vscode-button-foreground);
            --text: var(--vscode-foreground);
            --text-muted: var(--vscode-descriptionForeground);
            --border: var(--vscode-widget-border);
            --hover-bg: var(--vscode-list-hoverBackground);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        * {
            box-sizing: border-box;
        }

        body {
            padding: 0;
            margin: 0;
            font-family: var(--vscode-font-family);
            background: var(--vscode-sideBar-background);
            color: var(--text);
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .results-container {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 16px;
            animation: fadeIn 0.3s ease;
        }

        .results-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 14px 16px;
            background: var(--vscode-editor-background);
            border-radius: 8px;
        }

        .results-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
            margin: 0;
        }

        .results-icon {
            width: 20px;
            height: 20px;
            object-fit: contain;
        }

        .results-count {
            font-size: 11px;
            font-weight: 600;
            color: var(--primary-foreground);
            background: var(--primary);
            padding: 3px 10px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .result-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .result-item:hover {
            background: var(--hover-bg);
            border-color: var(--primary);
            box-shadow: 0 3px 10px rgba(0,0,0,0.12);
            transform: translateX(3px);
        }

        .result-line {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 50px;
            height: 30px;
            padding: 0 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            color: #ffffff;
            flex-shrink: 0;
            font-variant-numeric: tabular-nums;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .result-content {
            flex: 1;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            line-height: 1.6;
            color: var(--text);
            overflow: hidden;
            padding: 8px 12px;
            background: var(--vscode-textBlockQuote-background);
            border-radius: 6px;
            border-left: 3px solid;
        }

        .result-content.wrap {
            white-space: pre-wrap;
            word-break: break-word;
        }

        .result-content.no-wrap {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .match-highlight {
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            text-align: center;
            color: var(--text-muted);
        }

        .empty-state .codicon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-state h3 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
        }

        .empty-state p {
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
            max-width: 300px;
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--vscode-editor-background);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--vscode-scrollbarSlider-background);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--vscode-scrollbarSlider-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="results-container">
        <div id="results"></div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const resultsDiv = document.getElementById('results');
        let shouldWrap = true;

        function renderResults(results) {
            resultsDiv.innerHTML = '';

            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="empty-state">' +
                    '<span class="codicon codicon-search"></span>' +
                    '<h3>No Results</h3>' +
                    '<p>Run a search from the Queries panel to see results here.</p>' +
                    '</div>';
                return;
            }

            // Render all results in a flat list
            results.forEach(function(result, index) {
                result.matches.forEach(function(match, matchIndex) {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.style.animationDelay = (index * 0.05) + 's';
                    resultItem.addEventListener('click', function() {
                        vscode.postMessage({
                            command: 'goToLine',
                            line: result.line,
                            character: 1
                        });
                    });

                    const before = escapeHtml(result.text.substring(0, match.startChar));
                    const matched = escapeHtml(result.text.substring(match.startChar, match.endChar));
                    const after = escapeHtml(result.text.substring(match.endChar));

                    const lineNum = document.createElement('span');
                    lineNum.className = 'result-line';
                    lineNum.textContent = result.line;
                    lineNum.style.background = 'linear-gradient(135deg, ' + match.backgroundColor + ' 0%, ' + adjustColor(match.backgroundColor, -20) + ' 100%)';
                    lineNum.style.color = match.foregroundColor;

                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'result-content ' + (shouldWrap ? 'wrap' : 'no-wrap');
                    contentDiv.style.borderLeftColor = match.backgroundColor;
                    contentDiv.innerHTML = before + '<span class="match-highlight" style="background-color:' + match.backgroundColor + '; color:' + match.foregroundColor + ';">' + matched + '</span>' + after;

                    resultItem.appendChild(lineNum);
                    resultItem.appendChild(contentDiv);
                    resultsDiv.appendChild(resultItem);
                });
            });
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function adjustColor(hex, percent) {
            const num = parseInt(hex.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return '#' + (0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            ).toString(16).slice(1);
        }

        window.addEventListener('message', function(event) {
            const message = event.data;
            switch (message.command) {
                case 'noEditor':
                    resultsDiv.innerHTML = '<div class="empty-state">' +
                        '<span class="codicon codicon-warning"></span>' +
                        '<h3>No Active Editor</h3>' +
                        '<p>' + message.message + '</p>' +
                        '</div>';
                    break;
                case 'results':
                    renderResults(message.results);
                    break;
                case 'wrapToggle':
                    shouldWrap = message.wrap;
                    const contents = resultsDiv.querySelectorAll('.result-content');
                    contents.forEach(function(el) {
                        el.classList.remove('wrap', 'no-wrap');
                        el.classList.add(shouldWrap ? 'wrap' : 'no-wrap');
                    });
                    break;
            }
        });

        renderResults([]);
    </script>
</body>
</html>`;
}
