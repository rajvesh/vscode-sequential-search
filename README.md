# Omni Search

A VS Code extension for executing multiple simultaneous text searches with individual color customization. Designed for log analysis, code review, and pattern matching workflows.

![Version](https://img.shields.io/visual-studio-marketplace/v/rajeshvasireddy.sequential-search)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/rajeshvasireddy.sequential-search)
![Rating](https://img.shields.io/visual-studio-marketplace/r/rajeshvasireddy.sequential-search)

## Features

- Multiple simultaneous search queries
- Customizable highlight colors per query
- Automatic contrast color for foreground
- Whole-line highlighting option
- Plain text and regular expression support
- Text wrapping toggle for results display
- Export/import query configurations
- Direct navigation to result locations
- Quick search via keyboard shortcuts

## Getting Started

1. Open a file in VS Code
2. Open the Omni Search panel from the Activity Bar
3. Enter search terms and configure display options
4. Click Search to highlight all matches
5. Click any result to navigate to that line

## Usage

### Query Configuration

Each search query supports:

| Setting | Options | Purpose |
|---------|---------|---------|
| Enabled | Checkbox | Toggle query on/off without deletion |
| Pattern | Text field | Search pattern or regex expression |
| Background Color | Color picker | Highlight color for matches |
| Foreground Color | Color picker | Text color for matches |
| Mode | Plain or Regex | Text matching method |
| Whole Line | Checkbox | Highlight full line instead of match |

### Results Display

- Click any result to navigate to that line
- Results show line number and highlighted match context
- Wrap toggle controls text wrapping in results

### Managing Queries

Add Query
: Create additional search patterns. Automatically generates a random background color and a contrasting foreground color.

Export
: Save current queries to a JSON file for later use

Import
: Load previously saved query configurations

Clear
: Remove all highlights and results

## Common Use Cases

**Log Analysis** - Color-code ERROR, WARNING, and INFO entries for quick pattern recognition

**Code Review** - Highlight TODO, FIXME, and custom comment markers

**Debugging** - Track multiple variable names or function calls simultaneously

**Data Processing** - Identify specific patterns in CSV, JSON, or structured text files

## Configuration Format

Exported query files use JSON format:

```json
{
  "version": "1.0",
  "queries": [
    {
      "enabled": true,
      "query": "ERROR",
      "backgroundColor": "#ff0000",
      "foregroundColor": "#ffffff",
      "type": "plain",
      "isWholeLine": true
    },
    {
      "enabled": true,
      "query": "WARNING",
      "backgroundColor": "#ffff00",
      "foregroundColor": "#000000",
      "type": "plain",
      "isWholeLine": false
    },
    {
      "enabled": true,
      "query": "INFO",
      "backgroundColor": "#0000ff",
      "foregroundColor": "#ffffff",
      "type": "plain",
      "isWholeLine": false
    }
  ]
}
```

## Troubleshooting

**No results appear**
- Ensure the target file is open and active in the editor
- Verify the search pattern is correct
- Check that at least one query is enabled

**Performance with large files**
- For files larger than 10MB, consider limiting the number of active queries
- Use specific patterns instead of broad match patterns

**Color visibility issues**
- The extension automatically selects a contrasting foreground color for the chosen background color. You can still customize it further if needed.

## License

MIT License. See [LICENSE](LICENSE) file for details.

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and updates.
