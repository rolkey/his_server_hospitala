import { Transform } from 'class-transformer';
import DateFormater from '@/utils/DateFormater';

export const DateTransformer = () => {
  return Transform(({ value }) => {
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return null;
    }

    return DateFormater.formatDate(value);
  });
};
