# Codeingil TaskFlow

A project and task management app built for the Codeingil 10-day full stack drill.

## Stack
Laravel 12 (REST API), React 19 + Vite, Tailwind CSS, MySQL, Sanctum.

## Prerequisites
PHP 8.2+, Composer, Node.js LTS, MySQL (WAMP), Git.

## Backend setup
    cd backend
    composer install
    copy .env.example .env
    php artisan key:generate
    php artisan migrate
    php artisan serve

API base URL: http://127.0.0.1:8000/api

## Frontend setup
    cd frontend
    copy .env.example .env
    npm install
    npm run dev

## Progress
- Day 1: health endpoint and responsive app shell
- Day 2: projects table, seeder, GET list/detail endpoints, Projects page
- Day 3: create and edit projects with server-side validation and inline form errors
- Day 4: delete, search, pagination, success and error feedback
- Day 5: tasks table, project-task relationship, nested task endpoints, project detail page
- Day 6: Sanctum SPA session auth, register/login/logout, policies and owner-scoped queries, protected routes

## Day 1 Evidence

### API health endpoint
![API health response](docs/screenshots/day-01-health-api.png)


### React dashboard showing live API result
![Dashboard with API health](docs/screenshots/day-01-dashboard.png)

## Day 2 Evidence

### Projects page (data from MySQL)
![Projects page](docs/screenshots/day-02-projects.png)

### Postman: list projects and 404
![Postman list](docs/screenshots/day-02-postman-list.png)
![Postman 404](docs/screenshots/day-02-postman-404.png)

### Seeded rows in MySQL
![phpMyAdmin projects](docs/screenshots/day-02-phpmyadmin-projects.png)

### Data flow

```
1. User opens /projects, React renders the Projects page
2. useEffect runs once and calls getProjects(), Axios sends GET /api/projects
3. Laravel matches the route in routes/api.php and calls ProjectController@index
4. Eloquent runs SELECT * FROM projects ORDER BY id (plus one query for owners)
5. MySQL returns rows, Laravel turns them into JSON {"data":[...]}
6. Axios receives the JSON, setProjects(res.data.data) updates state
7. React re-renders: projects.map() creates one ProjectCard per project
```

## Day 3 Evidence

### React Project creation Page
![Project Page](docs/screenshots/day-03-new-project-creation.png)

### Postman: create project
![Postman list](docs/screenshots/day-03-postman-create.png)

### Postman: validation error (422)
![Postman list](docs/screenshots/day-03-postman-422.png)

### Postman: update project
![Postman list](docs/screenshots/day-03-postman-update.png)


## Day 4 Evidence

### Delete confirmation
![Delete confirmation](docs/screenshots/day-04-delete-confirm.png)

### Delete success message
![Delete success](docs/screenshots/day-04-delete-success.png)

### Search
![Search](docs/screenshots/day-04-search.png)

### Pagination
![Pagination](docs/screenshots/day-04-pagination.png)

### Postman: 404 (missing record)
![Postman 404](docs/screenshots/day-04-postman-404.png)

### Postman: 422 (invalid input)
![Postman 422](docs/screenshots/day-04-postman-422.png)

### Postman: 204 (successful delete)
![Postman 204](docs/screenshots/day-04-postman-delete-204.png)


## Day 5 Evidence

### Project 1 and its tasks
![Project 1 tasks](docs/screenshots/day-05-project-1-tasks.png)

### Project 2 and its tasks (different from project 1)
![Project 2 tasks](docs/screenshots/day-05-project-2-tasks.png)

### Task form with inline validation error
![Task form error](docs/screenshots/day-05-task-form-error.png)

### Postman: 201 (task created, with project_id)
![Postman create task](docs/screenshots/day-05-postman-create-task.png)

### Postman: 422 (invalid status, priority and due date)
![Postman 422](docs/screenshots/day-05-postman-422.png)

### Postman: 204 (successful task delete)
![Postman 204](docs/screenshots/day-05-postman-delete-task-204.png)

### Postman: 404 after deleting a project (cascade)
![Postman cascade](docs/screenshots/day-05-postman-cascade.png)

### Foreign key constraint (orphan task rejected by MySQL)
![Foreign key error](docs/screenshots/day-05-fk-error.png)

## Day 6 Evidence

### Login page
![Login page](docs/screenshots/day-06-login.png)

### Register page with validation error
![Register page](docs/screenshots/day-06-register.png)

### User A sees only their own projects
![User A projects](docs/screenshots/day-06-user-a-projects.png)

### User B sees a different list
![User B projects](docs/screenshots/day-06-user-b-projects.png)

### User B opens User A's project (404, no information leaked)
![Project not found](docs/screenshots/day-06-ui-not-found.png)

### Postman: 401 (guest cannot access protected endpoint)
![Postman 401](docs/screenshots/day-06-postman-401.png)

### Postman: 200 (login)
![Postman login](docs/screenshots/day-06-postman-login.png)

