import * as Handlebars from 'handlebars';

import { dayjs } from 'src/common/helpers';

/**
 * Setup Handlebars helpers
 */
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('ifEquals', function (a, b, options) {
    return a == b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('ifNotEquals', function (a, b, options) {
    return a != b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('parse', function (text) {
    if (!text) return;
    const template = Handlebars.compile(text);
    return new Handlebars.SafeString(template(this));
  });

  Handlebars.registerHelper('formatDateByTZ', function (date, tz, format) {
    tz = typeof tz === 'string' ? tz : 'UTC';
    format = typeof format === 'string' ? format : 'DD MMM YYYY HH:mm';

    try {
      if (!date) return date;
      const parsed = dayjs(date);
      if (!parsed.isValid()) return date;

      return parsed.tz(tz).format(format);
    } catch {
      return date;
    }
  });
}
