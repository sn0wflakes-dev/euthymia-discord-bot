export type WebResponse<T> = {
  metadata: Metadata;
  data: T;
  errors: Errors;
}

export type Metadata = {
  requestId: string;
  timestamp: string;
  path: string;
}

export type Errors = {
  errorCode: string;
  errorMessage: string;
  details: ErrorValidationDetail[];
}

export type ErrorValidationDetail = {
  Field: string;
  Message: string;
}
