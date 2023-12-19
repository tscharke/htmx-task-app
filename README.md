This is my way of playing to go deeper into the [hypermedia-system](https://hypermedia.systems)
and [HTMX](https://htmx.org).

To do this, I built an application that can be used to manage tasks. Managing means
**C**reating, listing (aka **R**ead :😉), **U**pdating and **D**eleting = [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).

To design my playground, I built a very naive version of an [express server](http://expressjs.com/).
This is only used to deliver the HTM**L**/**X** pages to the browser. The server contains the *minimum required things*
and has no validation, error-handling, etc. 🤷‍

Also, the "database" layer and the naive implementation of a "template engine" only serve the purpose of processing
the HTM**L**/**X** pages used here. It's possibly to replace further/other technologies for these layers later.

## 💻 Setup

### Prerequisites

- [Node](https://nodejs.org/en), Version >=20.7
- [PNPM](https://pnpm.io/), Version >= 8.7

### Lets go… 🚀

```bash
# Check out the master-branch of this repository and switch into this directory
git clone git@github.com:tscharke/htmx-task-app.git && cd "$(basename "$_" .git)"

# Setup environment variables
cp .env.example .env

# Install all dependencies
pnpm install

# Run/Start the development-server
pnpm run start
```

🤩 After starting the development-server, the application is showing up under [http://localhost:3001](http://localhost:3001).
