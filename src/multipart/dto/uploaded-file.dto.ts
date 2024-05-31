/**
 * [description]
 */
export class UploadedFile {
  /**
   * description]
   * @param data [description]
   */
  constructor(data: Partial<UploadedFile>) {
    Object.assign(this, data);
  }

  /**
   * [description]
   */
  public readonly data: any;

  /**
   * [description]
   */
  public readonly key: string;

  /**
   * [description]
   */
  public readonly filename: string;

  /**
   * [description]
   */
  public readonly fileSize: string;

  /**
   * [description]
   */
  public readonly mimetype: string;

  /**
   * [description]
   */
  public readonly encoding: string;

  /**
   * [description]
   */
  public readonly extname: string;
}
