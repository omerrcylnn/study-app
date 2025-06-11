#!/usr/bin/env bash

# PostgreSQL driver'ı yükle
apt-get update
apt-get install -y php-pgsql

# Laravel bağımlılıkları
composer install --no-interaction --prefer-dist --optimize-autoloader

# Config işlemleri
php artisan config:clear
php artisan config:cache