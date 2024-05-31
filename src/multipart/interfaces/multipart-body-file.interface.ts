import { MultipartFile } from '@fastify/multipart';

/**
 * [description]
 */
export interface MultipartBodyFile
  extends Omit<MultipartFile, 'file' | 'type' | 'toBuffer' | 'fieldname' | 'fields'> {
  /**
   * [decription]
   */
  readonly data: Buffer;

  /**
   * [decription]
   */
  key?: string;
}
