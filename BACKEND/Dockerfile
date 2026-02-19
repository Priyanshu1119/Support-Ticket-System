# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Run database migrations and start server
# Using shell form to support environment variables and command chaining
CMD sh -c "\
    if [ \"$DATABASE\" = \"postgres\" ]; then \
    echo 'Waiting for postgres...'; \
    while ! nc -z $SQL_HOST $SQL_PORT; do \
    sleep 0.1; \
    done; \
    echo 'PostgreSQL started'; \
    fi; \
    python manage.py makemigrations && \
    python manage.py migrate --noinput && \
    python manage.py runserver 0.0.0.0:8000"
