Common with files service readme

### Handle File Fields in DTOs

`common/servcies/common-with-files.service.ts`

This service adds a unified way to process file fields defined in Create-\* DTOs.
It automatically detects DTO properties that contain uploaded files, stores the entity in the database, and uploads the files to S3 using a consistent folder structure.

#### How it works

For any DTO that includes file fields (e.g. MultipartFile[]), the service:

- Creates the entity in the database.
- Extracts all file-type fields from the DTO.
- Uploads each file to S3 under a structured and predictable path:

```ts
/uploads/:entity-short-name/:entity-id/:field-name/:file-id
```

#### Example

For `CreateRequestDto`:

```ts
class CreateRequestDto {
  images: MultipartFile[];
  files: MultipartFile[];
  cover: MultipartFile;
}
```

After calling .createOneWithFiles():

- The request entity is created.
- Files are uploaded to the following S3 paths:

```
/uploads/reqs/<entity-uuid>/images/<file-uuid>
/uploads/reqs/<entity-uuid>/files/<file-uuid>
/uploads/reqs/<entity-uuid>/cover/<file-uuid>
```

### Summary

This PR introduces reusable file-handling logic that:

- Avoids duplication across services
- Ensures uniform S3 directory structure
- Simplifies entity creation with related file uploads
