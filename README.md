# Family History

## Entity Relationship Diagram

```mermaid
erDiagram

MENU }o--o| ROLE_MENU: "has"
ROLE }o--o| ROLE_MENU: "has"
ROLE }o--o| ROLE_PERMISSION: "has"
PERMISSION }o--|| MENU: "has"
PERMISSION }o--o| ROLE_PERMISSION: "has"
USER }o--|| ROLE: "has"
USER |o--o{ SESSION: "has"
```
