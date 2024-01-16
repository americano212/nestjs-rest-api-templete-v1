import { TypeORMError } from 'typeorm';

export declare class DatabaseConnectionException extends TypeORMError {
  constructor(name: string);
  code: string;
}
