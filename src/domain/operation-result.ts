// This files contains types representing state of operations that could fail.

// The type for the operation
export type OperationResult<Success, Error> =
  | { result: "success"; value: Success }
  | { result: "error"; errors: Error[] }

// Helper function for making the success and failure results
export const success = <Success, Error>(
  value: Success,
): OperationResult<Success, Error> => ({
  result: "success",
  value,
})

// Note that on the failure side it is possible to capture more than one type of
// failure. e.g. if there are both nodes with duplicate ids and if there is not a
// 'top left' node in the tree. This is the reason that I chose to use failure states
// over exceptions - with exceptions it is not quite as natural to report multiple
// different reasons for failure.
export const failure = <Success, Error>(
  errors: Error[],
): OperationResult<Success, Error> => ({
  result: "error",
  errors,
})
