import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../types/maybe.type';
import slugify from 'slugify';

export const slugTransformer = (
  params: TransformFnParams,
): MaybeType<string> => {
  if (params.value == null) {
    return undefined;
  }
  return slugify(params.value, { lower: true }) as MaybeType<string>;
};
