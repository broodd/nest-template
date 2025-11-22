import { ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

/**
 * [description]
 * @param minAge
 * @param validationOptions
 */
export function IsMinimumAge(minAge: number = 18, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsMinimumAge',
      target: object.constructor,
      propertyName,
      constraints: [minAge],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (!value) return true;

          const dob = new Date(value);
          if (isNaN(dob.getTime())) return false;

          const today = new Date();

          // Calculate raw age difference in years
          let age = today.getFullYear() - dob.getFullYear();

          // Check if birthday hasn't occurred yet this year
          const isBeforeBirthday =
            today.getMonth() < dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

          // If the birthday is still ahead in the current year, subtract one
          if (isBeforeBirthday) {
            age--;
          }

          return age >= args.constraints[0];
        },

        defaultMessage(args: ValidationArguments) {
          return `You must be at least ${args.constraints[0]} years old`;
        },
      },
    });
  };
}
