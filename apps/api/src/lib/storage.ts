import { randomUUID } from "node:crypto";
import { Client as MinioClient } from "minio";
import { env } from "../env.js";
import { ApiError } from "./api-error.js";

export interface StorageAdapter {
  put(params: { buffer: Buffer; originalName: string; mimeType: string }): Promise<string>;
  getUrl(storageKey: string): Promise<string>;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function assertUploadIsSafe(file: { mimetype: string; size: number }): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw ApiError.badRequest("UNSUPPORTED_FILE_TYPE", `Unsupported file type: ${file.mimetype}`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw ApiError.badRequest("FILE_TOO_LARGE", "File exceeds the 10MB size limit.");
  }
}

class MinioStorageAdapter implements StorageAdapter {
  private client: MinioClient;
  private bucketReady: Promise<void> | undefined;

  constructor() {
    this.client = new MinioClient({
      endPoint: env.storage.endpoint,
      port: env.storage.port,
      useSSL: env.storage.useSSL,
      accessKey: env.storage.accessKey,
      secretKey: env.storage.secretKey,
    });
  }

  private async ensureBucket(): Promise<void> {
    if (!this.bucketReady) {
      this.bucketReady = (async () => {
        const exists = await this.client.bucketExists(env.storage.bucket).catch(() => false);
        if (!exists) {
          await this.client.makeBucket(env.storage.bucket);
        }
      })();
    }
    return this.bucketReady;
  }

  async put(params: { buffer: Buffer; originalName: string; mimeType: string }): Promise<string> {
    await this.ensureBucket();
    const safeExt = params.originalName.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") ?? "bin";
    const storageKey = `leads/${randomUUID()}.${safeExt}`;
    await this.client.putObject(env.storage.bucket, storageKey, params.buffer, params.buffer.length, {
      "Content-Type": params.mimeType,
    });
    return storageKey;
  }

  async getUrl(storageKey: string): Promise<string> {
    await this.ensureBucket();
    return this.client.presignedGetObject(env.storage.bucket, storageKey, 60 * 60);
  }
}

export const storageAdapter: StorageAdapter = new MinioStorageAdapter();
