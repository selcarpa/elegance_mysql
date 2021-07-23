# Change Log

## [0.3.2]

- Add a lot of item in settings.json#elegance.mysql.databases
- Now view of "run selected sql" will displays a shorter title

## [0.3.1]

- Change version to 0.3.1
- Change name to Space Camel Case(With my another vscode extension [Camel Go Brr](https://marketplace.visualstudio.com/items?itemName=aethli.camelgobrr))
- Fix error not catched when creating connection
- Now whatever log level setted error message will display
- Now print sql when log level at least `Info`
- Now print result with `Logger.info`, while some "DELETE" or "UPDATE" statement excuted

## [0.3.0]

- Disable some command in command palette
- Give a process notify when sql is executing
- Give an error notify when sql excuting caused error
- Fix my banner "elegance"
- change to a simpler logo
- Add a copy menu to copy schema name or table name selected
- Toggle to output window to show result, while some "DELETE" or "UPDATE" statement excuted

## [0.2.1]

- Now "Add database" button will jump to workspace settings(Will be modified in future versions)

## [0.2.0]

- Add pagination feature to query.html(just support selectTop500 command)
- Fix colResizable doesn't take effect cause by code execute order
- ToolsBar and PaginationToolsBar change to float on the top/bottom of query.html
- Improve code(export some sql to a single file)

## [0.1.4]

- Fix tools bar doesn't displayed

## [0.1.3]

- Fix status bar doesn't show 'selectedSchema' when startup

## [0.1.2]

- Move "new query" context menu from table item to schema item
- Remove default for pagination
- Rewrite onDidChangeConfiguration part

## [0.1.1]

- Add icon
- Package with esbuild

## [0.1.0]

- Initial release
