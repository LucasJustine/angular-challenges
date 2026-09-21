import { Directive, inject, TemplateRef } from '@angular/core';

import { City } from '../../model/city.model';
import { Student } from '../../model/student.model';
import { Teacher } from '../../model/teacher.model';

export type CardItem = City | Student | Teacher;

@Directive({
  selector: 'ng-template[appCardContentChild]',
})
export class CardContentChildDirective {
  public template = inject(
    TemplateRef<{ $implicit: CardItem; item: CardItem }>,
  );
}
