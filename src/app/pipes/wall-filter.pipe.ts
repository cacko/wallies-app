import { Pipe, PipeTransform } from '@angular/core';
import { WallCategory, WallEntity } from '../entity/api.entity';
import { RouteFilter } from '../components/wall/wall.component';
import { distanceFrom } from '../entity/colors';
import { isEmpty, isString } from 'lodash-es';

@Pipe({
  name: 'wallFilter',
})
export class WallFilterPipe implements PipeTransform {
  transform(items: WallEntity[], filter: RouteFilter): WallEntity[] {
    if (items.length > 0) {
      const categories = isEmpty(filter?.c)
        ? Object.values(WallCategory).filter(isString)
        : filter.c;
      const colors = filter?.h || [];
      return items.filter(
        (p) =>
          categories?.includes(p.category) &&
          (!colors.length ||
            Math.min(
              ...p.colors.split(',').map((pc) => distanceFrom(colors, pc))
            ) < 40)
      );
    }
    return items;
  }
}
