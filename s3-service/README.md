# AWS S3

Crear el Bucket:

Para crear el bucket, puedes usar la consola de AWS o ejecutar el siguiente comando en la terminal:

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-bucket-test
```

1. Subir un archivo (/s3/upload)

```bash
curl -v -X POST http://localhost:8080/s3/upload \
  -F "file=@/ruta/al/JWT-flow.png"
```

2. Listar archivos (/s3/list)

```bash
curl -v http://localhost:8080/s3/list
```

3. Descargar un archivo (/s3/download/{key})

```bash
curl -v http://localhost:8080/s3/download/nombre-del-archivo.txt -o JWT-flow.png
```

4. Eliminar un archivo (/s3/delete/{key})

```bash
curl -v -X DELETE http://localhost:8080/s3/delete/JWT-flow.png
```

