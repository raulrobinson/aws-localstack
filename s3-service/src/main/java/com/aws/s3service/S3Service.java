package com.aws.s3service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucket;

    private final S3Client s3;

    public S3Service(S3Client s3) {
        this.s3 = s3;
    }

    public String upload(String key, byte[] content) {
        s3.putObject(PutObjectRequest.builder().bucket(bucket).key(key).build(),
                RequestBody.fromBytes(content));
        return "Archivo subido: " + key;
    }

    public byte[] download(String key) {
        ResponseBytes<GetObjectResponse> objectBytes = s3.getObjectAsBytes(
                GetObjectRequest.builder().bucket(bucket).key(key).build()
        );
        return objectBytes.asByteArray();
    }

    public List<String> list() {
        return s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build())
                .contents()
                .stream()
                .map(S3Object::key)
                .collect(Collectors.toList());
    }

    public String delete(String key) {
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        return "Archivo eliminado: " + key;
    }
}


