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

@Component({
  selector: 'magieno-bootstrap-dropdown',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './angular-bootstrap-dropdown.component.html',
  styleUrl: './angular-bootstrap-dropdown.component.scss'
})
export class AngularBootstrapDropdownComponent implements OnInit, AfterViewInit {

  // <editor-fold desc="Items">
  @Input()
  items: ItemInterface[] = [];

  @Output()
  itemSelect = new EventEmitter<ItemInterface>();

  @Output()
  itemDeselect = new EventEmitter<ItemInterface>();

  itemSelected(item: ItemInterface) {
    this.itemSelect.emit(item);
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
  @Input()
  selectedItems: ItemInterface[] = [];

  selectedItemClicked(item: ItemInterface) {
    // When an item already selected is clicked on, it means we want to deselect it.
    this.itemDeselect.emit(item);
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

  ngOnInit() {
    this.subscriptions.push(this.searchControl.valueChanges.subscribe((value) => {
      this.cursorPosition = -1;

      //this.filterOptions();

      this.updateDropdown(true)
    }));

    //this.filterOptions();
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
}
