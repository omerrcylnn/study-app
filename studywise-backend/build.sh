#!/bin/bash

composer install --no-dev --optimize-autoloader
php artisan config:clear
php artisan config:cache