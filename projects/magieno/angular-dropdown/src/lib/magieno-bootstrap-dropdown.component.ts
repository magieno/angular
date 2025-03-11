import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {isPlatformServer} from '@angular/common';
import {ItemInterface} from './interfaces/item.interface';
import {DropdownItemsProviderInterface} from './dropdown-items-provider.interface';

export type Item = ItemInterface | any;

@Component({
  selector: 'magieno-bootstrap-dropdown',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './magieno-bootstrap-dropdown.component.html',
  styleUrl: './magieno-bootstrap-dropdown.component.scss'
})
export class MagienoBootstrapDropdownComponent implements OnInit, AfterViewInit {

  /**
   * Named control to avoid confusion with default formControl property binding.
   */
  @Input()
  control = new FormControl<null | any | any[]>(null)

  @Input()
  itemsProvider?: DropdownItemsProviderInterface;

  /**
   * The key of the item that should be used as the label.
   *
   * By default, it assumes it's an ItemInterface and will use the "title" key.
   *
   * If you pass nothing, the value will be returned as the label.
   */
  @Input()
  labelKey: string | null = "title";

  getLabel(item: Item) : string {
    if(!item) {
      return item;
    }

    if(this.labelKey === null) {
      return this.getValue(item);
    }

    if(item.hasOwnProperty(this.labelKey) === false) {
      throw new Error(`The item does not have the key '${this.labelKey}', we cannot use it as the label.`);
    }

    return item[this.labelKey];
  }

  /**
   * The key of the item that should be used as the value.
   *
   * By default, it assumes it's an ItemInterface and will use the "value" key and will assign it as the value in the formControl.
   *
   * If you specify null, it will direclty assign the whole object as the value in the formControl.
   */
  @Input()
  valueKey: string | null = "value";

  getValue(item: Item): string {
    if(!item) {
      return item;
    }

    if(this.valueKey === null) {
      return item;
    }

    if(item.hasOwnProperty(this.valueKey) === false) {
      throw new Error(`The item does not have the key '${this.valueKey}', we cannot use it as the value.`);
    }

    return item[this.valueKey];
  }

  // <editor-fold desc="Items">
  @Input()
  items: Item[] = [];

  displayedItems: Item[] = [];

  async getItems(): Promise<Item[]> {
    if(!this.itemsProvider) {
      const search = this.searchControl.value;

      if(search === null) {
        return this.items;
      }

      // Filter the current items and return the filtered options
      return this.items.filter((item) => {

        // If we don't allow multiple selection, we should still show the item if it's already selected.
        if(!this.multiple) {
          return (item.value.toLowerCase().includes(search.toLowerCase()) || item.title.toLowerCase().includes(search.toLowerCase()))
        }

        // If multiple is allowed, then we should only show the item if it's not already selected.
        return this.selectedItems.includes(item) === false && (item.value.toLowerCase().includes(search.toLowerCase()) || item.title.toLowerCase().includes(search.toLowerCase()));
      });
    }

    return this.itemsProvider.getItems(this.searchControl.value ?? "");
  }

  @Output()
  itemSelect = new EventEmitter<Item>();

  @Output()
  itemDeselect = new EventEmitter<Item>();

  itemSelected(item: Item) {
    if(this.multiple === false) {
      this.selectedItems[0] = item;
      this.control.setValue(this.getValue(item));
    } else {
      this.selectedItems.push(item);
      this.control.setValue(this.selectedItems.map(item => this.getValue(item)));
    }

    this.itemSelect.emit(item);
    this.updateDisplayedItems();
    this.searchControl.setValue('');
  }
  // </editor-fold>

  // <editor-fold desc="Dropdown">
  @ViewChild("dropdownMenu")
  dropdownMenuElement!: ElementRef;

  subscriptions: Subscription[] = [];

  dropdown: any;

  @Input()
  dropdownOpen = false;

  @Output()
  click = new EventEmitter<void>();

  clicked() {
    this.click.emit();

    this.inputElement.nativeElement.focus();

    this.updateDropdown()
  }
  // </editor-fold>

  // <editor-fold desc="Selected Items">
  get selectedItem() {
    if(this.selectedItems.length === 0) {
      return null;
    }

    return this.selectedItems[0];
  }

  @Input()
  selectedItems: Item[] = [];

  selectedItemClicked(item: Item) {
    // When an item already selected is clicked on, it means we want to deselect it.
    this.itemDeselect.emit(item);

    // Remove element from selected array
    this.selectedItems = this.selectedItems.filter((selectedItem) => selectedItem !== item);

    this.updateDisplayedItems();
  }
  // </editor-fold>

  @ViewChild('inputElement')
  inputElement!: ElementRef;

  searchControl = new FormControl<string>("");

  @Input()
  focused: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  placeholder: string = "Select...";

  @Input()
  name: string = ""

  // <editor-fold desc="Cursor Positions">
  private _cursorPosition = -1;

  get cursorPosition(): number {
    return this._cursorPosition;
  }

  set cursorPosition(value: number) {
    this._cursorPosition = value;
  }

  moveCursorUp() {
    if(this.cursorPosition <= 0) {
      this.cursorPosition = -1;
      return;
    }

    this.cursorPosition--;
  }

  moveCursorDown() {
    if(this.cursorPosition >= this.items.length) {
      this.cursorPosition = 0;
      return;
    }

    this.cursorPosition++;
  }
  // </editor-fold>

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
  ) {
  }

  async ngOnInit() {
    this.subscriptions.push(this.searchControl.valueChanges.subscribe(async (value) => {
      this.cursorPosition = -1;

      this.updateDisplayedItems();

      this.updateDropdown(true)
    }));

    this.updateDisplayedItems();
  }

  ngAfterViewInit() {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    // @ts-ignore
    this.dropdown = new bootstrap.Dropdown(this.dropdownMenuElement.nativeElement);
  }

  keyUp(event: any) {
    if(event.key === "ArrowUp") {
      this.moveCursorUp();
    } else if(event.key === "ArrowDown") {
      this.moveCursorDown();
    } else if(event.key === "Enter") {
      this.itemSelected(this.items[this.cursorPosition]);
    }
  }

  updateDropdown(show?: boolean) {
    if(this.dropdownOpen && !show) {
      this.dropdown.hide();
      this.dropdownOpen = false;
    } else {
      this.dropdown.show();
      this.dropdownOpen = true;
    }
  }

  getPlaceholder(): string {
    if(this.selectedItems.length > 0) {
      return "";
    }

    return this.placeholder;
  }

  updateDisplayedItems() {
    this.getItems().then(items => {
      this.displayedItems = items;
    })
  }
}
