export function createRepMock(code?: number, mimetype?: string, headers?: any): any {
  return {
    request: {
      headers: {},
    },
    headers(data: any) {
      if (headers) expect(data).toEqual(headers);
      return this;
    },
    status(data: number) {
      if (code) expect(data).toEqual(code);
      return this;
    },
    type(data: string) {
      if (mimetype) expect(data).toEqual(mimetype);
      return this;
    },
    async send() {
      return this;
    },
  };
}
