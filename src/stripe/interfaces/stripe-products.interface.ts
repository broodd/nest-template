/**
 * [description]
 */
export interface StripeProductType {
  key: string;
  id?: string;

  success_url: string;
  cancel_url: string;
}

/**
 * [description]
 */
export type StripeProductsType = {
  rabbi_membership: StripeProductType;
  course_book: StripeProductType;
  event_deposit: StripeProductType;
  event_package: StripeProductType;
};

/**
 * [description]
 */
export interface StripeSessionMetadata {
  userId: string;
  key: keyof StripeProductsType;
}

/**
 * [description]
 * @example
 */
export interface CourseBookMetadata extends StripeSessionMetadata {
  bookOrderId: string;
}
