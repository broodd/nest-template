import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * [description]
 * @param validationOptions
 */
export function IsCoordinates(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isCoordinates',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: [number, number]) {
          try {
            const [longitude, latitude] = value;
            return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return '$property must be a valid coordinates [longitude (-180:180), latitude (-90:90)]';
        },
      },
    });
  };
}
