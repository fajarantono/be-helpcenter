// src/common/api-response.ts

export const createApiResponse = (
  message: { code: number; message: string } | null = null,
  data: any = null,
  meta: any = null,
) => {
  const response: any = {
    success: true,
    errors: false,
    code: null,
    message,
    data,
    meta,
  };

  if (!message) {
    delete response.message;
    delete response.code;
  } else {
    response.code = message.code;
    response.message = message.message;
  }
  if (!data) delete response.data;
  if (!meta) delete response.meta;

  return response;
};
