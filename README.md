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

## Day 1 Evidence

### API health endpoint
![API health response](docs/screenshots/day-01-health-api.png)

### React dashboard showing live API result
![Dashboard with API health](docs/screenshots/day-01-dashboard.png)