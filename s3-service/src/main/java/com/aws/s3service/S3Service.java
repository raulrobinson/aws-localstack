package com.aws.s3service;

import com.aws.s3service.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.util.List;

@Slf4j
@Service
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucket;

    private final S3Client s3;

    public S3Service(S3Client s3) {
        this.s3 = s3;
    }

    public String upload(String key, byte[] content) {
        log.info("Subiendo archivo: {} al bucket: {}", key, bucket);
        s3.putObject(PutObjectRequest.builder().bucket(bucket).key(key).build(),
                RequestBody.fromBytes(content));
        return "Archivo subido: " + key;
    }

    public byte[] download(String key) {
        log.info("Descargando archivo: {} desde el bucket: {}", key, bucket);
        ResponseBytes<GetObjectResponse> objectBytes = s3.getObjectAsBytes(
                GetObjectRequest.builder().bucket(bucket).key(key).build());
        return objectBytes.asByteArray();
    }

    public List<String> list() {
        log.info("Listando archivos en el bucket: {}", bucket);
        List<String> res = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build())
                .contents()
                .stream()
                .map(S3Object::key)
                .toList();
        log.info("Archivos encontrados: {}", res);
        return res;
    }

    public String delete(String key) {
        List<String> files = list();
        if (!files.contains(key)) {
            log.warn("Archivo no encontrado: {}", key);
            throw new NotFoundException("Archivo no encontrado: " + key);
        }
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        return "Archivo eliminado: " + key;
    }
}


