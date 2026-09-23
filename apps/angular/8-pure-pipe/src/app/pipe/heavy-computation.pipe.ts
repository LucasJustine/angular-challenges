import { Pipe, PipeTransform } from '@angular/core';
import { heavyComputation } from './heavy-computation';

@Pipe({
  name: 'heavyComputation',
  pure: true,
})
export class HeavyComputationPipe implements PipeTransform {
  transform(name: string, index: number): string {
    return heavyComputation(name, index);
  }
}
