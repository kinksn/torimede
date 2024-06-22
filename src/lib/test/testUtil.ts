type RequestBody = Record<string, any>;

export const createPOSTRequest = (body: RequestBody, endpoint: string) => {
  return new Request(`${process.env.API_URL}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const createPATCHRequest = (body: RequestBody, endpoint: string) => {
  return new Request(`${process.env.API_URL}${endpoint}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const createDELETERequest = (body: RequestBody, endpoint: string) => {
  return new Request(`${process.env.API_URL}${endpoint}`, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
};
