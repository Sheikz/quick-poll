import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';


@Pipe({name: 'toLetter'})
export class ToLetter implements PipeTransform {

    transform(value: number) {
        return String.fromCharCode(65 + value);
    }

}
