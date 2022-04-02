import { DynamicModule } from '@nestjs/common';
import { expect } from 'chai';
import { spy } from 'sinon';

import { MULTIPART_MODULE_OPTIONS } from './multipart.constants';
import { MultipartModule } from './multipart.module';

describe('MultipartModule', () => {
  const defaultExpect = (dynamicModule: DynamicModule, include: any, length: number) => {
    expect(dynamicModule.exports).to.include(MULTIPART_MODULE_OPTIONS);
    expect(dynamicModule.providers).to.have.length(length);
    expect(dynamicModule.imports).to.be.undefined;
  };

  describe('register', () => {
    it('should provide an options', () => {
      const options: any = { test: 'test' };
      const dynamicModule = MultipartModule.register(options);
      defaultExpect(dynamicModule, MULTIPART_MODULE_OPTIONS, 3);
      expect(dynamicModule.providers).to.deep.include({
        provide: MULTIPART_MODULE_OPTIONS,
        useValue: options,
      });
    });

    it('should provide without options', () => {
      const dynamicModule = MultipartModule.register();
      defaultExpect(dynamicModule, MULTIPART_MODULE_OPTIONS, 3);
      expect(dynamicModule.providers).to.deep.include({
        provide: MULTIPART_MODULE_OPTIONS,
        useValue: {},
      });
    });
  });

  describe('register async', () => {
    describe('useFactory', () => {
      it('should provide an options', () => {
        const options: any = {};
        const asyncOptions = { useFactory: () => options };
        const dynamicModule = MultipartModule.registerAsync(asyncOptions);
        defaultExpect(dynamicModule, MULTIPART_MODULE_OPTIONS, 3);
        expect(dynamicModule.providers).to.deep.include({
          provide: MULTIPART_MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: [],
        });
      });
    });

    describe('useExisting', () => {
      it('should provide an options', () => {
        const asyncOptions: any = { useExisting: Object };
        const dynamicModule = MultipartModule.registerAsync(asyncOptions);
        defaultExpect(dynamicModule, MULTIPART_MODULE_OPTIONS, 3);
      });
    });

    describe('useClass', () => {
      it('should provide an options', () => {
        const asyncOptions: any = { useClass: Object };
        const dynamicModule = MultipartModule.registerAsync(asyncOptions);
        defaultExpect(dynamicModule, MULTIPART_MODULE_OPTIONS, 4);
      });

      it('provider should call "createMultipartOptions"', async () => {
        const asyncOptions: any = { useClass: Object };
        const dynamicModule: any = MultipartModule.registerAsync(asyncOptions);
        const optionsFactory = { createMultipartOptions: spy() };
        await dynamicModule.providers[0].useFactory(optionsFactory);
        expect(optionsFactory.createMultipartOptions.called).to.be.true;
      });
    });
  });
});
