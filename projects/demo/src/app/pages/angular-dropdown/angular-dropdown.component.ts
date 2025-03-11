import { Component } from '@angular/core';
import {
    MagienoBootstrapDropdownComponent
} from "../../../../../magieno/angular-dropdown/src/lib/magieno-bootstrap-dropdown.component";
import {ItemInterface} from '../../../../../magieno/angular-dropdown/src/lib/interfaces/item.interface';

@Component({
  selector: 'app-angular-dropdown',
    imports: [
        MagienoBootstrapDropdownComponent
    ],
  templateUrl: './angular-dropdown.component.html',
  styleUrl: './angular-dropdown.component.scss'
})
export class AngularDropdownComponent {
  items: ItemInterface[] = [
    {
      title: "Item 1",
      value: "item_1",
    },
    {
      title: "Item 2",
      value: "item_2",
    }
  ]

  itemSelected(item: ItemInterface) {
    console.log(item);
  }
}
