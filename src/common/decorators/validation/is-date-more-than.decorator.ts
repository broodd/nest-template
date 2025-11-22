import { ValidationArguments, ValidationOptions, ValidateBy } from 'class-validator';

/**
 * Check is date more than some field or NOW
 * @param property
 * @param options
 */
export const IsDateMoreThan = (property?: string, options?: ValidationOptions): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsDateMoreThan',
      constraints: [property],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints;

          if (relatedPropertyName) {
            const relatedValue = (args.object as Record<string, unknown>)[
              relatedPropertyName
            ] as Date;

            return new Date(value).getTime() > new Date(relatedValue).getTime();
          }

          return new Date(value).getTime() > new Date().getTime();
        },
        defaultMessage: (args: ValidationArguments): string => {
          const [relatedPropertyName] = args.constraints;
          if (relatedPropertyName) return `${args.property} must be after ${relatedPropertyName}`;

          return `${args.property} must be a future date`;
        },
      },
    },
    options,
  );

/**
 * Check is date more than some field or NOW
 * @param property
 * @param options
 */
export const IsDateMoreThanOrEaqul = (
  property?: string,
  options?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsDateMoreThan',
      constraints: [property],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints;

          if (relatedPropertyName) {
            const relatedValue = (args.object as Record<string, unknown>)[
              relatedPropertyName
            ] as Date;

            return new Date(value).getTime() >= new Date(relatedValue).getTime();
          }

          return new Date(value).getTime() >= new Date().getTime();
        },
        defaultMessage: (args: ValidationArguments): string => {
          const [relatedPropertyName] = args.constraints;
          if (relatedPropertyName) return `${args.property} must be after ${relatedPropertyName}`;

          return `${args.property} must be a future date`;
        },
      },
    },
    options,
  );
