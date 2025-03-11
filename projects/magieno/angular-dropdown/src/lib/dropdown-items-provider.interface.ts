import {ItemInterface} from './interfaces/item.interface';

export interface DropdownItemsProviderInterface {
  getItems(search: string): Promise<ItemInterface[]>;
}
