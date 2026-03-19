export enum StatusCode {
  OK = 200,
  Created = 201,
  Deleted = 204,
  Invalid = 400,
  NotFound = 404,
  ServerError = 500,
}

export enum HTTPMethod {
  Get = 'GET',
  Put = 'PUT',
  Post = 'POST',
  Delete = 'DELETE',
}
