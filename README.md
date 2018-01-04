# Angular 1.x UI-Router #

This documentation is for macOS / Linux-based platforms

## Initialisation ##

1. Install backend packages.
```
npm install
```
2. Install frontend packages.
```
bower install
```
3. Touch a `/.env` file on the project root level and declare your node port, MySQL username and MySQL password there. In `/.env`:
```
MYSQL_USER=
MYSQL_PASS=
NODE_PORT=
```

## Setting up the Grocer's Database ##
This full stack web app requires the use of MySQL Server (and MySQL Workbench).

1. Obtain a copy of `/grocery_list.sql`.
2. In Terminal, change to the directory `/angular_1_grocer`.
```
Your-Mac:somewhere You$ cd /path/to/angular_1_grocer
Your-Mac:test_db-master You$
```
3. From `/angular_1_grocer`, log in as root.
```
Your-Mac:test_db-master You$ mysql -uroot -p
```
4. In MySQL, create a new `angular_1_grocer` database.
```
CREATE DATABASE grocer;
```
5. Import `/grocery_list.sql` into `grocer`.
```
USE grocer;
SOURCE grocery_list.sql;
```

## Running locally ##
1. Run the app on Terminal.
```
Your-Mac:angular_1_grocer You$ nodemon
```
2. Open `localhost:3002` on your web browser.

## References ##
- NUS-ISS Stackup FSF
- [kenken77](https://bitbucket.org/kenken77/fsf17r4_day14)
- [Angular 1 UI-Router](https://ui-router.github.io/about/)