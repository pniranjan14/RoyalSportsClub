#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Create superuser if env variables are present
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creating superuser..."
    python manage.py createsuperuser --no-input || true
fi

# Auto-seed the database if it is empty
echo "Checking database state for seeding..."
python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rsc_backend.settings'); django.setup(); from api.models import Sport; import subprocess; Sport.objects.exists() or subprocess.run(['python', 'seed.py'])" || true
