export type OperationResult<Success, Error> =
  | { result: "success"; value: Success }
  | { result: "error"; errors: Error[] }

export const success = <Success, Error>(
  value: Success,
): OperationResult<Success, Error> => ({
  result: "success",
  value,
})

export const failure = <Success, Error>(
  errors: Error[],
): OperationResult<Success, Error> => ({
  result: "error",
  errors,
})
