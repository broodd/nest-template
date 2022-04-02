export function createRepMock(code?: number, mimetype?: string, headers?: any): any {
  return {
    request: {
      headers: {},
    },
    headers: function (data: any) {
      if (headers) expect(data).toEqual(headers);
      return this;
    },
    status: function (data: number) {
      if (code) expect(data).toEqual(code);
      return this;
    },
    type: function (data: string) {
      if (mimetype) expect(data).toEqual(mimetype);
      return this;
    },
    send: async function () {
      return this;
    },
  };
}
