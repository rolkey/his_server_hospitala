import { Transform } from 'class-transformer';
import DateFormater from '@/utils/DateFormater';

export const DateTransformer = () => {
  return Transform(({ value }) => {
    if (!value) return value;

    return DateFormater.formatDate(value);
  });
};
