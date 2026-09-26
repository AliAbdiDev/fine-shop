/**
 * type User = {
  id: number;
  name: string;
  age: number;
};
 * type UserWithStringAge = Override<User, { age: string }>;
  => { id: number; name: string; age: string }
 */
export type Override<
    T,
    R extends Partial<Record<keyof T, unknown>> = object,
> = Omit<T, keyof R> & R;
