import {OperatorFunction} from 'rxjs';
import {scan} from 'rxjs/operators';

export function asArray<T>(): OperatorFunction<T, T[]> {
  return source => {
    return source.pipe(
      scan((array: T[], item: T) => array.concat(item), [])
    );
  };
}
