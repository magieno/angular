import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {ShowOpenFilePickerOptionsInterface} from './show-open-file-picker-options.interface';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'magieno-drag-and-drop',
  imports: [],
  template: `
    <div class=" dropzone" [class.dragEntered]="hasEnteredDropZone"
         (drop)="onDropEvent($event); $event.preventDefault();"
         (dragenter)="onDragEnterEvent($event); $event.preventDefault();"
         (dragover)="onDragOverEvent($event); $event.preventDefault();"
         (dragleave)="onDragLeaveEvent($event); $event.preventDefault();"
         (click)="click(); $event.preventDefault();"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: `.dropzone {
    border: 2px dashed #e9ecef;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border 0.3s ease;
    height: 100vh;
    width: 100vw;

    &.dragEntered {
      border-color: #0d6efd;
    }
  }
  `
})
export class MagienoDragAndDropComponent implements OnChanges, OnDestroy {
  hasEnteredDropZone = false;

  @Output()
  onDragEnter: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @Output()
  onDragLeave: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @Output()
  onDragOver: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @Output()
  onDrop: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @Output()
  onFileSystemHandlesDropped: EventEmitter<FileSystemHandle[]> = new EventEmitter<FileSystemHandle[]>();

  @Output()
  onFilesDropped: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  onFileSystemEntriesDropped: EventEmitter<FileSystemEntry[]> = new EventEmitter<FileSystemEntry[]>();

  @Input()
  showOpenFilePickerOptions?: ShowOpenFilePickerOptionsInterface

  @Input()
  clickEvents?: Observable<void>;

  private subscriptions: Subscription[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if(changes["clickEvents"] && this.clickEvents) {
      this.subscriptions.push(this.clickEvents.subscribe(() => this.openFilePicker()));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async onDropEvent(event: DragEvent) {
    if(!event.dataTransfer) {
      return;
    }

    if(event.dataTransfer.files) {
      const files: File[] = [];

      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file: File = event.dataTransfer.files[i];
        files.push(file);
      }

      this.onFilesDropped.emit(files);
    }

    const supportsFileSystemAccessAPI =
      'getAsFileSystemHandle' in DataTransferItem.prototype;

    const supportsWebkitGetAsEntry =
      'webkitGetAsEntry' in DataTransferItem.prototype;

    if(event.dataTransfer.items) {
      // Retrieve the file system handles and push them back.
      let fileSystemHandleItems: Promise<any>[] = [];
      let fileSystemEntryItems: Promise<any>[] = [];

      if(supportsFileSystemAccessAPI) {
        // @ts-ignore
        fileSystemHandleItems = [...event.dataTransfer.items].map(item => item.getAsFileSystemHandle());
      }

      if(supportsWebkitGetAsEntry) {
        // @ts-ignore
        fileSystemEntryItems = [...event.dataTransfer.items].map(item => item.webkitGetAsEntry());
      }

      const fileSystemHandles = [];
      for await (const item of fileSystemHandleItems) {
        fileSystemHandles.push(item);
      }

      const fileSystemEntries = [];
      for await (const item of fileSystemEntryItems) {
        fileSystemEntries.push(item);
      }

      if(fileSystemEntries.length > 0) {
        this.onFileSystemEntriesDropped.emit(fileSystemEntries);
      }

      if(fileSystemHandles.length > 0) {
        this.onFileSystemHandlesDropped.emit(fileSystemHandles);
      }
    }
  }

  onDragEnterEvent(event: DragEvent) {
    this.hasEnteredDropZone = true;
    this.onDragEnter.emit(event);
  }

  onDragOverEvent(event: DragEvent) {
    this.onDragOver.emit(event);
  }

  onDragLeaveEvent(event: DragEvent) {
    this.hasEnteredDropZone = false;

    this.onDragLeave.emit(event);
  }

  async openFilePicker() {
    if("showOpenFilePicker" in window) {
      // @ts-ignore
      const fileSystemFileHandles = await window.showOpenFilePicker(this.showOpenFilePickerOptions);

      this.onFileSystemHandlesDropped.emit(fileSystemFileHandles);
    }
  }

  click() {
    this.openFilePicker();
  }
}
