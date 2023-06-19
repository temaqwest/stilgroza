FROM postgres

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB stilgroza

COPY initialization.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
