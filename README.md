# elegancemysql README

## Features

1.Easy to configure database connection.

![configure example](/example/config.png)

> ATTENSION:
> other extensions can get configuration for eleganc_mysql.
> if there is any malicious extension,
> it will leak database connection information from settings.json.

## Compatible target

MySql 5.7.X, MySql 8.X

## Extension Settings

- elegance.mysql.databases:

```json
{
  "name": "local",
  "host": "127.0.0.1",
  "port": 3306,
  "user": "root",
  "password": "mysqlpassword",
  "schemaFilterEnable": false,
  "showSchemas": []
}
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 0.1.0-alpha

- Add feature

**Enjoy!**
