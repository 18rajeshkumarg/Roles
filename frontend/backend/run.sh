#!/bin/bash
cd "$(dirname "$0")"
exec python3 manage.py runserver 0.0.0.0:8000