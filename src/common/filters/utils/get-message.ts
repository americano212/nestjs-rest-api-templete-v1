export function getMessage(exception: unknown): string {
  return exception instanceof Error ? exception.message : 'UNKNOWN ERROR!';
}
